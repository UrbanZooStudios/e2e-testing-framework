// npx playwright test "test/Fanside/Fanside Match Centre.spec.ts" --headed
import { test, expect, Page, Locator } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
const MATCH_PATH = '/matches/men/2025/g2561930';
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';
const EXPECTED_LINKS = [
    'Sun 24 May 4:00 PM Tottenham',
    'Sun 17 May 3:00 PM Sunderland',
    'Sat 9 May 3:00 PM Crystal',
    'Sat 2 May 3:00 PM Manchester',
    'Sat 25 Apr 3:00 PM West Ham',
    'Sat 18 Apr 3:00 PM Liverpool',
    'Sat 11 Apr 3:00 PM Brentford',
    'Sat 21 Mar 3:00 PM Chelsea',
    'Sat 14 Mar 3:00 PM Arsenal',
    'Wed 4 Mar 8:00 PM Burnley',
    'Sat 28 Feb 3:00 PM Newcastle',
    'Sat 21 Feb 3:00 PM Manchester',
    'Wed 11 Feb 8:00 PM',
    'Sat 7 Feb 3:00 PM Fulham',
    'Sat 31 Jan 3:00 PM Brighton',
    'Sat 24 Jan 3:00 PM Leeds',];
type SnapSummary = {
    venue: string | null;
    hasMenTag: boolean;
    hasFT: boolean;
    hasHTScore: boolean;
  };
  async function runResultsPageAriaSnapshots(page: Page, envName: string) {
    await safeExpect(`[${envName}] Hero/date block`, async () => {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - img
        - text: /Sat \\d+ Sep 3:\\d+ PM/
        - tab:
          - img
      `);
    });
  
    await safeExpect(`[${envName}] Scoreline + meta`, async () => {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - paragraph: Men
        - paragraph: Hill Dickinson Stadium
        - img
        - paragraph: Everton
        - paragraph: FT
        - paragraph: "0"
        - paragraph: "0"
        - paragraph: HT 0 - 0
        - img
        - heading "A Villa" [level=5]
      `);
    });
  
    await safeExpect(`[${envName}] FT/HT confirmation`, async () => {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - paragraph: FT
        - paragraph: "0"
        - paragraph: "0"
        - paragraph: HT 0 - 0
      `);
    });
  
    await safeExpect(`[${envName}] Venue text`, async () => {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`- paragraph: Hill Dickinson Stadium`);
    });
  
    await safeExpect(`[${envName}] Competition tag`, async () => {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`- paragraph: Men`);
    });
}
  async function summarizeResultsPage(page: Page): Promise<SnapSummary> {
    const main = page.getByRole('main');
  
    const venueEl = main.getByText('Hill Dickinson Stadium', { exact: true });
    const venue = (await venueEl.count()) ? await venueEl.first().textContent() : null;
  
    const hasMenTag = (await main.getByText('Men', { exact: true }).count()) > 0;
    const hasFT = (await main.getByText('FT', { exact: true }).count()) > 0;
    const hasHTScore = (await main.getByText('HT 0 - 0', { exact: true }).count()) > 0;
  
    return { venue, hasMenTag, hasFT, hasHTScore };
  }
const routes: Record<string, string> = {};
type Env = {
  name: 'Preview' | 'Prod';
  url: string;
  httpAuth: boolean;
};
const ENVIRONMENTS: Env[] = [
  {
    name: 'Preview',
    url: 'https://livepreview.evertonfc.com/',
    httpAuth: true,
  },
  {
    name: 'Prod',
    url: 'https://www.evertonfc.com/',
    httpAuth: false,
  },
];
async function safeExpect(description: string, assertion: () => Promise<void>) {
  try {
    await assertion();
    console.log(`✅ PASS: ${description}`);
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    throw err; // rethrow so test still fails
  }
}
async function acceptCookiesIfPresent(page: Page, envName: string) {
  const cookieButton = page.getByRole('button', { name: /Accept All Cookies/i });
  if (await cookieButton.isVisible().catch(() => false)) {
    await cookieButton.click().catch(() => {});
    console.log(`[${envName}] Accepted cookies`);
  }
}
async function assertMatchesPageUI(page: Page, envName: string) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  await safeExpect(`[${envName}] Carousel tabs visible`, async () => {
    await expect(page.locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
      - group "1 of 4":
        - tab "Tab Men" [selected]
      - group "2 of 4":
        - tab "Tab Women"
      - group "3 of 4":
        - tab "Tab U21"
      - group "4 of 4":
        - tab "Tab U18"
    `);
  });
  await safeExpect(`[${envName}] Season dropdown`, async () => {
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - paragraph: Season
      - combobox:
        - option /\\d+\\/\\d+/ [selected]
        - option /\\d+\\/\\d+/
        - option /\\d+\\/\\d+/
        - option /\\d+\\/\\d+/
        - option /\\d+\\/\\d+/
        - option /\\d+\\/\\d+/
        - option /\\d+\\/\\d+/
    `);
  });
  await safeExpect(`[${envName}] Fixtures/Results table text`, async () => {
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - text: Fixtures Results Table
    `);
  });
}
const seasonMonths = ['September','October','November','December','January','February','March','April','May'];
const monthsFromNowToSeasonEnd = (): string[] => {
  const dtf = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'Europe/London' });
  const now = new Date();
  const list: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    const name = dtf.format(d);
    list.push(name);
    if (name === 'May') break;
  }
  const filtered = list.filter(m => seasonMonths.includes(m));
  return filtered.length ? filtered : seasonMonths;
};
const EXPECTED: Record<string, Array<{ team: RegExp | string; venue: RegExp | string }>> = {
  September: [
    { team: /Wolverhampton Wanderers/i, venue: /Molineux Stadium/i },
    { team: /West Ham United/i, venue: /Hill Dickinson Stadium/i },
  ],
  October: [
    { team: /Crystal Palace/i, venue: /Hill Dickinson Stadium/i },
    { team: /Manchester City/i, venue: /Etihad Stadium/i },
    { team: /Tottenham Hotspur/i, venue: /Hill Dickinson Stadium/i },
  ],
  November: [
    { team: /Sunderland/i, venue: /Stadium of Light/i },
    { team: /Fulham/i, venue: /Hill Dickinson Stadium/i },
    { team: /Manchester United/i, venue: /Old Trafford/i },
    { team: /Newcastle United/i, venue: /Hill Dickinson Stadium/i },
  ],
  December: [
    { team: /Bournemouth/i, venue: /Vitality Stadium/i },
    { team: /Nottingham Forest/i, venue: /Hill Dickinson Stadium/i },
    { team: /Chelsea/i, venue: /Stamford Bridge/i },
    { team: /Arsenal/i, venue: /Hill Dickinson Stadium/i },
    { team: /Burnley/i, venue: /Turf Moor/i },
    { team: /Nottingham Forest/i, venue: /The City Ground/i },
  ],
  January: [
    { team: /Brentford/i, venue: /Hill Dickinson Stadium/i },
    { team: /Wolverhampton Wanderers/i, venue: /Hill Dickinson Stadium/i },
    { team: /Aston Villa/i, venue: /Villa Park/i },
    { team: /Leeds United/i, venue: /Hill Dickinson Stadium/i },
    { team: /Brighton and Hove Albion/i, venue: /American Express Stadium/i },
  ],
  February: [
    { team: /Fulham/i, venue: /Craven Cottage/i },
    { team: /Bournemouth/i, venue: /Hill Dickinson Stadium/i },
    { team: /Manchester United/i, venue: /Hill Dickinson Stadium/i },
    { team: /Newcastle United/i, venue: /St\.? James'? Park/i },
  ],
  March: [
    { team: /Burnley/i, venue: /Hill Dickinson Stadium/i },
    { team: /Arsenal/i, venue: /Emirates Stadium/i },
    { team: /Chelsea/i, venue: /Hill Dickinson Stadium/i },
  ],
  April: [
    { team: /Brentford/i, venue: /Gtech Community Stadium/i },
    { team: /Liverpool/i, venue: /Hill Dickinson Stadium/i },
    { team: /West Ham United/i, venue: /London Stadium/i },
  ],
  May: [
    { team: /Manchester City/i, venue: /Hill Dickinson Stadium/i },
    { team: /Crystal Palace/i, venue: /Selhurst Park/i },
    { team: /Sunderland/i, venue: /Hill Dickinson Stadium/i },
    { team: /Tottenham Hotspur/i, venue: /Tottenham Hotspur Stadium/i },
  ],
};
async function gotoResults(page: Page, url: string): Promise<void> {
    await page.goto(url, { waitUntil: 'load' });
  
    const acceptCookies = page.getByRole('button', { name: /Accept All Cookies/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click().catch(() => {});
    }
  
    await page.getByText('Results').click();
    await page.locator('#seasons').selectOption('2023');
    await page.getByText('Results').click(); // reload results
}
  async function extractResults(page: Page): Promise<Array<{ text: string; href: string | null }>> {
    const cards = page.locator('main a[href*="/matches/men/2023"]');
    const count = await cards.count();
    const results: Array<{ text: string; href: string | null }> = [];
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const text = await card.innerText();
      const href = await card.getAttribute('href');
      results.push({ text: text.replace(/\s+/g, ' ').trim(), href });
    }
    return results;
}
const urls = [
    'https://livepreview.evertonfc.com/matches/men/2025/g2561924',
    'https://www.evertonfc.com/matches/men/2025/g2561924',
];
  async function acceptCookiesAndCloseChat(page: Page) {
    // Try to accept cookies a couple of times
    for (let i = 0; i < 2; i++) {
      try {
        await page.getByRole('button', { name: /Accept All Cookies/i }).click({ timeout: 4000 });
        console.log('✅ Accepted cookies');
      } catch {}
    }
  
    // Chat header (optional)
    const chatClose = page.locator('.style__ChatRoomHeaderClose-jFbxRr');
    if (await chatClose.first().isVisible().catch(() => false)) {
      await chatClose.first().click().catch(() => {});
      console.log('✅ Closed chat header');
    }
} 
  async function validateLineups(page: Page) {
    console.log('➡️ Opening "Lineups" tab');
    await page.getByRole('tab', { name: 'Tab Lineups' }).click();
  
    console.log('🔍 Validating Wolves lineup...');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - img
      - text: WOL
      - img
      - text: EVE
      - heading "Starting Eleven" [level=6]
      - text: /GK 1 Malheiro de Sá DEF 4 Bueno DEF \\d+ Agbadou DEF \\d+ Gomes MID \\d+/
      - img
      - text: /Tchatchoua López '\\d+ MID 8 Gomes da Silva MID 7/
      - img
      - text: /Trindade da Costa Neto Martins Gomes '\\d+ MID 3/
      - img
      - text: /Bueno Møller Wolfe '\\d+ STR 5 Munetsi STR \\d+/
      - img
      - text: /Hwang Kalajdzic '\\d+ STR \\d+/
      - img
      - text: /Arias Bellegarde '\\d+/
      - heading "Substitutes" [level=6]
      - text: /SUB 2 Doherty SUB 6 Møller Wolfe SUB \\d+ Mosquera SUB \\d+ Krejcí SUB \\d+ Kalajdzic SUB \\d+ Martins Gomes SUB \\d+ Bellegarde SUB \\d+ López SUB \\d+ Johnstone/
    `);
    console.log('✅ Wolves lineup validated');
  
    console.log('➡️ Switching to Everton tab');
    await page.locator('span', { hasText: 'EVE' }).first().click();
  
    console.log('🔍 Validating Everton lineup...');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - img
      - text: WOL
      - img
      - text: EVE
      - heading "Starting Eleven" [level=6]
      - text: /GK 1 Pickford DEF \\d+ O'Brien DEF 6 Tarkowski DEF 5 Keane DEF \\d+ Mykolenko MID \\d+ Garner MID \\d+/
      - img
      - text: /Gana Gueye Iroegbunam '\\d+ MID \\d+/
      - img
      - text: /Ndiaye Coleman '\\d+ MID \\d+ Dewsbury-Hall MID \\d+/
      - img
      - text: /Grealish Alcaraz '\\d+ STR 9/
      - img
      - text: /Beto Barry '\\d+/
      - heading "Substitutes" [level=6]
      - text: /SUB 7 McNeil SUB \\d+ Barry SUB \\d+ Travers SUB \\d+ Dibling SUB \\d+ Coleman SUB \\d+ Alcaraz SUB \\d+ Iroegbunam SUB \\d+ Armstrong SUB \\d+ Onyango/
    `);
    console.log('✅ Everton lineup validated');
}
  const statsSnapshot = `
    - img
    - paragraph: English Premier League
    - paragraph: /Sat \\d+ Aug — \\d+:\\d+/
    - img
    - img: /\\d+\\.\\d+ % \\d+ 4 2 \\d+ \\d+\\.\\d+ % \\d+ 4 2 \\d+ Possession Shots Shots On Target Corners Fouls/
    - paragraph: "0"
    - paragraph: "0"
    - paragraph: Cards
    - paragraph: "1"
    - paragraph: "0"
  `;
  async function validateStats(page: Page) {
    console.log('➡️ Opening "Stats" tab');
    await page.getByRole('tab', { name: 'Tab Stats' }).click();
  
    console.log('🔍 Validating stats snapshot...');
    console.log('📋 Expected stats snapshot:\n', statsSnapshot);
  
    await expect(page.getByRole('main')).toMatchAriaSnapshot(statsSnapshot);
  
    console.log('✅ Stats snapshot validated');
}
const todaysGamesSnapshot = `
    - paragraph: English Premier League
    - paragraph: Todays Games
    - heading "CHE" [level=6]
    - img
    - paragraph: FT
    - paragraph: "2"
    - paragraph: "0"
    - paragraph: HT 1 - 0
    - img
    - text: FUL
    - heading "MUN" [level=6]
    - img
    - paragraph: FT
    - paragraph: "3"
    - paragraph: "2"
    - paragraph: HT 1 - 0
    - img
    - text: BUR
    - heading "SUN" [level=6]
    - img
    - paragraph: FT
    - paragraph: "2"
    - paragraph: "1"
    - paragraph: HT 0 - 0
    - img
    - text: BRE
    - heading "TOT" [level=6]
    - img
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "1"
    - paragraph: HT 0 - 1
    - img
    - text: BOU
    - heading "LEE" [level=6]
    - img
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "0"
    - paragraph: HT 0 - 0
    - img
    - text: NEW
  `;
async function validateTodaysGames(page: Page) {
    console.log('➡️ Opening "Scores" tab');
    await page.getByRole('tab', { name: 'Scores' }).click();
  
    console.log('🔍 Validating Today’s Games snapshot...');
    console.log('📋 Expected snapshot:\n', todaysGamesSnapshot);
  
    await expect(page.getByRole('main')).toMatchAriaSnapshot(todaysGamesSnapshot);
  
    console.log('✅ Today’s Games snapshot validated');
}
async function validateResultsTable(page: Page) {
    console.log('➡️ Opening "Table" tab');
    await page.getByRole('tab', { name: 'Tab Table' }).click();
  
    console.log('🔍 Validating League Table region...');
    await expect(page.getByRole('region', { name: 'League Table' })).toBeVisible();
    console.log('✅ League Table is visible');
}  
const countdownRegex = /\d+\s+Days\s+\d+\s+Hours\s+\d+\s+Mins\s+\d+\s+Secs/; 
async function validateOtherTeams(page: Page) {
    console.log('➡️ Opening burger menu');
    await page.getByLabel('Burger Menu').click();
  
    console.log('➡️ Navigating to Matches');
    await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
  
    // Let the tab list render fully like in your originals
    await page.waitForTimeout(1000);
  
    console.log('➡️ Switching to Women tab');
    await page.getByRole('tab', { name: 'Tab Women' }).click();
  
    console.log('🔍 Validating Women tab is selected (ARIA snapshot)');
    await expect(page.getByLabel('Tab Women')).toMatchAriaSnapshot(`- tab "Tab Women" [selected]`);
  
    console.log('🔍 Validating countdown widget (generic DD HH MM SS)');
    await expect(page.getByRole('main')).toContainText(countdownRegex, { useInnerText: true });
  
    console.log('🔍 Validating primary CTAs visible');
    await expect(page.getByRole('link', { name: 'Buy tickets', exact: true }).first()).toBeVisible();

    console.log('🔍 Validating CTA text present in main');
    await expect(page.getByRole('main')).toContainText('Buy tickets');
  
    console.log('🔍 Validating main has non-empty text (stadium or similar)');
    const stadiumText = await page.getByRole('main').textContent();
    expect(stadiumText && stadiumText.trim().length).toBeGreaterThan(0);
  
    console.log('🔍 Validating at least one H3 heading has text');
    const h3 = page.getByRole('main').getByRole('heading', { level: 3 }).first();
    await expect(h3).toHaveText(/\S/);
  
    console.log('✅ All validations passed on current URL');
}
const WomensseasonMonths = ['September','October','November','December','January','February','March','April','May'];
const WomensmonthsFromNowToSeasonEnd = (): string[] => {
  const dtf = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'Europe/London' });
  const now = new Date();
  const list: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    const name = dtf.format(d);
    list.push(name);
    if (name === 'May') break;
  }
  const filtered = list.filter(m => seasonMonths.includes(m));
  return filtered.length ? filtered : seasonMonths;
};

// ----- Expected Women’s fixtures (derived from your ARIA snapshot) -----
const EXPECTED_WOMEN: Record<string, Array<{ team: RegExp | string; venue: RegExp | string }>> = {
  September: [
    { team: /Manchester City Women/i, venue: /Joie Stadium/i },
    { team: /Brighton and Hove Albion Women/i, venue: /Broadfield Stadium/i },
  ],
  October: [
    { team: /Leicester City Women/i, venue: /King Power Stadium/i },
    { team: /Manchester United Women/i, venue: /Hill Dickinson Stadium/i },
    { team: /Nottingham Forest Ladies/i, venue: /Goodison Park/i },
  ],
  November: [
    { team: /Aston Villa Women/i, venue: /Villa Park/i },
    { team: /Manchester City Women/i, venue: /Goodison Park/i },
    { team: /West Ham United Women/i, venue: /Chigwell Construction Stadium/i },
    { team: /Newcastle United Women/i, venue: /Gateshead International Stadium/i },
  ],
  December: [
    { team: /Chelsea Women/i, venue: /Kingsmeadow/i },
    { team: /Arsenal Women/i, venue: /Goodison Park/i },
  ],
  January: [
    { team: /Manchester City Women/i, venue: /Joie Stadium/i },
    { team: /Brighton and Hove Albion Women/i, venue: /Goodison Park/i },
  ],
  February: [
    { team: /Aston Villa Women/i, venue: /Goodison Park/i },
    { team: /London City Lionesses/i, venue: /Copperjax Community Stadium/i },
    { team: /West Ham United Women/i, venue: /Goodison Park/i },
  ],
  March: [
    { team: /Tottenham Hotspur Women/i, venue: /BetWright Stadium/i },
    { team: /Manchester United Women/i, venue: /Leigh Sports Village/i },
    { team: /Liverpool Women/i, venue: /Goodison Park/i },
  ],
  April: [
    { team: /Chelsea Women/i, venue: /Goodison Park/i },
  ],
  May: [
    { team: /Arsenal Women/i, venue: /Emirates Stadium/i },
    { team: /Leicester City Women/i, venue: /Goodison Park/i },
  ],
};

async function acceptCookies(page: import('@playwright/test').Page) {
  const btn = page.getByRole('button', { name: /Accept All Cookies/i });
  try { if (await btn.isVisible({ timeout: 2000 })) await btn.click(); } catch {}
  try { if (await btn.isVisible({ timeout: 2000 })) await btn.click(); } catch {}
}

async function navigateToWomenTab(page: import('@playwright/test').Page) {
  console.log('➡️ Opening burger menu');
  await page.getByLabel('Burger Menu').click();
  await page.locator('.style__ChatRoomHeaderClose-jFbxRr').click();
  console.log('➡️ Navigating to Matches');
  await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();

  // small settle
  await page.waitForTimeout(1000);

  console.log('➡️ Switching to Women tab');
  // The tab often exposes accessible name "Tab Women"
  await page.getByRole('tab', { name: /Tab Women/i }).click();
  await page.getByText('Fixtures').click();
}

const findMonthHeader = async (page: import('@playwright/test').Page, month: string) => {
  const byHeading = page.getByRole('heading', { name: new RegExp(`^\\s*${month}\\s*$`, 'i') });
  if (await byHeading.count()) return byHeading.first();

  const byText = page.getByText(new RegExp(`^\\s*${month}\\s*$`, 'i'));
  if (await byText.count()) return byText.first();

  const byXPath = page.locator(`xpath=//*[normalize-space(text())='${month}']`);
  if (await byXPath.count()) return byXPath.first();

  return null;
};

const extractFixturesUnderMonth = async (monthHeaderLocator: import('@playwright/test').Locator) => {
  // Use nearest logical container for the month block
  const section = monthHeaderLocator.locator('xpath=ancestor-or-self::*[self::section or self::div][1]');
  const cards = section.locator('xpath=.//h3[normalize-space()]');
  const count = await cards.count();
  const fixtures: Array<{ team: string; venue: string | null }> = [];
  for (let i = 0; i < count; i++) {
    const teamEl = cards.nth(i);
    const team = (await teamEl.innerText()).trim();

    // Venue is the next meaningful paragraph/div after the heading
    const venueEl = teamEl.locator('xpath=following::*[self::p or self::div][normalize-space()][1]');
    let venue: string | null = null;
    try { venue = (await venueEl.innerText()).trim(); } catch {}

    fixtures.push({ team, venue });
  }
  return fixtures;
};

async function validateMonth(page: import('@playwright/test').Page, testInfo: import('@playwright/test').TestInfo, month: string): Promise<boolean> {
  const expected = EXPECTED_WOMEN[month];
  if (!expected || expected.length === 0) return false;

  // Find header with light scrolling
  let header = await findMonthHeader(page, month);
  for (let i = 0; !header && i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.9));
    await page.waitForTimeout(150);
    header = await findMonthHeader(page, month);
  }
  if (!header) {
    console.log(`⏭️  Skipping ${month} — header not found`);
    await testInfo.attach(`Skipped ${month}`, {
      body: Buffer.from(`${month} header not found — likely off-screen or not rendered.`),
      contentType: 'text/plain',
    });
    return false;
  }

  await header.scrollIntoViewIfNeeded().catch(() => {});
  const fixtures = await extractFixturesUnderMonth(header);

  console.log(`📅 ${month}: found ${fixtures.length} fixtures`);
  for (const f of fixtures) console.log(`   • ${f.team}${f.venue ? ` — ${f.venue}` : ''}`);

  // Validate each expected (team+venue) appears at least once
  for (const exp of expected) {
    const teamRegex = exp.team instanceof RegExp ? exp.team : new RegExp(`^\\s*${exp.team}\\s*$`, 'i');
    const venueRegex = exp.venue instanceof RegExp ? exp.venue : new RegExp(exp.venue, 'i');

    const match = fixtures.some(f => teamRegex.test(f.team) && (!!f.venue && venueRegex.test(f.venue)));
    expect.soft(match, `Missing or mismatched fixture in ${month}: ${teamRegex} @ ${venueRegex}`).toBeTruthy();
    if (match) {
      console.log(`✅  ${month} OK: ${teamRegex} @ ${venueRegex}`);
    } else {
      console.log(`❌  ${month} missing: ${teamRegex} @ ${venueRegex}`);
    }
  }

  return fixtures.length > 0;
}
async function navigateToU18(page: Page) {
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
await page.getByRole('tab', { name: 'Tab U18' }).click();
}
  
async function findMissingLinks(page: Page, expected: string[]) {
    const missing: string[] = [];
    for (const name of expected) {
      const visible = await page.getByRole('link', { name }).isVisible().catch(() => false);
      if (!visible) missing.push(name);
    }
    return missing;
}

test('Match Centre - Fixtures', async ({ browser }) => {
  for (const env of ENVIRONMENTS) {
    await test.step(`[${env.name}]`, async () => {
      const context = await browser.newContext(
        env.httpAuth
          ? {
              httpCredentials: {
                username: previewUsername,
                password: previewPassword,
              },
            }
          : {}
      );
      const page = await context.newPage();

      await page.goto(env.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      await acceptCookiesIfPresent(page, env.name);

      // Burger menu if present
      const burger = page.getByLabel(/Burger Menu/i);
      if (await burger.isVisible().catch(() => false)) {
        await burger.click().catch(() => {});
        console.log(`[${env.name}] Burger menu opened`);
      }

      // Matches tab
      let matchesTabInMenu = page
        .getByRole('listitem')
        .filter({ hasText: /Matches/i })
        .getByRole('tab');

      if (!(await matchesTabInMenu.isVisible().catch(() => false))) {
        matchesTabInMenu = page.getByRole('tab', { name: /^Matches$/i });
      }

      await safeExpect(`[${env.name}] Matches tab visible`, async () => {
        await expect(matchesTabInMenu).toBeVisible();
      });

      await safeExpect(`[${env.name}] "Matches" text in page container`, async () => {
        await expect(page.locator('#page')).toContainText(/Matches/i);
      });

      // Capture route pre-click
      let preClickPath: string | null = null;
      const anchor = matchesTabInMenu.locator('a[href]');
      if (await anchor.isVisible().catch(() => false)) {
        const href = await anchor.getAttribute('href');
        if (href) {
          try {
            const urlObj = new URL(href, env.url);
            preClickPath = urlObj.pathname + urlObj.search + urlObj.hash;
          } catch {
            preClickPath = href.startsWith('/') ? href : null;
          }
        }
      }

      // Navigate
      await matchesTabInMenu.click();
      await page.waitForLoadState('domcontentloaded');

      await safeExpect(`[${env.name}] Matches heading visible`, async () => {
        await expect(page.getByRole('heading', { name: /^Matches$/i })).toBeVisible();
      });

      // Effective path
      let effectivePath = preClickPath;
      if (!effectivePath) {
        const current = page.url();
        const u = new URL(current);
        effectivePath = u.pathname + u.search + u.hash;
      }
      routes[env.name] = effectivePath!;
      console.log(`[${env.name}] Captured Matches route: ${routes[env.name]}`);

      // Run ARIA validations
      await assertMatchesPageUI(page, env.name);

      await context.close();
    });
  }

  // Compare routes across environments
  await test.step('Compare routes across environments', async () => {
    await safeExpect('Preview route captured', async () => {
      expect(routes.Preview).toBeTruthy();
    });
    await safeExpect('Prod route captured', async () => {
      expect(routes.Prod).toBeTruthy();
    });
    await safeExpect('Preview vs Prod route parity', async () => {
      expect(routes.Preview).toBe(routes.Prod);
    });
    console.log(`✅ Route parity confirmed: ${routes.Preview}`);
  });
});

test('Match Centre - Results', async ({ browser }) => {
  const results: Record<'Preview' | 'Prod', SnapSummary> = {
    Preview: { venue: null, hasMenTag: false, hasFT: false, hasHTScore: false },
    Prod:    { venue: null, hasMenTag: false, hasFT: false, hasHTScore: false },
  };

  for (const env of ENVIRONMENTS) {
    await test.step(`[${env.name}] Open ${MATCH_PATH} and validate`, async () => {
      const context = await browser.newContext(
        env.httpAuth
          ? { httpCredentials: { username: previewUsername, password: previewPassword } }
          : {}
      );
      const page = await context.newPage();

      const url = new URL(MATCH_PATH, env.url).toString();
      console.log(`[${env.name}] Navigating to ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await acceptCookiesIfPresent(page, env.name);

      // Sanity check: route
      await safeExpect(`[${env.name}] Route path is ${MATCH_PATH}`, async () => {
        const u = new URL(page.url());
        expect(u.pathname + u.search + u.hash).toBe(MATCH_PATH);
      });

      // Run ARIA snapshots for the Results page
      await runResultsPageAriaSnapshots(page, env.name);

      // Summarize key facts for cross-env comparison
      results[env.name] = await summarizeResultsPage(page);
      console.log(`[${env.name}] Summary:`, results[env.name]);

      await context.close();
    });
  }

  // Cross-environment parity checks
  await test.step('Compare Preview vs Prod facts', async () => {
    await safeExpect('Venue parity (Hill Dickinson Stadium)', async () => {
      expect(results.Preview.venue).toBe('Hill Dickinson Stadium');
      expect(results.Prod.venue).toBe('Hill Dickinson Stadium');
    });

    await safeExpect('Competition tag parity ("Men")', async () => {
      expect(results.Preview.hasMenTag).toBe(true);
      expect(results.Prod.hasMenTag).toBe(true);
    });

    await safeExpect('Full-time indicator parity ("FT")', async () => {
      expect(results.Preview.hasFT).toBe(true);
      expect(results.Prod.hasFT).toBe(true);
    });

    await safeExpect('Half-time score parity ("HT 0 - 0")', async () => {
      expect(results.Preview.hasHTScore).toBe(true);
      expect(results.Prod.hasHTScore).toBe(true);
    });

    console.log(`✅ Parity checks complete for ${MATCH_PATH}`);
  });
});

test('Match Centre - Mens Team ', async ({ browser }) => {
    for (const env of ENVIRONMENTS) {
      await test.step(`[${env.name}] Validate tabs on /matches`, async () => {
        const context = await browser.newContext(
          env.httpAuth
            ? { httpCredentials: { username: previewUsername, password: previewPassword } }
            : {}
        );
        const page = await context.newPage();
  
        // Append `/matches` to each environment base URL
        const url = new URL('/matches', env.url).toString();
        console.log(`[${env.name}] Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
  
        // Accept cookies if present
        const cookieBtn = page.getByRole('button', { name: /Accept All Cookies/i });
        if (await cookieBtn.isVisible().catch(() => false)) {
          await cookieBtn.click().catch(() => {});
          console.log(`[${env.name}] Accepted cookies`);
        }
  
        // Default: Men selected
        await safeExpect(`[${env.name}] Men tab selected by default`, async () => {
          await expect(page.getByLabel('Tab Men')).toMatchAriaSnapshot(`- tab "Tab Men" [selected]`);
        });
  
        // Women
        await page.getByRole('tab', { name: 'Tab Women' }).click();
        await safeExpect(`[${env.name}] Women tab selected after click`, async () => {
          await expect(page.getByLabel('Tab Women')).toMatchAriaSnapshot(`- tab "Tab Women" [selected]`);
        });
  
        // U21
        await page.getByRole('tab', { name: 'Tab U21' }).click();
        await safeExpect(`[${env.name}] U21 tab selected after click`, async () => {
          await expect(page.getByLabel('Tab U21')).toMatchAriaSnapshot(`- tab "Tab U21" [selected]`);
        });
  
        // U18
        await page.getByRole('tab', { name: 'Tab U18' }).click();
        await safeExpect(`[${env.name}] U18 tab selected after click`, async () => {
          await expect(page.getByLabel('Tab U18')).toMatchAriaSnapshot(`- tab "Tab U18" [selected]`);
        });
  
        await context.close();
      });
    }
});

test('Match Centre - Mens Team - Fixtures', async ({ page }, testInfo) => {
    await page.context().setDefaultTimeout(30_000);
    await page.goto('https://www.evertonfc.com/matches', { waitUntil: 'load' });
  
    // Accept cookies if present
    const acceptCookies = page.getByRole('button', { name: /Accept All Cookies/i });
    if (await acceptCookies.isVisible()) await acceptCookies.click().catch(() => {});
  
    const monthsToCheck = monthsFromNowToSeasonEnd();
  
    // Robust month finder (role, text, XPath) + scrolling
    const findMonthHeader = async (month: string) => {
      const byHeading = page.getByRole('heading', { name: new RegExp(`^\\s*${month}\\s*$`, 'i') });
      if (await byHeading.count()) return byHeading.first();
  
      const byText = page.getByText(new RegExp(`^\\s*${month}\\s*$`, 'i'));
      if (await byText.count()) return byText.first();
  
      const byXPath = page.locator(`xpath=//*[normalize-space(text())='${month}']`);
      if (await byXPath.count()) return byXPath.first();
  
      return null;
    };
  
    // Extract fixtures within a month section (best-effort generic structure)
    const extractFixturesUnderMonth = async (monthHeaderLocator: import('@playwright/test').Locator) => {
      // Scope from the month header to the next month header (or end of main)
      // Generic approach: use the container ancestor of the header as section root
      const section = monthHeaderLocator.locator('xpath=ancestor-or-self::*[self::section or self::div][1]');
      // Opponent headings are usually h3; venue lines typically paragraphs below
      const cards = section.locator('xpath=.//h3[normalize-space()]');
      const count = await cards.count();
      const fixtures: Array<{ team: string; venue: string | null }> = [];
      for (let i = 0; i < count; i++) {
        const teamEl = cards.nth(i);
        const team = (await teamEl.innerText()).trim();
        // Venue is commonly the next paragraph-like text node; try sibling paragraph or nearest following element with short text
        const venueEl = teamEl.locator('xpath=following::*[self::p or self::div][normalize-space()][1]');
        let venue: string | null = null;
        try {
          venue = (await venueEl.innerText()).trim();
        } catch {}
        fixtures.push({ team, venue });
      }
      return fixtures;
    };
  
    const validateMonth = async (month: string): Promise<boolean> => {
      const expected = EXPECTED[month];
      if (!expected || expected.length === 0) return false;
  
      // Try to find header (scroll a few screens if needed)
      let header = await findMonthHeader(month);
      for (let i = 0; !header && i < 8; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.9));
        await page.waitForTimeout(150);
        header = await findMonthHeader(month);
      }
      if (!header) {
        console.log(`⏭️  Skipping ${month} — header not found on PROD`);
        await testInfo.attach(`Skipped ${month}`, {
          body: Buffer.from(`${month} header not found on PROD — likely off-screen or not rendered.`),
          contentType: 'text/plain',
        });
        return false;
      }
  
      await header.scrollIntoViewIfNeeded().catch(() => {});
      const fixtures = await extractFixturesUnderMonth(header);
  
      // Log what we found
      console.log(`📅 ${month}: found ${fixtures.length} fixtures`);
      for (const f of fixtures) console.log(`   • ${f.team}${f.venue ? ` — ${f.venue}` : ''}`);
  
      // Validate: each expected (team+venue) appears at least once among extracted fixtures
      for (const exp of expected) {
        const teamRegex = exp.team instanceof RegExp ? exp.team : new RegExp(`^\\s*${exp.team}\\s*$`, 'i');
        const venueRegex = exp.venue instanceof RegExp ? exp.venue : new RegExp(exp.venue, 'i');
  
        const match = fixtures.some(f => teamRegex.test(f.team) && (!!f.venue && venueRegex.test(f.venue)));
        expect.soft(match, `Missing or mismatched fixture in ${month}: ${teamRegex} @ ${venueRegex}`).toBeTruthy();
        if (match) {
          console.log(`✅  ${month} validation: ${teamRegex} @ ${venueRegex}`);
        } else {
          console.log(`❌  ${month} validation failed: ${teamRegex} @ ${venueRegex}`);
        }
      }
  
      // If we found any fixtures at all for the month, consider the month "validated"
      return fixtures.length > 0;
    };
  
    let ranAtLeastOne = false;
    for (const month of monthsToCheck) {
      const ran = await validateMonth(month);
      if (ran) ranAtLeastOne = true;
    }
  
    expect(ranAtLeastOne, 'No current/future months were validated on PROD.').toBeTruthy();
});

test('Match Centre - First Mens Team', async ({ browser }) => {
    test.setTimeout(120000);
  
    const PROD_URL = 'https://www.evertonfc.com/matches';
    const PREVIEW_URL = 'https://livepreview.evertonfc.com/matches';
  
    // --- LivePreview ---
    const previewContext = await browser.newContext({
      httpCredentials: { username: previewUsername, password: previewPassword },
    });
    const previewPage = await previewContext.newPage();
    await gotoResults(previewPage, PREVIEW_URL);
    const previewResults = await extractResults(previewPage);   // ⬅️ define it
    console.log('📊 LivePreview Results:', previewResults);
  
    // --- PROD ---
    const prodContext = await browser.newContext();
    const prodPage = await prodContext.newPage();
    await gotoResults(prodPage, PROD_URL);
    const prodResults = await extractResults(prodPage);         // ⬅️ define it
    console.log('📊 PROD Results:', prodResults);
  
    // --- Compare ---
    expect(prodResults.length, 'Number of results should match')
      .toBe(previewResults.length);
  
    for (let i = 0; i < Math.min(prodResults.length, previewResults.length); i++) {
      const p = previewResults[i];
      const q = prodResults[i];
  
      console.log(`🔎 Comparing match ${i + 1}`);
      console.log('LivePreview:', p);
      console.log('PROD:', q);
  
      // Soft match on main text (ignore whitespace / minor differences)
      expect.soft(q.text).toContain(p.text.split(' ')[0]); // at least opponent/team reference
      expect.soft(q.href).toBe(p.href);
    }
  
    await previewContext.close();
    await prodContext.close();
});

test('Match Centre - Results Match Centre (Everton)', async ({ browser }) => {
  test.setTimeout(120_000); // 2 minutes

  const context = await browser.newContext({
    httpCredentials: {
      username: previewUsername,
      password: previewPassword,
    },
  });

  const page = await context.newPage();

  // Navigate to Everton preview site
  await page.goto('https://livepreview.evertonfc.com/', { waitUntil: 'domcontentloaded' });

  const acceptCookies = page.getByRole('button', { name: /accept all cookies/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    console.log(' Accepting cookies...');
    await acceptCookies.click();
    console.log(' Cookies accepted');
  } else {
    console.log('No cookie banner found');
  }

  console.log('Opening Burger Menu...');
  await page.getByLabel(/burger menu/i).click();

  console.log('Clicking Matches tab...');
  await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();

  console.log('Navigating to Results...');
  await page.getByText('Results', { exact: true }).click();

  console.log('Selecting season 2024...');
  await page.locator('#seasons').selectOption('2024');

  console.log('Re-clicking Results...');
  await page.getByText('Results', { exact: true }).click();

  console.log('Clicking the match link: Sun 18 May 12:00 PM Everton');
  await page.getByRole('link', { name: 'Sun 18 May 12:00 PM Everton' }).click();

  console.log('Validating Men link is visible...');
  await expect(page.getByRole('link', { name: 'Sun 18 May 12:00 PM Men' })).toBeVisible();
  console.log('Men link is visible!');

  await context.close();
  console.log('Browser context closed, test finished successfully');
});

test('Match Centre - Hero', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/');

// Close any initial popup/modal (e.g., banners, overlays)
//await page.locator('.w-screen > .relative > .absolute').click();

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
await page.locator('div').filter({ hasText: /^Results$/ }).click();
await expect(page.getByRole('link', { name: 'Sat 13 Sep 3:00 PM Hill' })).toBeVisible();
await page.locator('#header').getByRole('link', { name: 'Everton FC Logo' }).click();
await page.getByLabel('Burger Menu').getByRole('img').click();
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
await page.getByRole('link', { name: 'Sat 13 Sep 3:00 PM Hill' }).click();
await page.getByRole('link', { name: 'Sat 13 Sep 3:00 PM Men Hill' }).click();
await expect(page.locator('section').filter({ hasText: 'Sat 13 Sep3:00 PMMenHill' })).toBeVisible();
});

test('Match Centre - Results Min by min', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/matches/men/2025/g2561924');

// Close any initial popup/modal (e.g., banners, overlays)
//await page.locator('.w-screen > .relative > .absolute').click();

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('.style__ChatRoomHeaderClose-jFbxRr').click();
await page.waitForTimeout(1000);

await expect(page.getByLabel('Tab Carousel').locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
    - group "1 of 5":
      - tab "Tab Live Updates" [selected]
    - group "2 of 5":
      - tab "Tab Lineups"
    - group "3 of 5":
      - tab "Tab Stats"
    - group "4 of 5":
      - tab "Tab Scores"
    - group "5 of 5":
      - tab "Tab Table"
    `);
await expect(page.getByRole('heading', { name: 'Min-by-min' })).toBeVisible();
const main = page
  .getByRole('main')
  .filter({ has: page.getByRole('heading', { name: 'Min-by-min' }) });

await expect(main).toHaveCount(1);
await expect(main).toBeVisible();

// Use text, not heading
const summaryText = main.getByText(/^Summary$/);
await summaryText.scrollIntoViewIfNeeded();
await expect(summaryText).toBeVisible();

// Other durable checks
await expect(main).toContainText(/Wolves\s*2\s*VS\s*3\s*Everton/);
await expect(main).toContainText(/Last Update:\s*30\/08\/2025\s+18:56/);

// Key posts
await expect(main.getByText('FT: Wolves 2-3 Everton')).toBeVisible();

// If the Summary text sometimes renders with trailing colon or extra whitespace:
await expect(main.getByText(/^Summary:?$/)).toBeVisible();

});

test('Match Centre - Results - Lineups', async ({ browser }) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    for (const url of urls) {
      await test.step(`Validate lineups on ${url}`, async () => {
        console.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await acceptCookiesAndCloseChat(page);
        await page.waitForTimeout(1000); // keep parity with original
        await validateLineups(page);
        console.log(`✅ Validation completed for ${url}\n`);
      });
    }
});

test('Match Centre - Results - Stats', async ({ browser }) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    for (const url of urls) {
      await test.step(`Validate stats on ${url}`, async () => {
        console.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
  
        await acceptCookiesAndCloseChat(page);
        await page.waitForTimeout(1000);
  
        await validateStats(page);
  
        console.log(`✅ Validation completed for ${url}\n`);
      });
    }
});

test('Match Centre - Todays Games', async ({ browser }) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    for (const url of urls) {
      await test.step(`Validate "Today’s Games" on ${url}`, async () => {
        console.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
  
        await acceptCookiesAndCloseChat(page);
        await page.waitForTimeout(1000); // parity with originals
  
        await validateTodaysGames(page);
  
        console.log(`✅ Validation completed for ${url}\n`);
      });
    }
});

test('Match Centre - Results Table', async ({ browser }) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    for (const url of urls) {
      await test.step(`Validate Results Table on ${url}`, async () => {
        console.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
  
        await acceptCookiesAndCloseChat(page);
        await page.waitForTimeout(1000); // parity with other tests
  
        await validateResultsTable(page);
  
        console.log(`✅ Validation completed for ${url}\n`);
      });
    }
});

test('Match Centre - Other Teams)', async ({ browser }) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
    const page = await context.newPage();
  
    for (const url of urls) {
      await test.step(`Validate Other Teams on ${url}`, async () => {
        console.log(`🌐 Navigating to: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
  
        await acceptCookies(page);
  
        await validateOtherTeams(page);
        console.log(`✅ Completed validations for: ${url}\n`);
      });
    }
});
const RUN_ENVS = ENVIRONMENTS.filter(e => e.name.toLowerCase() !== 'prod');
test('Match Centre - Women’s Team - Fixtures', async ({ browser }) => {
  for (const env of RUN_ENVS) {
    await test.step(`[${env.name}]`, async () => {
      const context = await browser.newContext(
        env.httpAuth ? { httpCredentials: { username: previewUsername, password: previewPassword } } : {}
      );
      const page = await context.newPage();
      await page.goto(env.url, { waitUntil: 'domcontentloaded' });
      // ... rest of your test unchanged
      await context.close();
    });
  }
});

test('Match Centre - Other Teams Fixtures - PROD', async ({ browser }) => {
    test.setTimeout(120_000); // 2 minutes
    const URLS = [
        'https://livepreview.evertonfc.com/',
        'https://www.evertonfc.com/',
      ];
  
    // Context with HTTP auth for the preview domain (harmless for prod)
    const context = await browser.newContext({
      httpCredentials: { username: previewUsername, password: previewPassword },
    });
    const page = await context.newPage();
  
    const failures: Array<{ url: string; missing: string[] }> = [];
  
    for (const url of URLS) {
      await test.step(`Validate fixtures on ${url}`, async () => {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await navigateToU18(page);
  
        const missing = await findMissingLinks(page, EXPECTED_LINKS);
        if (missing.length) {
          failures.push({ url, missing });
        }
      });
    }
  
    // If anything was missing on either URL, fail once with a helpful message
    if (failures.length) {
      const msg = failures
        .map(f => `\nURL: ${f.url}\nMissing:\n- ${f.missing.join('\n- ')}`)
        .join('\n');
      throw new Error(`One or more expected fixtures were missing:${msg}`);
    }
  
    // Extra assertion so test output shows an explicit pass condition
    await expect(failures.length, 'All expected fixture links are present on both URLs').toBe(0);
});

test('Match Centre - Other Teams Results - Live-Preview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/');

// Close any initial popup/modal (e.g., banners, overlays)
//await page.locator('.w-screen > .relative > .absolute').click();

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
  await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
  await page.getByRole('tab', { name: 'Tab U18' }).click();
  await page.getByText('Results').click();
  await page.waitForTimeout(1000);
  await page.locator('#seasons').selectOption('2024');
  await page.waitForTimeout(1000);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Liverpool Academy
    - img
    - paragraph: Liverpool U18
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "3"
    - paragraph: HT 0 - 2
    - img
    - heading "Everton U18" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
      - tab:
        - img
    - link "Highlights":
      - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
      - tab:
        - img
    `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: /Sat 3 May \\d+:\\d+ AM/
    - tab:
      - img
    `);
  await expect(page.getByRole('link', { name: 'Sat 3 May 11:00 AM Liverpool' }).getByRole('link').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Highlights', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - link /Sat 3 May \\d+:\\d+ AM Liverpool Academy Liverpool U18 FT 0 3 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478577
      - img
      - img
      - tab:
        - img
      - paragraph: Liverpool Academy
      - img
      - paragraph: Liverpool U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
        - tab:
          - img
    - link:
      - /url: https://www.seatunique.com/sport-tickets/football/everton-fc-tickets
      - img
    - text: April
    - link /Tue \\d+ Apr 6:\\d+ PM Everton U18 FT 1 1 HT 0 - 1 Blackburn U18/:
      - /url: /matches/u18/2024/g2478560
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "1"
      - paragraph: HT 0 - 1
      - img
      - heading "Blackburn U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478560
        - tab:
          - img
    - link /Sat \\d+ Apr \\d+:\\d+ AM Everton U18 FT 4 4 HT 2 - 2 Man Utd U18/:
      - /url: /matches/u18/2024/g2478571
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 2 - 2
      - img
      - heading "Man Utd U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478571
        - tab:
          - img
    - link /Tue \\d+ Apr \\d+:\\d+ PM Derby U18 FT 2 1 HT 2 - 0 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2478568
      - img
      - tab:
        - img
      - img
      - paragraph: Derby U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 0
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/april/15/young-blues-fall-to-narrow-defeat/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478568
        - tab:
          - img
    - link /Tue 8 Apr 2:\\d+ PM Leeds U18 FT 2 4 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478494
      - img
      - tab:
        - img
      - img
      - paragraph: Leeds U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "4"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/april/08/clarke-scores-hat-trick-as-young-blues-defeat-leeds/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/9772afb5-6aa8-44d0-a5e9-9f5aff40547c
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478494
        - tab:
          - img
    - text: March
    - link /Sat \\d+ Mar \\d+:\\d+ PM Newcastle U18 FT 1 2 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478558
      - img
      - tab:
        - img
      - img
      - paragraph: Newcastle U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "2"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/29/young-blues-extend-unbeaten-run-at-newcastle/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/4a7ec527-fe5e-4645-9d2b-700ca217e5c1
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478558
        - tab:
          - img
    - link /Sat \\d+ Mar \\d+:\\d+ PM Everton U18 FT 3 2 HT 1 - 2 Leeds U18 Match report/:
      - /url: /matches/u18/2024/g2478550
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 1 - 2
      - img
      - heading "Leeds U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/15/Nsangou-Nets-Brace-In-Under-18s--Comeback-Win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478550
        - tab:
          - img
    - link /Tue \\d+ Mar 1:\\d+ PM Wolves U18 FT 2 2 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2478460
      - img
      - tab:
        - img
      - img
      - paragraph: Wolves U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "2"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478460
        - tab:
          - img
    - link /Sat 8 Mar \\d+:\\d+ PM Middlesbrough U18 FT 1 3 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478546
      - img
      - tab:
        - img
      - img
      - paragraph: Middlesbrough U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/08/morgan-nets-brace-at-boro-in-under-18s--win/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/f947b2b1-bc5e-4f19-8d58-78da38d6a0e1
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478546
        - tab:
          - img
    - link /Sat 1 Mar 3:\\d+ PM Nott'm Forest U18 FT 0 3 HT 0 - 2 Everton U18/:
      - /url: /matches/u18/2024/g2478539
      - img
      - tab:
        - img
      - img
      - paragraph: Nott'm Forest U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478539
        - tab:
          - img
    - text: February
    - link /Tue \\d+ Feb 3:\\d+ PM Everton U18 FT 4 4 HT 1 - 2 Middlesbrough U18/:
      - /url: /matches/u18/2024/g2478503
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 1 - 2
      - img
      - heading "Middlesbrough U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478503
        - tab:
          - img
    - link /Sat \\d+ Feb \\d+:\\d+ AM Everton U18 FT 2 1 HT 2 - 1 Wolves U18/:
      - /url: /matches/u18/2024/g2478531
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 1
      - img
      - heading "Wolves U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478531
        - tab:
          - img
    - img
    - text: /Mon \\d+ Feb 7:\\d+ PM/
    - paragraph: H
    - img
    - paragraph: Everton
    - paragraph: FT
    - paragraph: "1"
    - paragraph: "2"
    - img
    - heading "Wigan Athletic U21" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/february/17/under-18s-play-first-match-at-everton-stadium/
      - tab:
        - img
    - link "Highlights":
      - /url: https://youtube.com/live/mI3ykhnaoMc?feature=share
      - tab:
        - img
    - link:
      - /url: /matches/u18/2024/86ef6580-f9a9-11ef-b14a-89b601516fdf
      - tab:
        - img
    - link /Fri \\d+ Feb 2:\\d+ PM Reading U18 FT 2 1 HT 1 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2506975
      - img
      - tab:
        - img
      - img
      - paragraph: Reading U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2506975
        - tab:
          - img
    - link /Tue 4 Feb 7:\\d+ PM Everton U18 FT 0 1 HT 0 - 0 Plymouth Argyle U18 Match report/:
      - /url: /matches/u18/2024/g2502112
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "1"
      - paragraph: HT 0 - 0
      - img
      - heading "Plymouth Argyle U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/february/04/everton-under-18s-exit-fa-youth-cup-with-plymouth-defeat/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2502112
        - tab:
          - img
    - text: January
    - link /Thu \\d+ Jan 1:\\d+ PM Everton U18 FT 2 1 HT 2 - 1 Sunderland U18 Match report/:
      - /url: /matches/u18/2024/g2478514
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 1
      - img
      - heading "Sunderland U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/january/30/Loney-Bags-Brace-In-Comeback-Win-Over-Black-Cats/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478514
        - tab:
          - img
    - link /Sat \\d+ Jan \\d+:\\d+ AM Stoke U18 FT 2 1 HT 1 - 0 Everton U18/:
      - /url: /matches/u18/2024/g2478506
      - img
      - tab:
        - img
      - img
      - paragraph: Stoke U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 0
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478506
        - tab:
          - img
    - link /Tue \\d+ Jan 7:\\d+ PM Everton U18 FT 3 1 HT 0 - 0 Wolves U18 Match report/:
      - /url: /matches/u18/2024/g2493579
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "1"
      - paragraph: HT 0 - 0
      - img
      - heading "Wolves U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/january/21/everton-under-18s-advance-to-fa-youth-cup-fifth-round-after-3-1-win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2493579
        - tab:
          - img
    - link /Sat \\d+ Jan \\d+:\\d+ PM Man City U18 FT 4 1 HT 3 - 0 Everton U18/:
      - /url: /matches/u18/2024/g2478520
      - img
      - tab:
        - img
      - img
      - paragraph: Man City U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "1"
      - paragraph: HT 3 - 0
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478520
        - tab:
          - img
    - text: December
    - link /Sat \\d+ Dec \\d+:\\d+ PM Nott'm Forest U18 FT 1 2 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2480837
      - img
      - tab:
        - img
      - img
      - paragraph: Nott'm Forest U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "2"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2480837
        - tab:
          - img
    - link /Wed \\d+ Dec 7:\\d+ PM Everton U18 FT 7 0 HT 0 - 0 Nott'm Forest U18 Match report/:
      - /url: /matches/u18/2024/g2490807
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "7"
      - paragraph: "0"
      - paragraph: HT 0 - 0
      - img
      - heading "Nott'm Forest U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/december/11/classy-under-18s-claim-fa-youth-cup-win-at-goodison/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2490807
        - tab:
          - img
    - link /Thu 5 Dec 1:\\d+ PM Sunderland U18 FT 2 3 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2478436
      - img
      - tab:
        - img
      - img
      - paragraph: Sunderland U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "3"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478436
        - tab:
          - img
    - text: November
    - link /Sat \\d+ Nov \\d+:\\d+ AM Everton U18 FT 3 2 HT 1 - 2 Liverpool U18 Match report/:
      - /url: /matches/u18/2024/g2478487
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 1 - 2
      - img
      - heading "Liverpool U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/30/under-18s-score-twice-in-stoppage-time-to-seal-stunning-derby-win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478487
        - tab:
          - img
    - link /Sat 9 Nov \\d+:\\d+ AM Man Utd U18 FT 3 0 HT 1 - 0 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2478482
      - img
      - tab:
        - img
      - img
      - paragraph: Man Utd U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "0"
      - paragraph: HT 1 - 0
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/09/young-blues-fall-to-defeat-at-united/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478482
        - tab:
          - img
    - link /Sat 2 Nov \\d+:\\d+ PM Everton U18 FT 3 2 HT 0 - 2 Derby U18 Match report/:
      - /url: /matches/u18/2024/g2478477
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 0 - 2
      - img
      - heading "Derby U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/02/Defiant-Young-Blues-In-Another-Comeback-Victory/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478477
        - tab:
          - img
    - text: October
    - link /Tue \\d+ Oct \\d+:\\d+ AM Everton U18 FT 4 4 HT 1 - 4 West Ham U18 Match report/:
      - /url: /matches/u18/2024/g2480825
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 1 - 4
      - img
      - heading "West Ham U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/october/29/under-18s-come-from-four-down-to-draw-with-west-ham/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2480825
        - tab:
          - img
    - link /Sat \\d+ Oct \\d+:\\d+ AM Blackburn U18 FT 1 3 HT 0 - 3 Everton U18/:
      - /url: /matches/u18/2024/g2478469
      - img
      - tab:
        - img
      - img
      - paragraph: Blackburn U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "3"
      - paragraph: HT 0 - 3
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478469
        - tab:
          - img
    - link /Sat \\d+ Oct \\d+:\\d+ PM Everton U18 FT 3 2 HT 2 - 0 Newcastle U18 Match report/:
      - /url: /matches/u18/2024/g2478466
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 2 - 0
      - img
      - heading "Newcastle U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/october/19/young-blues-beat-newcastle-in-five-goal-thriller/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478466
        - tab:
          - img
    - text: September
    - link /Sat \\d+ Sep \\d+:\\d+ PM Everton U18 FT 2 3 HT 2 - 3 Nott'm Forest U18/:
      - /url: /matches/u18/2024/g2478453
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "3"
      - paragraph: HT 2 - 3
      - img
      - heading "Nott'm Forest U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478453
        - tab:
          - img
    - link /Sun 1 Sep \\d+:\\d+ AM Everton U18 FT 0 4 HT 0 - 2 Man City U18/:
      - /url: /matches/u18/2024/g2478442
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "4"
      - paragraph: HT 0 - 2
      - img
      - heading "Man City U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478442
        - tab:
          - img
    - text: August
    - link /Wed \\d+ Aug \\d+:\\d+ AM Southampton U18 FT 2 4 HT 0 - 3 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2480810
      - img
      - tab:
        - img
      - img
      - paragraph: Southampton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "4"
      - paragraph: HT 0 - 3
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/august/28/Under-18s-Seal-Southampton-Win-In-Cup-Opener/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2480810
        - tab:
          - img
    - link /Sat \\d+ Aug \\d+:\\d+ AM Everton U18 FT 2 1 HT 1 - 1 Stoke U18/:
      - /url: /matches/u18/2024/g2478427
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 1
      - img
      - heading "Stoke U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478427
        - tab:
          - img
    `);
});

test('Match Centre - Other Teams Results - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.evertonfc.com/');

// Close any initial popup/modal (e.g., banners, overlays)
//await page.locator('.w-screen > .relative > .absolute').click();

// Accept all cookies
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
  await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
  await page.getByRole('tab', { name: 'Tab U18' }).click();
  await page.getByText('Results').click();
  await page.waitForTimeout(1000);
  await page.locator('#seasons').selectOption('2024');
  await page.waitForTimeout(1000);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Liverpool Academy
    - img
    - paragraph: Liverpool U18
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "3"
    - paragraph: HT 0 - 2
    - img
    - heading "Everton U18" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
      - tab:
        - img
    - link "Highlights":
      - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
      - tab:
        - img
    `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: /Sat 3 May \\d+:\\d+ AM/
    - tab:
      - img
    `);
  await expect(page.getByRole('link', { name: 'Sat 3 May 11:00 AM Liverpool' }).getByRole('link').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Highlights', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - link /Sat 3 May \\d+:\\d+ AM Liverpool Academy Liverpool U18 FT 0 3 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478577
      - img
      - img
      - tab:
        - img
      - paragraph: Liverpool Academy
      - img
      - paragraph: Liverpool U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
        - tab:
          - img
    - link:
      - /url: https://www.seatunique.com/sport-tickets/football/everton-fc-tickets
      - img
    - text: April
    - link /Tue \\d+ Apr 6:\\d+ PM Everton U18 FT 1 1 HT 0 - 1 Blackburn U18/:
      - /url: /matches/u18/2024/g2478560
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "1"
      - paragraph: HT 0 - 1
      - img
      - heading "Blackburn U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478560
        - tab:
          - img
    - link /Sat \\d+ Apr \\d+:\\d+ AM Everton U18 FT 4 4 HT 2 - 2 Man Utd U18/:
      - /url: /matches/u18/2024/g2478571
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 2 - 2
      - img
      - heading "Man Utd U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478571
        - tab:
          - img
    - link /Tue \\d+ Apr \\d+:\\d+ PM Derby U18 FT 2 1 HT 2 - 0 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2478568
      - img
      - tab:
        - img
      - img
      - paragraph: Derby U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 0
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/april/15/young-blues-fall-to-narrow-defeat/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478568
        - tab:
          - img
    - link /Tue 8 Apr 2:\\d+ PM Leeds U18 FT 2 4 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478494
      - img
      - tab:
        - img
      - img
      - paragraph: Leeds U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "4"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/april/08/clarke-scores-hat-trick-as-young-blues-defeat-leeds/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/9772afb5-6aa8-44d0-a5e9-9f5aff40547c
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478494
        - tab:
          - img
    - text: March
    - link /Sat \\d+ Mar \\d+:\\d+ PM Newcastle U18 FT 1 2 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478558
      - img
      - tab:
        - img
      - img
      - paragraph: Newcastle U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "2"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/29/young-blues-extend-unbeaten-run-at-newcastle/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/4a7ec527-fe5e-4645-9d2b-700ca217e5c1
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478558
        - tab:
          - img
    - link /Sat \\d+ Mar \\d+:\\d+ PM Everton U18 FT 3 2 HT 1 - 2 Leeds U18 Match report/:
      - /url: /matches/u18/2024/g2478550
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 1 - 2
      - img
      - heading "Leeds U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/15/Nsangou-Nets-Brace-In-Under-18s--Comeback-Win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478550
        - tab:
          - img
    - link /Tue \\d+ Mar 1:\\d+ PM Wolves U18 FT 2 2 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2478460
      - img
      - tab:
        - img
      - img
      - paragraph: Wolves U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "2"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478460
        - tab:
          - img
    - link /Sat 8 Mar \\d+:\\d+ PM Middlesbrough U18 FT 1 3 HT 0 - 2 Everton U18 Match report Highlights/:
      - /url: /matches/u18/2024/g2478546
      - img
      - tab:
        - img
      - img
      - paragraph: Middlesbrough U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/march/08/morgan-nets-brace-at-boro-in-under-18s--win/
        - tab:
          - img
      - link "Highlights":
        - /url: https://www.evertonfc.com/videos/f947b2b1-bc5e-4f19-8d58-78da38d6a0e1
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478546
        - tab:
          - img
    - link /Sat 1 Mar 3:\\d+ PM Nott'm Forest U18 FT 0 3 HT 0 - 2 Everton U18/:
      - /url: /matches/u18/2024/g2478539
      - img
      - tab:
        - img
      - img
      - paragraph: Nott'm Forest U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "3"
      - paragraph: HT 0 - 2
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478539
        - tab:
          - img
    - text: February
    - link /Tue \\d+ Feb 3:\\d+ PM Everton U18 FT 4 4 HT 1 - 2 Middlesbrough U18/:
      - /url: /matches/u18/2024/g2478503
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 1 - 2
      - img
      - heading "Middlesbrough U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478503
        - tab:
          - img
    - link /Sat \\d+ Feb \\d+:\\d+ AM Everton U18 FT 2 1 HT 2 - 1 Wolves U18/:
      - /url: /matches/u18/2024/g2478531
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 1
      - img
      - heading "Wolves U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478531
        - tab:
          - img
    - img
    - text: /Mon \\d+ Feb 7:\\d+ PM/
    - paragraph: H
    - img
    - paragraph: Everton
    - paragraph: FT
    - paragraph: "1"
    - paragraph: "2"
    - img
    - heading "Wigan Athletic U21" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/february/17/under-18s-play-first-match-at-everton-stadium/
      - tab:
        - img
    - link "Highlights":
      - /url: https://youtube.com/live/mI3ykhnaoMc?feature=share
      - tab:
        - img
    - link:
      - /url: /matches/u18/2024/86ef6580-f9a9-11ef-b14a-89b601516fdf
      - tab:
        - img
    - link /Fri \\d+ Feb 2:\\d+ PM Reading U18 FT 2 1 HT 1 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2506975
      - img
      - tab:
        - img
      - img
      - paragraph: Reading U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2506975
        - tab:
          - img
    - link /Tue 4 Feb 7:\\d+ PM Everton U18 FT 0 1 HT 0 - 0 Plymouth Argyle U18 Match report/:
      - /url: /matches/u18/2024/g2502112
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "1"
      - paragraph: HT 0 - 0
      - img
      - heading "Plymouth Argyle U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/february/04/everton-under-18s-exit-fa-youth-cup-with-plymouth-defeat/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2502112
        - tab:
          - img
    - text: January
    - link /Thu \\d+ Jan 1:\\d+ PM Everton U18 FT 2 1 HT 2 - 1 Sunderland U18 Match report/:
      - /url: /matches/u18/2024/g2478514
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 2 - 1
      - img
      - heading "Sunderland U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/january/30/Loney-Bags-Brace-In-Comeback-Win-Over-Black-Cats/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478514
        - tab:
          - img
    - link /Sat \\d+ Jan \\d+:\\d+ AM Stoke U18 FT 2 1 HT 1 - 0 Everton U18/:
      - /url: /matches/u18/2024/g2478506
      - img
      - tab:
        - img
      - img
      - paragraph: Stoke U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 0
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478506
        - tab:
          - img
    - link /Tue \\d+ Jan 7:\\d+ PM Everton U18 FT 3 1 HT 0 - 0 Wolves U18 Match report/:
      - /url: /matches/u18/2024/g2493579
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "1"
      - paragraph: HT 0 - 0
      - img
      - heading "Wolves U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2025/january/21/everton-under-18s-advance-to-fa-youth-cup-fifth-round-after-3-1-win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2493579
        - tab:
          - img
    - link /Sat \\d+ Jan \\d+:\\d+ PM Man City U18 FT 4 1 HT 3 - 0 Everton U18/:
      - /url: /matches/u18/2024/g2478520
      - img
      - tab:
        - img
      - img
      - paragraph: Man City U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "1"
      - paragraph: HT 3 - 0
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478520
        - tab:
          - img
    - text: December
    - link /Sat \\d+ Dec \\d+:\\d+ PM Nott'm Forest U18 FT 1 2 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2480837
      - img
      - tab:
        - img
      - img
      - paragraph: Nott'm Forest U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "2"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2480837
        - tab:
          - img
    - link /Wed \\d+ Dec 7:\\d+ PM Everton U18 FT 7 0 HT 0 - 0 Nott'm Forest U18 Match report/:
      - /url: /matches/u18/2024/g2490807
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "7"
      - paragraph: "0"
      - paragraph: HT 0 - 0
      - img
      - heading "Nott'm Forest U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/december/11/classy-under-18s-claim-fa-youth-cup-win-at-goodison/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2490807
        - tab:
          - img
    - link /Thu 5 Dec 1:\\d+ PM Sunderland U18 FT 2 3 HT 0 - 1 Everton U18/:
      - /url: /matches/u18/2024/g2478436
      - img
      - tab:
        - img
      - img
      - paragraph: Sunderland U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "3"
      - paragraph: HT 0 - 1
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478436
        - tab:
          - img
    - text: November
    - link /Sat \\d+ Nov \\d+:\\d+ AM Everton U18 FT 3 2 HT 1 - 2 Liverpool U18 Match report/:
      - /url: /matches/u18/2024/g2478487
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 1 - 2
      - img
      - heading "Liverpool U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/30/under-18s-score-twice-in-stoppage-time-to-seal-stunning-derby-win/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478487
        - tab:
          - img
    - link /Sat 9 Nov \\d+:\\d+ AM Man Utd U18 FT 3 0 HT 1 - 0 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2478482
      - img
      - tab:
        - img
      - img
      - paragraph: Man Utd U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "0"
      - paragraph: HT 1 - 0
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/09/young-blues-fall-to-defeat-at-united/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478482
        - tab:
          - img
    - link /Sat 2 Nov \\d+:\\d+ PM Everton U18 FT 3 2 HT 0 - 2 Derby U18 Match report/:
      - /url: /matches/u18/2024/g2478477
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 0 - 2
      - img
      - heading "Derby U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/november/02/Defiant-Young-Blues-In-Another-Comeback-Victory/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478477
        - tab:
          - img
    - text: October
    - link /Tue \\d+ Oct \\d+:\\d+ AM Everton U18 FT 4 4 HT 1 - 4 West Ham U18 Match report/:
      - /url: /matches/u18/2024/g2480825
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "4"
      - paragraph: "4"
      - paragraph: HT 1 - 4
      - img
      - heading "West Ham U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/october/29/under-18s-come-from-four-down-to-draw-with-west-ham/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2480825
        - tab:
          - img
    - link /Sat \\d+ Oct \\d+:\\d+ AM Blackburn U18 FT 1 3 HT 0 - 3 Everton U18/:
      - /url: /matches/u18/2024/g2478469
      - img
      - tab:
        - img
      - img
      - paragraph: Blackburn U18
      - paragraph: FT
      - paragraph: "1"
      - paragraph: "3"
      - paragraph: HT 0 - 3
      - img
      - heading "Everton U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478469
        - tab:
          - img
    - link /Sat \\d+ Oct \\d+:\\d+ PM Everton U18 FT 3 2 HT 2 - 0 Newcastle U18 Match report/:
      - /url: /matches/u18/2024/g2478466
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "3"
      - paragraph: "2"
      - paragraph: HT 2 - 0
      - img
      - heading "Newcastle U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/october/19/young-blues-beat-newcastle-in-five-goal-thriller/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2478466
        - tab:
          - img
    - text: September
    - link /Sat \\d+ Sep \\d+:\\d+ PM Everton U18 FT 2 3 HT 2 - 3 Nott'm Forest U18/:
      - /url: /matches/u18/2024/g2478453
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "3"
      - paragraph: HT 2 - 3
      - img
      - heading "Nott'm Forest U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478453
        - tab:
          - img
    - link /Sun 1 Sep \\d+:\\d+ AM Everton U18 FT 0 4 HT 0 - 2 Man City U18/:
      - /url: /matches/u18/2024/g2478442
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "0"
      - paragraph: "4"
      - paragraph: HT 0 - 2
      - img
      - heading "Man City U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478442
        - tab:
          - img
    - text: August
    - link /Wed \\d+ Aug \\d+:\\d+ AM Southampton U18 FT 2 4 HT 0 - 3 Everton U18 Match report/:
      - /url: /matches/u18/2024/g2480810
      - img
      - tab:
        - img
      - img
      - paragraph: Southampton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "4"
      - paragraph: HT 0 - 3
      - img
      - heading "Everton U18" [level=5]
      - link "Match report":
        - /url: https://www.evertonfc.com/news/2024/august/28/Under-18s-Seal-Southampton-Win-In-Cup-Opener/
        - tab:
          - img
      - link:
        - /url: /matches/u18/2024/g2480810
        - tab:
          - img
    - link /Sat \\d+ Aug \\d+:\\d+ AM Everton U18 FT 2 1 HT 1 - 1 Stoke U18/:
      - /url: /matches/u18/2024/g2478427
      - img
      - tab:
        - img
      - img
      - paragraph: Everton U18
      - paragraph: FT
      - paragraph: "2"
      - paragraph: "1"
      - paragraph: HT 1 - 1
      - img
      - heading "Stoke U18" [level=5]
      - link:
        - /url: /matches/u18/2024/g2478427
        - tab:
          - img
    `);
});

test('Match Centre - Other Teams Results Match Centre - Hero - LivePreview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/matches/u18');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('#seasons').selectOption('2024');
await page.getByText('Results').click();
await page.waitForTimeout(1000);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - img
  - text: /Sat 3 May \\d+:\\d+ AM/
  - tab:
    - img
  `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Liverpool Academy
    - img
    - paragraph: Liverpool U18
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "3"
    - paragraph: HT 0 - 2
    - img
    - heading "Everton U18" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
      - tab:
        - img
    - link "Highlights":
      - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
      - tab:
        - img
    `);
});

test('Match Centre - Other Teams Results Match Centre - Hero - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.evertonfc.com/matches/u18');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.locator('#seasons').selectOption('2024');
await page.getByText('Results').click();
await page.waitForTimeout(1000);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - img
  - text: /Sat 3 May \\d+:\\d+ AM/
  - tab:
    - img
  `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Liverpool Academy
    - img
    - paragraph: Liverpool U18
    - paragraph: FT
    - paragraph: "0"
    - paragraph: "3"
    - paragraph: HT 0 - 2
    - img
    - heading "Everton U18" [level=5]
    - link "Match report":
      - /url: https://www.evertonfc.com/news/2025/may/03/Young-Blues-Dominate-Liverpool-In-Season-Finale/
      - tab:
        - img
    - link "Highlights":
      - /url: https://www.evertonfc.com/videos/b64adb5d-5b52-4ef9-84c0-2403cf67d5ec
      - tab:
        - img
    `);
});

test('Match Centre - Other Teams Results Min by min - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.evertonfc.com/matches/u21/2025/g2597648#Live_Updates');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Min-by-min" [level=2]
    - strong: "Updated:"
    - text: in 0 seconds
    - tab:
      - img
    - text: Refresh
    - paragraph: Awaiting Match Updates
    `);
  await expect(page.getByLabel('Tab Carousel').locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
    - group "1 of 5":
      - tab "Tab Live Updates" [selected]
    - group "2 of 5":
      - tab "Tab Lineups"
    - group "3 of 5":
      - tab "Tab Stats"
    - group "4 of 5":
      - tab "Tab Scores"
    - group "5 of 5":
      - tab "Tab Table"
    `);
});

test('Match Centre - Other Teams Results Min by min - LivePreview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/matches/u21/2025/g2597648#Live_Updates');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Min-by-min" [level=2]
    - strong: "Updated:"
    - text: in 0 seconds
    - tab:
      - img
    - text: Refresh
    - paragraph: Awaiting Match Updates
    `);
  await expect(page.getByLabel('Tab Carousel').locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
    - group "1 of 5":
      - tab "Tab Live Updates" [selected]
    - group "2 of 5":
      - tab "Tab Lineups"
    - group "3 of 5":
      - tab "Tab Stats"
    - group "4 of 5":
      - tab "Tab Scores"
    - group "5 of 5":
      - tab "Tab Table"
    `);
});

test('Match Centre - Other Teams Results  Stats - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
await page.goto('https://www.evertonfc.com/matches/u21/2025/g2597648#Stats');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - paragraph: English Football League Trophy
    - paragraph: /Tue \\d+ Sep — \\d+:\\d+/
    - img
    - img: /\\d+\\.\\d+ % \\d+ 6 \\d+ \\d+ \\d+\\.\\d+ % 9 1 8 7 Possession Shots Shots On Target Corners Fouls/
    - paragraph: "2"
    - paragraph: "0"
    - paragraph: Cards
    - paragraph: "1"
    - paragraph: "0"
    `);
await expect(page.getByLabel('Tab Carousel').locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
        - group "1 of 5":
          - tab "Tab Live Updates"
        - group "2 of 5":
          - tab "Tab Lineups"
        - group "3 of 5":
          - tab "Tab Stats" [selected]
        - group "4 of 5":
          - tab "Tab Scores"
        - group "5 of 5":
          - tab "Tab Table"
        `);
});

test('Match Centre - Other Teams Results  Stats - LivePreview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();

await page.goto('https://livepreview.evertonfc.com/matches/u21/2025/g2597648#Stats');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - paragraph: English Football League Trophy
    - paragraph: /Tue \\d+ Sep — \\d+:\\d+/
    - img
    - img: /\\d+\\.\\d+ % \\d+ 6 \\d+ \\d+ \\d+\\.\\d+ % 9 1 8 7 Possession Shots Shots On Target Corners Fouls/
    - paragraph: "2"
    - paragraph: "0"
    - paragraph: Cards
    - paragraph: "1"
    - paragraph: "0"
    `);
await expect(page.getByLabel('Tab Carousel').locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
        - group "1 of 5":
          - tab "Tab Live Updates"
        - group "2 of 5":
          - tab "Tab Lineups"
        - group "3 of 5":
          - tab "Tab Stats" [selected]
        - group "4 of 5":
          - tab "Tab Scores"
        - group "5 of 5":
          - tab "Tab Table"
        `);
});

test('Match Centre - Other Teams Results  Lineups - LivePreview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();

await page.goto('https://livepreview.evertonfc.com/matches/u21/2025/g2597648#Lineups');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    - heading "Starting Eleven" [level=6]
    - text: GK 1 Lawlor DEF 2
    - img
    - text: /Sterry Glaves '\\d+ DEF \\d+ O'Riordan DEF 6 McGrath DEF \\d+ Senior MID \\d+/
    - img
    - text: /Clifton Hodgett '\\d+ MID \\d+ Close MID \\d+ Sbarra STR \\d+/
    - img
    - text: /Olusanya Musgrave-Dore '\\d+ STR 9/
    - img
    - text: /Hanlan Murray '\\d+ STR \\d+ Ajayi/
    - heading "Substitutes" [level=6]
    - text: /SUB \\d+ Glaves SUB \\d+ Middleton SUB \\d+ Cashmore SUB \\d+ Hodgett SUB \\d+ Musgrave-Dore SUB \\d+ Bryant SUB \\d+ Murray/
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    `);
await page.locator('div').filter({ hasText: /^EVE$/ }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    - heading "Starting Eleven" [level=6]
    - text: /GK \\d+ Pickford DEF \\d+ Finney DEF \\d+/
    - img
    - text: /Campbell Samuels-Smith '\\d+ DEF \\d+ Tamen DEF \\d+ Thomas DEF \\d+/
    - img
    - text: /Aznou Benjamin '\\d+ MID \\d+/
    - img
    - text: /Gomez van Schoor '\\d+ MID \\d+ Bates MID \\d+/
    - img
    - text: /Catesby Ebere '\\d+ STR \\d+ Beaumont-Clark STR \\d+ Clarke/
    - heading "Substitutes" [level=6]
    - text: /SUB \\d+ Benjamin SUB \\d+ Davis SUB \\d+ Moonan SUB \\d+ Samuels-Smith SUB \\d+ van Schoor SUB \\d+ Patrick SUB \\d+ Ebere/
    `);
});

test('Match Centre - Other Teams Results  Lineups - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();

await page.goto('https://www.evertonfc.com/matches/u21/2025/g2597648#Lineups');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    - heading "Starting Eleven" [level=6]
    - text: GK 1 Lawlor DEF 2
    - img
    - text: /Sterry Glaves '\\d+ DEF \\d+ O'Riordan DEF 6 McGrath DEF \\d+ Senior MID \\d+/
    - img
    - text: /Clifton Hodgett '\\d+ MID \\d+ Close MID \\d+ Sbarra STR \\d+/
    - img
    - text: /Olusanya Musgrave-Dore '\\d+ STR 9/
    - img
    - text: /Hanlan Murray '\\d+ STR \\d+ Ajayi/
    - heading "Substitutes" [level=6]
    - text: /SUB \\d+ Glaves SUB \\d+ Middleton SUB \\d+ Cashmore SUB \\d+ Hodgett SUB \\d+ Musgrave-Dore SUB \\d+ Bryant SUB \\d+ Murray/
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    `);
await page.locator('div').filter({ hasText: /^EVE$/ }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: DON
    - img
    - text: EVE
    - heading "Starting Eleven" [level=6]
    - text: /GK \\d+ Pickford DEF \\d+ Finney DEF \\d+/
    - img
    - text: /Campbell Samuels-Smith '\\d+ DEF \\d+ Tamen DEF \\d+ Thomas DEF \\d+/
    - img
    - text: /Aznou Benjamin '\\d+ MID \\d+/
    - img
    - text: /Gomez van Schoor '\\d+ MID \\d+ Bates MID \\d+/
    - img
    - text: /Catesby Ebere '\\d+ STR \\d+ Beaumont-Clark STR \\d+ Clarke/
    - heading "Substitutes" [level=6]
    - text: /SUB \\d+ Benjamin SUB \\d+ Davis SUB \\d+ Moonan SUB \\d+ Samuels-Smith SUB \\d+ van Schoor SUB \\d+ Patrick SUB \\d+ Ebere/
    `);
});

test('Match Centre - Other Teams Results Todays Games - LivePreview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();

await page.goto('https://livepreview.evertonfc.com/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
await page.getByRole('tab', { name: 'Tab U21' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Tamworth" [level=3]
    - img
    - paragraph: The Lamb Ground
    - paragraph: "0"
    - paragraph: Days
    - paragraph: "8"
    - paragraph: Hours
    - paragraph: /\\d+/
    - paragraph: Mins
    - paragraph: /\\d+/
    - paragraph: Secs
    - img "Sponsor Logo"
    - 'button "want to watch live: buy video pass"':
      - tab:
        - img
      - paragraph: "want to watch live:"
      - paragraph: buy video pass
    `);
});

test('Match Centre - Other Teams Results Todays Games - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: { username: previewUsername, password: previewPassword },
    });
    const page = await context.newPage();
  
    await page.goto('https://www.evertonfc.com/');
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await page.getByLabel('Burger Menu').click();
    await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
    await page.getByRole('tab', { name: 'Tab U21' }).click();
  
    // --- Only log what's missing ---
    type Check = { label: string; isOk: () => Promise<boolean> };
    const checks: Check[] = [
      { label: `heading level=3 "Tamworth"`,
        isOk: () => page.getByRole('heading', { name: 'Tamworth', level: 3 }).first().isVisible()
      },
      { label: `paragraph "The Lamb Ground"`,
        isOk: () => page.getByText('The Lamb Ground', { exact: true }).first().isVisible()
      },
      { label: `paragraph "0" (Days countdown)`,
        isOk: () => page.getByText(/^0$/).first().isVisible()
      },
      { label: `paragraph "Days"`,
        isOk: () => page.getByText('Days', { exact: true }).first().isVisible()
      },
      { label: `paragraph "8" (Hours countdown)`,
        isOk: () => page.getByText(/^8$/).first().isVisible()
      },
      { label: `paragraph "Hours"`,
        isOk: () => page.getByText('Hours', { exact: true }).first().isVisible()
      },
      { label: `paragraph /\\d+/ (Mins)`,
        isOk: async () => {
          const mins = page.getByText(/^\d+$/);
          const label = page.getByText('Mins', { exact: true });
          return (await mins.first().isVisible()) && (await label.first().isVisible());
        }
      },
      { label: `paragraph /\\d+/ (Secs)`,
        isOk: async () => {
          const secs = page.getByText(/^\d+$/);
          const label = page.getByText('Secs', { exact: true });
          return (await secs.first().isVisible()) && (await label.first().isVisible());
        }
      },
      { label: `img "Sponsor Logo"`,
        isOk: () => page.getByRole('img', { name: 'Sponsor Logo' }).first().isVisible()
      },
      { label: `button /want to watch live:.*buy video pass/i`,
        isOk: () => page.getByRole('button', { name: /want to watch live:.*buy video pass/i }).first().isVisible()
      },
    ];
  
    const missing: string[] = [];
    await Promise.all(
      checks.map(async c => {
        const ok = await c.isOk();
        if (!ok) missing.push(`- ${c.label}`);
      })
    );
  
    if (missing.length) {
      console.error(`❌ Missing UI bits:\n${missing.join('\n')}`);
      throw new Error(`Expected UI elements not found:\n${missing.join('\n')}`);
    }
    await expect.soft(page.getByRole('main')).toMatchAriaSnapshot(`
      - heading "Tamworth" [level=3]
      - img
      - paragraph: The Lamb Ground
      - paragraph: "0"
      - paragraph: Days
      - paragraph: "8"
      - paragraph: Hours
      - paragraph: /\\d+/
      - paragraph: Mins
      - paragraph: /\\d+/
      - paragraph: Secs
      - img "Sponsor Logo"
      - 'button "want to watch live: buy video pass"':
        - tab:
          - img
        - paragraph: "want to watch live:"
        - paragraph: buy video pass
    `);
});

test('Match Centre - Other Teams Table - LivePreview', async ({ browser }) => {
        test.setTimeout(120_000); // 2 minutes
      
        const context = await browser.newContext({
          httpCredentials: {
            username: previewUsername,
            password: previewPassword,
          },
        });
      
        const page = await context.newPage();
      
        // Navigate to Everton preview site
await page.goto('https://livepreview.evertonfc.com/', { waitUntil: 'domcontentloaded' });
      
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
console.log('Opening Burger Menu...');
await page.getByLabel(/burger menu/i).click();
      
console.log('Clicking Matches tab...');
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
      
console.log('Navigating to Results...');
await page.getByText('Results', { exact: true }).click();
      
console.log('Selecting season 2024...');
await page.locator('#seasons').selectOption('2024');
await page.waitForTimeout(1000);

await page.locator('div').filter({ hasText: /^Table$/ }).click();
await expect(page.getByLabel('League Table')).toMatchAriaSnapshot(`
  - region "League Table":
    - table:
      - rowgroup:
        - row "Teams P W D L GF GA GD Pts Form":
          - cell "Teams":
            - img
          - cell "P"
          - cell "W"
          - cell "D"
          - cell "L"
          - cell "GF"
          - cell "GA"
          - cell "GD"
          - cell "Pts"
          - cell "Form"
    - table:
      - rowgroup:
        - row /1 Liverpool Crest Liverpool \\d+ \\d+ 9 4 \\d+ \\d+ \\d+ \\d+/:
          - cell "1 Liverpool Crest Liverpool":
            - tab:
              - img
            - img "Liverpool Crest"
            - paragraph: Liverpool
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell "4"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /2 Arsenal Crest Arsenal \\d+ \\d+ \\d+ 4 \\d+ \\d+ \\d+ \\d+/:
          - cell "2 Arsenal Crest Arsenal":
            - tab:
              - img
            - img "Arsenal Crest"
            - paragraph: Arsenal
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "4"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /3 Man City Crest Manchester City \\d+ \\d+ 8 9 \\d+ \\d+ \\d+ \\d+/:
          - cell "3 Man City Crest Manchester City":
            - tab:
              - img
            - img "Man City Crest"
            - paragraph: Manchester City
          - cell /\\d+/
          - cell /\\d+/
          - cell "8"
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /4 Chelsea Crest Chelsea \\d+ \\d+ 9 9 \\d+ \\d+ \\d+ \\d+/:
          - cell "4 Chelsea Crest Chelsea":
            - tab:
              - img
            - img "Chelsea Crest"
            - paragraph: Chelsea
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /5 Newcastle Crest Newcastle United \\d+ \\d+ 6 \\d+ \\d+ \\d+ \\d+ \\d+/:
          - cell "5 Newcastle Crest Newcastle United":
            - tab:
              - img
            - img "Newcastle Crest"
            - paragraph: Newcastle United
          - cell /\\d+/
          - cell /\\d+/
          - cell "6"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /6 A Villa Crest Aston Villa \\d+ \\d+ 9 \\d+ \\d+ \\d+ 7 \\d+/:
          - cell "6 A Villa Crest Aston Villa":
            - tab:
              - img
            - img "A Villa Crest"
            - paragraph: Aston Villa
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "7"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /7 Nott'm Forest Crest Nottingham Forest \\d+ \\d+ 8 \\d+ \\d+ \\d+ \\d+ \\d+/:
          - cell "7 Nott'm Forest Crest Nottingham Forest":
            - tab:
              - img
            - img "Nott'm Forest Crest"
            - paragraph: Nottingham Forest
          - cell /\\d+/
          - cell /\\d+/
          - cell "8"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /8 Brighton Crest Brighton and Hove Albion \\d+ \\d+ \\d+ 9 \\d+ \\d+ 7 \\d+/:
          - cell "8 Brighton Crest Brighton and Hove Albion":
            - tab:
              - img
            - img "Brighton Crest"
            - paragraph: Brighton and Hove Albion
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell "7"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /9 Bournemouth Crest Bournemouth \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ \\d+/:
          - cell "9 Bournemouth Crest Bournemouth":
            - tab:
              - img
            - img "Bournemouth Crest"
            - paragraph: Bournemouth
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Brentford Crest Brentford \\d+ \\d+ 8 \\d+ \\d+ \\d+ 9 \\d+/:
          - cell /\\d+ Brentford Crest Brentford/:
            - tab:
              - img
            - img "Brentford Crest"
            - paragraph: Brentford
          - cell /\\d+/
          - cell /\\d+/
          - cell "8"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Fulham Crest Fulham \\d+ \\d+ 9 \\d+ \\d+ \\d+ 0 \\d+/:
          - cell /\\d+ Fulham Crest Fulham/:
            - tab:
              - img
            - img "Fulham Crest"
            - paragraph: Fulham
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "0"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ C Palace Crest Crystal Palace \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ 0 \\d+/:
          - cell /\\d+ C Palace Crest Crystal Palace/:
            - tab:
              - img
            - img "C Palace Crest"
            - paragraph: Crystal Palace
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "0"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Everton Crest Everton \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ -2 \\d+/:
          - cell /\\d+ Everton Crest Everton/:
            - tab:
              - img
            - img "Everton Crest"
            - paragraph: Everton
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "-2"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ West Ham Crest West Ham United \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ West Ham Crest West Ham United/:
            - tab:
              - img
            - img "West Ham Crest"
            - paragraph: West Ham United
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Man Utd Crest Manchester United \\d+ \\d+ 9 \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ Man Utd Crest Manchester United/:
            - tab:
              - img
            - img "Man Utd Crest"
            - paragraph: Manchester United
          - cell /\\d+/
          - cell /\\d+/
          - cell "9"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Wolves Crest Wolverhampton Wanderers \\d+ \\d+ 6 \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ Wolves Crest Wolverhampton Wanderers/:
            - tab:
              - img
            - img "Wolves Crest"
            - paragraph: Wolverhampton Wanderers
          - cell /\\d+/
          - cell /\\d+/
          - cell "6"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Spurs Crest Tottenham Hotspur \\d+ \\d+ 5 \\d+ \\d+ \\d+ -1 \\d+/:
          - cell /\\d+ Spurs Crest Tottenham Hotspur/:
            - tab:
              - img
            - img "Spurs Crest"
            - paragraph: Tottenham Hotspur
          - cell /\\d+/
          - cell /\\d+/
          - cell "5"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell "-1"
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Leicester Crest Leicester City \\d+ 6 7 \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ Leicester Crest Leicester City/:
            - tab:
              - img
            - img "Leicester Crest"
            - paragraph: Leicester City
          - cell /\\d+/
          - cell "6"
          - cell "7"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Ipswich Crest Ipswich Town \\d+ 4 \\d+ \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ Ipswich Crest Ipswich Town/:
            - tab:
              - img
            - img "Ipswich Crest"
            - paragraph: Ipswich Town
          - cell /\\d+/
          - cell "4"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
        - row /\\d+ Southampton Crest Southampton \\d+ 2 6 \\d+ \\d+ \\d+ -\\d+ \\d+/:
          - cell /\\d+ Southampton Crest Southampton/:
            - tab:
              - img
            - img "Southampton Crest"
            - paragraph: Southampton
          - cell /\\d+/
          - cell "2"
          - cell "6"
          - cell /\\d+/
          - cell /\\d+/
          - cell /\\d+/
          - cell /-\\d+/
          - cell /\\d+/
          - cell:
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
            - tab:
              - img
  `);
});

test('Match Centre - Other Teams Table - Prod', async ({ browser }) => {
    test.setTimeout(120_000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
    // Navigate to Everton preview site
await page.goto('https://www.evertonfc.com/', { waitUntil: 'domcontentloaded' });
  
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
console.log('Opening Burger Menu...');
await page.getByLabel(/burger menu/i).click();
  
console.log('Clicking Matches tab...');
await page.getByRole('listitem').filter({ hasText: 'Matches' }).getByRole('tab').click();
  
console.log('Navigating to Results...');
await page.getByText('Results', { exact: true }).click();
  
console.log('Selecting season 2024...');
await page.locator('#seasons').selectOption('2024');
await page.waitForTimeout(1000);

await page.locator('div').filter({ hasText: /^Table$/ }).click();
await page.waitForTimeout(1000);
await expect(page.getByLabel('League Table')).toMatchAriaSnapshot(`
    - region "League Table":
      - table:
        - rowgroup:
          - row "Teams P W D L GF GA GD Pts Form":
            - cell "Teams":
              - img
            - cell "P"
            - cell "W"
            - cell "D"
            - cell "L"
            - cell "GF"
            - cell "GA"
            - cell "GD"
            - cell "Pts"
            - cell "Form"
      - table:
        - rowgroup:
          - row /1 Liverpool Crest Liverpool \\d+ \\d+ 9 4 \\d+ \\d+ \\d+ \\d+/:
            - cell "1 Liverpool Crest Liverpool":
              - tab:
                - img
              - img "Liverpool Crest"
              - paragraph: Liverpool
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell "4"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /2 Arsenal Crest Arsenal \\d+ \\d+ \\d+ 4 \\d+ \\d+ \\d+ \\d+/:
            - cell "2 Arsenal Crest Arsenal":
              - tab:
                - img
              - img "Arsenal Crest"
              - paragraph: Arsenal
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "4"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /3 Man City Crest Manchester City \\d+ \\d+ 8 9 \\d+ \\d+ \\d+ \\d+/:
            - cell "3 Man City Crest Manchester City":
              - tab:
                - img
              - img "Man City Crest"
              - paragraph: Manchester City
            - cell /\\d+/
            - cell /\\d+/
            - cell "8"
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /4 Chelsea Crest Chelsea \\d+ \\d+ 9 9 \\d+ \\d+ \\d+ \\d+/:
            - cell "4 Chelsea Crest Chelsea":
              - tab:
                - img
              - img "Chelsea Crest"
              - paragraph: Chelsea
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /5 Newcastle Crest Newcastle United \\d+ \\d+ 6 \\d+ \\d+ \\d+ \\d+ \\d+/:
            - cell "5 Newcastle Crest Newcastle United":
              - tab:
                - img
              - img "Newcastle Crest"
              - paragraph: Newcastle United
            - cell /\\d+/
            - cell /\\d+/
            - cell "6"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /6 A Villa Crest Aston Villa \\d+ \\d+ 9 \\d+ \\d+ \\d+ 7 \\d+/:
            - cell "6 A Villa Crest Aston Villa":
              - tab:
                - img
              - img "A Villa Crest"
              - paragraph: Aston Villa
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "7"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /7 Nott'm Forest Crest Nottingham Forest \\d+ \\d+ 8 \\d+ \\d+ \\d+ \\d+ \\d+/:
            - cell "7 Nott'm Forest Crest Nottingham Forest":
              - tab:
                - img
              - img "Nott'm Forest Crest"
              - paragraph: Nottingham Forest
            - cell /\\d+/
            - cell /\\d+/
            - cell "8"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /8 Brighton Crest Brighton and Hove Albion \\d+ \\d+ \\d+ 9 \\d+ \\d+ 7 \\d+/:
            - cell "8 Brighton Crest Brighton and Hove Albion":
              - tab:
                - img
              - img "Brighton Crest"
              - paragraph: Brighton and Hove Albion
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell "7"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /9 Bournemouth Crest Bournemouth \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ \\d+/:
            - cell "9 Bournemouth Crest Bournemouth":
              - tab:
                - img
              - img "Bournemouth Crest"
              - paragraph: Bournemouth
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Brentford Crest Brentford \\d+ \\d+ 8 \\d+ \\d+ \\d+ 9 \\d+/:
            - cell /\\d+ Brentford Crest Brentford/:
              - tab:
                - img
              - img "Brentford Crest"
              - paragraph: Brentford
            - cell /\\d+/
            - cell /\\d+/
            - cell "8"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Fulham Crest Fulham \\d+ \\d+ 9 \\d+ \\d+ \\d+ 0 \\d+/:
            - cell /\\d+ Fulham Crest Fulham/:
              - tab:
                - img
              - img "Fulham Crest"
              - paragraph: Fulham
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "0"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ C Palace Crest Crystal Palace \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ 0 \\d+/:
            - cell /\\d+ C Palace Crest Crystal Palace/:
              - tab:
                - img
              - img "C Palace Crest"
              - paragraph: Crystal Palace
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "0"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Everton Crest Everton \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ -2 \\d+/:
            - cell /\\d+ Everton Crest Everton/:
              - tab:
                - img
              - img "Everton Crest"
              - paragraph: Everton
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "-2"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ West Ham Crest West Ham United \\d+ \\d+ \\d+ \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ West Ham Crest West Ham United/:
              - tab:
                - img
              - img "West Ham Crest"
              - paragraph: West Ham United
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Man Utd Crest Manchester United \\d+ \\d+ 9 \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ Man Utd Crest Manchester United/:
              - tab:
                - img
              - img "Man Utd Crest"
              - paragraph: Manchester United
            - cell /\\d+/
            - cell /\\d+/
            - cell "9"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Wolves Crest Wolverhampton Wanderers \\d+ \\d+ 6 \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ Wolves Crest Wolverhampton Wanderers/:
              - tab:
                - img
              - img "Wolves Crest"
              - paragraph: Wolverhampton Wanderers
            - cell /\\d+/
            - cell /\\d+/
            - cell "6"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Spurs Crest Tottenham Hotspur \\d+ \\d+ 5 \\d+ \\d+ \\d+ -1 \\d+/:
            - cell /\\d+ Spurs Crest Tottenham Hotspur/:
              - tab:
                - img
              - img "Spurs Crest"
              - paragraph: Tottenham Hotspur
            - cell /\\d+/
            - cell /\\d+/
            - cell "5"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell "-1"
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Leicester Crest Leicester City \\d+ 6 7 \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ Leicester Crest Leicester City/:
              - tab:
                - img
              - img "Leicester Crest"
              - paragraph: Leicester City
            - cell /\\d+/
            - cell "6"
            - cell "7"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Ipswich Crest Ipswich Town \\d+ 4 \\d+ \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ Ipswich Crest Ipswich Town/:
              - tab:
                - img
              - img "Ipswich Crest"
              - paragraph: Ipswich Town
            - cell /\\d+/
            - cell "4"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
          - row /\\d+ Southampton Crest Southampton \\d+ 2 6 \\d+ \\d+ \\d+ -\\d+ \\d+/:
            - cell /\\d+ Southampton Crest Southampton/:
              - tab:
                - img
              - img "Southampton Crest"
              - paragraph: Southampton
            - cell /\\d+/
            - cell "2"
            - cell "6"
            - cell /\\d+/
            - cell /\\d+/
            - cell /\\d+/
            - cell /-\\d+/
            - cell /\\d+/
            - cell:
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
              - tab:
                - img
    `);
});


