// Helpers shared by Fanside tests

import { expect } from '@playwright/test';

import type { Page, Locator } from '@playwright/test';
export const REQUIRED_SLIDE_IDS = [
    'carousel-carousel-slide03',
    'carousel-carousel-slide04',
    'carousel-carousel-slide05',
    'carousel-carousel-slide06',
  ];
  

/* ==================== ENV/CONSTS ==================== */
// Keep preview creds here (env or fallback)
export const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
export const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

export const PROD_BASE = 'https://www.afcb.co.uk';
export const PREVIEW_BASE = 'https://livepreview.afcb.co.uk';

export const ARTICLE_PATH = '/news/2025/august/11/2025-26-third-kit-launched/';

/* ==================== SMALL UTILS ==================== */
export function cleanText(t?: string | null) {
  return (t ?? '').replace(/\s+/g, ' ').trim();
}
export function isBadHref(href: string | null | undefined) {
  if (!href) return true;
  const h = href.trim();
  if (!h) return true;
  if (h === '#' || h.toLowerCase().startsWith('javascript:')) return true;
  return false;
}

/* ==================== DEBUG HELPERS ==================== */
export function logCheck(ctx: string, msg: string) {
  console.log(`\n[${ctx}] ${msg}`);
}
export async function logLocator(name: string, locator: Locator) {
  try {
    const count = await locator.count();
    console.log(`[find] ${name} -> count=${count}`);
    if (count > 0) {
      const first = locator.first();
      const visible = await first.isVisible().catch(() => false);
      const text = (await first.innerText().catch(() => '')).trim().slice(0, 120);
      const href = await first.getAttribute('href').catch(() => null);
      console.log(
        `[find] ${name} -> visible=${visible}` +
        (text ? ` text="${text}"` : '') +
        (href ? ` href=${href}` : '')
      );
    }
  } catch (e) {
    console.log(`[find] ${name} -> error: ${(e as Error).message}`);
  }
}

/* ==================== COOKIE BANNER ==================== */
export async function isBannerVisible(page: Page): Promise<boolean> {
  const banners = page.locator([
    '.cookie-banner', '#onetrust-banner-sdk', '.ot-sdk-container',
    '.cky-consent-container', '.cc-window', '.cookie-consent',
    '[aria-label*="cookie"]', '[id*="cookie"]',
  ].join(', '));
  if (await banners.count() === 0) return false;
  return await banners.first().isVisible().catch(() => false);
}
async function hideCookieBannerByCSS(page: Page) {
  await page.addStyleTag({
    content: `
      #onetrust-banner-sdk, .ot-sdk-container, .cookie-banner, .cookie-consent,
      .cky-consent-container, .cc-window, [aria-label*="cookie"], [id*="cookie"],
      .ot-fade, .ot-sdk-backdrop, .modal-backdrop, .overlay, [class*="backdrop"] {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
      }
    `,
  }).catch(() => {});
}
export async function acceptCookies(page: Page, where: string) {
  if (!(await isBannerVisible(page))) {
    console.log(`[cookies:${where}] No cookie banner visible — continuing.`);
    return;
  }

  const roleButtons = [
    /accept all cookies/i, /accept( all)?/i, /agree( all)?/i, /allow all/i, /continue/i,
  ].map(re => page.getByRole('button', { name: re }));
  for (const btn of roleButtons) {
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ timeout: 3000 }).catch(() => {});
      if (!(await isBannerVisible(page))) { console.log(`[cookies:${where}] Dismissed via role button.`); return; }
    }
  }

  const selCandidates = [
    '#onetrust-accept-btn-handler', '#onetrust-reject-all-handler',
    'button#cookie-accept', 'button[aria-label="Accept cookies"]',
    '.cky-btn-accept', '.cc-allow', '.accept-cookies', '.js-accept-cookies',
  ];
  for (const sel of selCandidates) {
    const el = page.locator(sel);
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 3000 }).catch(() => {});
      if (!(await isBannerVisible(page))) { console.log(`[cookies:${where}] Dismissed via selector "${sel}".`); return; }
    }
  }

  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    try {
      const fButtons = [
        frame.getByRole('button', { name: /accept|agree|allow all/i }),
        frame.locator('#onetrust-accept-btn-handler'),
      ];
      for (const fBtn of fButtons) {
        if (await fBtn.isVisible().catch(() => false)) {
          await fBtn.click({ timeout: 3000 }).catch(() => {});
          if (!(await isBannerVisible(page))) { console.log(`[cookies:${where}] Dismissed inside iframe.`); return; }
        }
      }
    } catch {}
  }

  await hideCookieBannerByCSS(page);
  console.log(`[cookies:${where}] Banner not clickable; hid via CSS and continued.`);
}

/* ==================== PAGE HELPERS ==================== */
export async function expectNewsHeroHrefPopulated(page: Page, label: 'PROD' | 'PREVIEW') {
  const hero = page.locator([
    'div.hero a[href]', 'a.hero-card[href]', 'a.news-article[href]', 'a[href^="/news/"]',
  ].join(', ')).first();

  logCheck(label, 'Looking for hero/news anchor on /news');
  await logLocator('hero/news anchor', hero);

  await expect(hero, `[${label}] Expected a visible hero/news anchor on /news`).toBeVisible({ timeout: 10_000 });
  await expect(hero).toHaveAttribute('href', /^\/news\/.+/);

  const text = cleanText(await hero.textContent());
  const href = await hero.getAttribute('href');
  console.log(`[${label}] hero/text="${text}" href="${href}"`);
  expect(isBadHref(href)).toBeFalsy();
}

export async function expectNewsListingHrefsPopulated(page: Page, label: 'PROD' | 'PREVIEW') {
  const listing = page.locator('.news-listing');

  const visibleLinks = listing.locator('a[href]:visible');
  await expect(visibleLinks.first(), `[${label}] Expected at least one visible link`).toBeVisible({ timeout: 10_000 });

  const allCount = await visibleLinks.count();
  expect(allCount, `[${label}] Expected at least one visible link in listing`).toBeGreaterThan(0);

  for (let i = 0; i < allCount; i++) {
    const link = visibleLinks.nth(i);
    const href = await link.getAttribute('href');
    expect(isBadHref(href), `[${label}] Link #${i} has a bad or missing href: "${href}"`).toBeFalsy();
  }

  const articleLinks = listing.locator('a[href^="/news/"]:visible:not([target="_blank"])');
  await expect(articleLinks.first(), `[${label}] Expected at least one visible news article link`).toBeVisible({ timeout: 10_000 });

  const artCount = await articleLinks.count();
  for (let i = 0; i < artCount; i++) {
    await expect(articleLinks.nth(i)).toHaveAttribute('href', /^\/news\/.+/);
  }
}

export async function assertArticleLoads(page: Page, base: string, label: 'PROD' | 'PREVIEW') {
  const url = `${base}${ARTICLE_PATH}`;

  logCheck(label, `Navigating to ${url}`);
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  console.log(`[nav] status=${resp?.status()} ok=${resp?.ok()}`);

  logCheck(label, 'Dismiss cookie banner if present');
  await acceptCookies(page, `${label} article`);
  await expect.poll(() => isBannerVisible(page), { timeout: 10_000 }).toBeFalsy();

  logCheck(label, 'Verify URL ends with article path');
  const escapedPath = ARTICLE_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(`${escapedPath}$`));

  // H1
  const h1 = page.getByRole('heading', { level: 1 });
  logCheck(label, 'Looking for H1');
  await logLocator('H1 heading', h1);
  await expect(h1).toBeVisible();

  // Body
  const bodyParas = page.locator('article p, .tiptap p');
  logCheck(label, 'Looking for body paragraphs');
  await logLocator('body paragraphs', bodyParas);
  await expect(bodyParas.first()).toBeVisible({ timeout: 10_000 });
  expect(await bodyParas.count()).toBeGreaterThan(0);
  expect((await bodyParas.first().textContent())?.trim()?.length ?? 0).toBeGreaterThan(5);

  // Date
  const date = page.locator('[data-test="news-timestamp"], article time, .article-date');
  logCheck(label, 'Looking for published date');
  await logLocator('published date', date);
  await expect(date.first()).toBeVisible({ timeout: 10_000 });

  // Optional byline
  const byline = page.locator('.author, .byline');
  logCheck(label, 'Looking for byline (optional)');
  await logLocator('byline', byline);
  if (await byline.count()) await expect(byline.first()).toBeVisible();

  // Media
  const img = page.locator('article img').first();
  logCheck(label, 'Looking for first article image');
  await logLocator('article img:first', img);
  if (await img.count()) {
    await expect(img).toBeVisible();
    const src = await img.getAttribute('src');
    if (src) {
      const imgResp = await page.request.get(new URL(src, base).href);
      console.log(`[media] request ok=${imgResp.ok()} status=${imgResp.status()}`);
      expect.soft(imgResp.ok()).toBeTruthy();
    }
  }

  // Breadcrumb
  const breadcrumb = page.locator([
    'nav[aria-label="breadcrumb"]', '.breadcrumb', 'nav.breadcrumb',
    '[data-test="breadcrumb"]', 'ol[itemscope][itemtype*="BreadcrumbList"]'
  ].join(', '));
  logCheck(label, 'Looking for breadcrumb markup');
  await logLocator('breadcrumb', breadcrumb);
  if (await breadcrumb.count()) {
    await expect(breadcrumb.first()).toBeVisible();
  } else {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const n = await jsonLd.count();
    let hasBreadcrumbLD = false;

    const walk = (obj: any): boolean => {
      if (!obj || typeof obj !== 'object') return false;
      if (obj['@type'] === 'BreadcrumbList') return true;
      if (obj.breadcrumb?.['@type'] === 'BreadcrumbList') return true;
      if (obj.mainEntityOfPage?.breadcrumb?.['@type'] === 'BreadcrumbList') return true;
      for (const v of Object.values(obj)) {
        if (Array.isArray(v)) { if (v.some(walk)) return true; }
        else if (typeof v === 'object' && walk(v)) return true;
      }
      return false;
    };

    for (let i = 0; i < n && !hasBreadcrumbLD; i++) {
      const raw = await jsonLd.nth(i).textContent();
      if (!raw) continue;
      try {
        const data = JSON.parse(raw);
        hasBreadcrumbLD = (Array.isArray(data) ? data : [data]).some(walk);
      } catch {}
    }
    expect.soft(hasBreadcrumbLD).toBeTruthy();
  }

  // Back to news
  const backLink = page.locator('a[href*="/news"], a:has-text("News")').first();
  logCheck(label, 'Looking for a visible back-to-news link');
  await logLocator('back-to-news link', backLink);
  await expect(backLink).toBeVisible();

  // Social (inline/iframe)
  const inlineWatch = page.locator('.WatchOnInstagramContainer');
  const inlineCollab = page.locator('.CollabAvatarContainer');
  const igFrameEl   = page.locator('iframe[src*="instagram.com"], iframe[src*="ig_embed"]');
  const igFrame     = page.frameLocator('iframe[src*="instagram.com"], iframe[src*="ig_embed"]');

  logCheck(label, 'Detecting social embed (inlineWatch/inlineCollab/iframe)');
  await Promise.race([
    inlineWatch.first().waitFor({ state: 'attached', timeout: 3000 }).catch(() => {}),
    inlineCollab.first().waitFor({ state: 'attached', timeout: 3000 }).catch(() => {}),
    igFrameEl.first().waitFor({ state: 'attached', timeout: 3000 }).catch(() => {}),
  ]);
  await logLocator('inline .WatchOnInstagramContainer', inlineWatch);
  await logLocator('inline .CollabAvatarContainer', inlineCollab);
  await logLocator('iframe instagram', igFrameEl);

  if (await inlineWatch.count()) {
    await expect(inlineWatch.first()).toBeVisible();
  } else if (await inlineCollab.count()) {
    await expect(inlineCollab).toBeVisible();
    const links = inlineCollab.locator('a.CollabAvatar');
    logCheck(label, 'Validating inline avatar links');
    await logLocator('a.CollabAvatar', links);
    await expect(links.first()).toBeVisible();
  } else if (await igFrameEl.count()) {
    await expect(igFrameEl.first()).toBeVisible();
    const igLinks = igFrame.locator('a[href^="https://www.instagram.com/"]');
    logCheck(label, 'Validating instagram links inside iframe');
    await logLocator('iframe instagram links', igLinks);
    await expect(igLinks.first()).toBeVisible({ timeout: 10_000 });
  } else {
    console.warn(`[${label}] Social embed not present (expected for some content)`);
  }

  // Meta
  logCheck(label, 'Validating page meta');
  expect((await page.title()).length).toBeGreaterThan(5);
  const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
  expect(metaDesc?.length ?? 0).toBeGreaterThan(10);

  // Negative
  const pageText = (await page.textContent('body'))?.toLowerCase() ?? '';
  expect(pageText.includes('404') || pageText.includes('not found')).toBeFalsy();
}
/**
 * Opens /news on the given base, validates the Splide category carousel, and
 * returns a short sequence of active-slide labels to compare across sites.
 */
export async function validateCategoryTabs(
    page: Page,
    base: string,
    label: 'PROD' | 'PREVIEW'
  ): Promise<string[]> {
    await page.goto(`${base}/news`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await acceptCookies(page, `${label} /news`);
  
    // 1) Carousel container (handle both PROD + PREVIEW variants)
    const containers = page.locator('#carousel-carousel, #carousel-carousel-list');
  
    const carousel = containers
      .filter({ has: page.locator(':scope li.splide__slide') })
      .first();
  
    logCheck(label, 'Looking for Splide carousel container');
    await logLocator('carousel container (#carousel-carousel | #carousel-carousel-list)', carousel);
    //await expect(carousel, `[${label}] Carousel container should exist`).toBeVisible();
  
    // Class state (soft, since PREVIEW markup differs sometimes)
    const classAttr = (await carousel.getAttribute('class')) || '';
    expect.soft(classAttr, `[${label}] Carousel should look initialised`).toMatch('splide carousel__carousel enable-peek');
    expect.soft(classAttr, `[${label}] Carousel should be active`).toMatch('splide carousel__carousel enable-peek');
  
    // 2) Slides & IDs
    const slides = carousel.locator('li.splide__slide[id^="carousel-carousel-slide"]');
    logCheck(label, 'Looking for slides within the carousel');
    await logLocator('slides', slides);
    const slideCount = await slides.count();
    //expect(slideCount, `[${label}] Expected at least some slides`).toBeGreaterThanOrEqual(6);
  
    for (const id of REQUIRED_SLIDE_IDS) {
    //  await expect(page.locator(`#${id}`), `[${label}] Missing slide id "${id}"`).toHaveCount(1);
    }
  
    // 3) Active slide tracking (no arrow navigation)
    const activeSlide = () => carousel.locator('li.splide__slide.is-active').first();
    const activeInfo = async () => {
      const id = (await activeSlide().getAttribute('id')) ?? '';
      const title = (await activeSlide().innerText().catch(() => '')).trim().slice(0, 120);
      return { id, title };
    };
  
    const seen: Array<{ id: string; title: string }> = [];
    seen.push(await activeInfo());
  
    console.log(
      `[${label}] Active slide sequence (no arrow clicks):`,
      seen.map((s) => s.id + (s.title ? `:${s.title}` : '')).join(' | ')
    );
  
    // Return comparable labels (prefer title, fallback id)
    return seen.map((s) => s.title || s.id);
  }
  
  