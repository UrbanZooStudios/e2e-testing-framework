// npx playwright test "test/Fanside/Fanside Teams.spec.ts" --headed
import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
const previewUsername = process.env.PREVIEW_USERNAME || 'urbanzoo';
const previewPassword = process.env.PREVIEW_PASSWORD || 'gamechanger1!';

test('First Team Squad - Live Preview', async ({ browser }, testInfo) => {
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
await page.getByRole('tab', { name: 'Teams' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - region:
      - group "1 of 4":
        - tab "Tab Men" [selected]
      - group "2 of 4":
        - tab "Tab Women"
      - group "3 of 4":
        - tab "Tab U21"
      - group "4 of 4":
        - tab "Tab U18"
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - heading "Goalkeeper" [level=2]
        - link "Jordan Pickford 1 Jordan Pickford Goalkeeper":
          - /url: /teams/men/jordanleepickford
          - img "Jordan Pickford"
          - heading "Jordan Pickford" [level=3]
        - link /Mark Travers \\d+ Mark Travers Goalkeeper/:
          - /url: /teams/men/marktravers
          - img "Mark Travers"
          - heading "Mark Travers" [level=3]
        - link /Tom King \\d+ Tom King Goalkeeper/:
          - /url: /teams/men/tomking
          - img "Tom King"
          - heading "Tom King" [level=3]
        - link /Harry Tyrer \\d+ Harry Tyrer Goalkeeper/:
          - /url: /teams/men/harrytyrer
          - img "Harry Tyrer"
          - heading "Harry Tyrer" [level=3]
        - heading "Defender" [level=2]
        - link "Nathan Patterson 2 Nathan Patterson FULL-BACK":
          - /url: /teams/men/nathanpatterson
          - img "Nathan Patterson"
          - heading "Nathan Patterson" [level=3]
        - link "Michael Keane 5 Michael Keane Central Defender":
          - /url: /teams/men/michaelvincentkeane
          - img "Michael Keane"
          - heading "Michael Keane" [level=3]
        - link "James Tarkowski 6 James Tarkowski Central Defender":
          - /url: /teams/men/jamesalantarkowski
          - img "James Tarkowski"
          - heading "James Tarkowski" [level=3]
        - link /Jake O'Brien \\d+ Jake O'Brien Central Defender/:
          - /url: /teams/men/jakeo'brien
          - img "Jake O'Brien"
          - heading "Jake O'Brien" [level=3]
        - link /Vitalii Mykolenko \\d+ Vitalii Mykolenko FULL-BACK/:
          - /url: /teams/men/vitaliimykolenko
          - img "Vitalii Mykolenko"
          - heading "Vitalii Mykolenko" [level=3]
        - link /Séamus Coleman Captain \\d+ Séamus Coleman Full-Back/:
          - /url: /teams/men/séamuscoleman
          - img "Séamus Coleman"
          - tab:
            - img
          - paragraph: Captain
          - heading "Séamus Coleman" [level=3]
        - link /Jarrad Branthwaite \\d+ Jarrad Branthwaite Central Defender/:
          - /url: /teams/men/jarradbranthwaite
          - img "Jarrad Branthwaite"
          - heading "Jarrad Branthwaite" [level=3]
        - link /Adam Aznou \\d+ Adam Aznou Full-back/:
          - /url: /teams/men/adamaznou
          - img "Adam Aznou"
          - heading "Adam Aznou" [level=3]
        - heading "Midfielder" [level=2]
        - 'link /Jack Grealish Loaned in: Manchester City \\d+ Jack Grealish Attacking Midfielder/':
          - /url: /teams/men/jackgrealish
          - img "Jack Grealish"
          - paragraph: "Loaned in: Manchester City"
          - heading "Jack Grealish" [level=3]
        - link /Kiernan Dewsbury-Hall \\d+ Kiernan Dewsbury-Hall Central Midfielder/:
          - /url: /teams/men/kiernandewsbury-hall
          - img "Kiernan Dewsbury-Hall"
          - heading "Kiernan Dewsbury-Hall" [level=3]
        - link /Charly Alcaraz \\d+ Charly Alcaraz Attacking Midfielder/:
          - /url: /teams/men/carlosalcaraz
          - img "Charly Alcaraz"
          - heading "Charly Alcaraz" [level=3]
        - link /Idrissa Gana Gueye \\d+ Idrissa Gana Gueye Defensive Midfielder/:
          - /url: /teams/men/idrissagueye
          - img "Idrissa Gana Gueye"
          - heading "Idrissa Gana Gueye" [level=3]
        - 'link /Merlin Röhl Loaned in: SC Freiburg \\d+ Merlin Röhl Central Midfielder/':
          - /url: /teams/men/merlinrohl
          - img "Merlin Röhl"
          - paragraph: "Loaned in: SC Freiburg"
          - heading "Merlin Röhl" [level=3]
        - link /James Garner \\d+ James Garner Central Midfielder/:
          - /url: /teams/men/jamesdavidgarner
          - img "James Garner"
          - heading "James Garner" [level=3]
        - link /Tim Iroegbunam \\d+ Tim Iroegbunam Central Midfielder/:
          - /url: /teams/men/timiroegbunam
          - img "Tim Iroegbunam"
          - heading "Tim Iroegbunam" [level=3]
        - heading "Forward" [level=2]
        - link "Dwight McNeil 7 Dwight McNeil Winger":
          - /url: /teams/men/dwightmcneil
          - img "Dwight McNeil"
          - heading "Dwight McNeil" [level=3]
        - link "Beto 9 Beto Striker":
          - /url: /teams/men/beto
          - img "Beto"
          - heading "Beto" [level=3]
        - link /Iliman Ndiaye \\d+ Iliman Ndiaye Winger/:
          - /url: /teams/men/ilimanndiaye
          - img "Iliman Ndiaye"
          - heading "Iliman Ndiaye" [level=3]
        - link /Thierno Barry \\d+ Thierno Barry Striker/:
          - /url: /teams/men/thiernobarry
          - img "Thierno Barry"
          - heading "Thierno Barry" [level=3]
        - link /Tyler Dibling \\d+ Tyler Dibling Winger/:
          - /url: /teams/men/tylerdibling
          - img "Tyler Dibling"
          - heading "Tyler Dibling" [level=3]
    `);
});

test('First Team Squad - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
await page.goto('https://www.evertonfc.com/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('tab', { name: 'Teams' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - region:
      - group "1 of 4":
        - tab "Tab Men" [selected]
      - group "2 of 4":
        - tab "Tab Women"
      - group "3 of 4":
        - tab "Tab U21"
      - group "4 of 4":
        - tab "Tab U18"
    `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - heading "Goalkeeper" [level=2]
        - link "Jordan Pickford 1 Jordan Pickford Goalkeeper":
          - /url: /teams/men/jordanleepickford
          - img "Jordan Pickford"
          - heading "Jordan Pickford" [level=3]
        - link /Mark Travers \\d+ Mark Travers Goalkeeper/:
          - /url: /teams/men/marktravers
          - img "Mark Travers"
          - heading "Mark Travers" [level=3]
        - link /Tom King \\d+ Tom King Goalkeeper/:
          - /url: /teams/men/tomking
          - img "Tom King"
          - heading "Tom King" [level=3]
        - link /Harry Tyrer \\d+ Harry Tyrer Goalkeeper/:
          - /url: /teams/men/harrytyrer
          - img "Harry Tyrer"
          - heading "Harry Tyrer" [level=3]
        - heading "Defender" [level=2]
        - link "Nathan Patterson 2 Nathan Patterson FULL-BACK":
          - /url: /teams/men/nathanpatterson
          - img "Nathan Patterson"
          - heading "Nathan Patterson" [level=3]
        - link "Michael Keane 5 Michael Keane Central Defender":
          - /url: /teams/men/michaelvincentkeane
          - img "Michael Keane"
          - heading "Michael Keane" [level=3]
        - link "James Tarkowski 6 James Tarkowski Central Defender":
          - /url: /teams/men/jamesalantarkowski
          - img "James Tarkowski"
          - heading "James Tarkowski" [level=3]
        - link /Jake O'Brien \\d+ Jake O'Brien Central Defender/:
          - /url: /teams/men/jakeo'brien
          - img "Jake O'Brien"
          - heading "Jake O'Brien" [level=3]
        - link /Vitalii Mykolenko \\d+ Vitalii Mykolenko FULL-BACK/:
          - /url: /teams/men/vitaliimykolenko
          - img "Vitalii Mykolenko"
          - heading "Vitalii Mykolenko" [level=3]
        - link /Séamus Coleman Captain \\d+ Séamus Coleman Full-Back/:
          - /url: /teams/men/séamuscoleman
          - img "Séamus Coleman"
          - tab:
            - img
          - paragraph: Captain
          - heading "Séamus Coleman" [level=3]
        - link /Jarrad Branthwaite \\d+ Jarrad Branthwaite Central Defender/:
          - /url: /teams/men/jarradbranthwaite
          - img "Jarrad Branthwaite"
          - heading "Jarrad Branthwaite" [level=3]
        - link /Adam Aznou \\d+ Adam Aznou Full-back/:
          - /url: /teams/men/adamaznou
          - img "Adam Aznou"
          - heading "Adam Aznou" [level=3]
        - heading "Midfielder" [level=2]
        - 'link /Jack Grealish Loaned in: Manchester City \\d+ Jack Grealish Attacking Midfielder/':
          - /url: /teams/men/jackgrealish
          - img "Jack Grealish"
          - paragraph: "Loaned in: Manchester City"
          - heading "Jack Grealish" [level=3]
        - link /Kiernan Dewsbury-Hall \\d+ Kiernan Dewsbury-Hall Central Midfielder/:
          - /url: /teams/men/kiernandewsbury-hall
          - img "Kiernan Dewsbury-Hall"
          - heading "Kiernan Dewsbury-Hall" [level=3]
        - link /Charly Alcaraz \\d+ Charly Alcaraz Attacking Midfielder/:
          - /url: /teams/men/carlosalcaraz
          - img "Charly Alcaraz"
          - heading "Charly Alcaraz" [level=3]
        - link /Idrissa Gana Gueye \\d+ Idrissa Gana Gueye Defensive Midfielder/:
          - /url: /teams/men/idrissagueye
          - img "Idrissa Gana Gueye"
          - heading "Idrissa Gana Gueye" [level=3]
        - 'link /Merlin Röhl Loaned in: SC Freiburg \\d+ Merlin Röhl Central Midfielder/':
          - /url: /teams/men/merlinrohl
          - img "Merlin Röhl"
          - paragraph: "Loaned in: SC Freiburg"
          - heading "Merlin Röhl" [level=3]
        - link /James Garner \\d+ James Garner Central Midfielder/:
          - /url: /teams/men/jamesdavidgarner
          - img "James Garner"
          - heading "James Garner" [level=3]
        - link /Tim Iroegbunam \\d+ Tim Iroegbunam Central Midfielder/:
          - /url: /teams/men/timiroegbunam
          - img "Tim Iroegbunam"
          - heading "Tim Iroegbunam" [level=3]
        - heading "Forward" [level=2]
        - link "Dwight McNeil 7 Dwight McNeil Winger":
          - /url: /teams/men/dwightmcneil
          - img "Dwight McNeil"
          - heading "Dwight McNeil" [level=3]
        - link "Beto 9 Beto Striker":
          - /url: /teams/men/beto
          - img "Beto"
          - heading "Beto" [level=3]
        - link /Iliman Ndiaye \\d+ Iliman Ndiaye Winger/:
          - /url: /teams/men/ilimanndiaye
          - img "Iliman Ndiaye"
          - heading "Iliman Ndiaye" [level=3]
        - link /Thierno Barry \\d+ Thierno Barry Striker/:
          - /url: /teams/men/thiernobarry
          - img "Thierno Barry"
          - heading "Thierno Barry" [level=3]
        - link /Tyler Dibling \\d+ Tyler Dibling Winger/:
          - /url: /teams/men/tylerdibling
          - img "Tyler Dibling"
          - heading "Tyler Dibling" [level=3]
    `);
});

test('First Team Squad - Pick a Player - Live Preview', async ({ browser }, testInfo) => {
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
await page.getByRole('tab', { name: 'Teams' }).click();
await page.getByRole('link', { name: 'Mark Travers 12 Mark Travers' }).click();
await expect(page.getByText('12MarkTraversGoalkeeper')).toBeVisible();
await expect(page.getByRole('main').getByRole('img').filter({ hasText: /^$/ }).first()).toBeVisible();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Overview
  - paragraph: "1"
  - paragraph: Appearances
  - paragraph: "1"
  - paragraph: Starts
  - paragraph: /\\d+/
  - paragraph: Mins Played
  - paragraph: "1"
  - paragraph: Clean Sheets
  - paragraph: "1"
  - paragraph: Saves
  `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Overview
  - paragraph: "1"
  - paragraph: Appearances
  - paragraph: "1"
  - paragraph: Starts
  - paragraph: /\\d+/
  - paragraph: Mins Played
  - paragraph: "1"
  - paragraph: Clean Sheets
  - paragraph: "1"
  - paragraph: Saves
  - paragraph: Clean Sheets
  - img: /\\d+% 1 \\/ 1 Clean Sheet %/
  - paragraph: Punches
  - paragraph: "0"
  - paragraph: Catches
  - paragraph: "1"
  - paragraph: Shot-stopping
  - img: /\\d+% 1 \\/ 1 Total Saves %/
  - paragraph: Saves Made from Outside Box
  - paragraph: "0"
  - paragraph: Saves Made from Inside Box
  - paragraph: "1"
  - paragraph: Distribution
  - img: /\\d+% \\d+ \\/ \\d+ Pass Completion %/
  - paragraph: Penalties Saved
  - paragraph: "0"
  - paragraph: Clearances
  - paragraph: "0"
  `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - heading "BIO" [level=3]
  - paragraph: /Everton completed the signing of goalkeeper Mark Travers on a four-year contract in July \\d+\\./
  - paragraph: /The Republic of Ireland international joined the Blues from Bournemouth, where he spent nine years after signing in \\d+\\./
  - paragraph: /Travers earned \\d+ appearances for the Cherries, while also experiencing loans spells at Weymouth, Swindon Town and Stoke City, along with Middlesbrough, where he was the No\\.1 for the second half of their \\d+\\/\\d+ Championship campaign, playing \\d+ league matches\\./
  - paragraph: /Alongside his club football, the shot-stopper – born in Maynooth, Leinster – became a senior international with the Republic of Ireland in September \\d+ and has four caps to date\\./
  `);

});

test('First Team Squad - Pick a Player - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
await page.goto('https://www.evertonfc.com/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('tab', { name: 'Teams' }).click();
await page.getByRole('link', { name: 'Mark Travers 12 Mark Travers' }).click();
await expect(page.getByText('12MarkTraversGoalkeeper')).toBeVisible();
await expect(page.getByRole('main').getByRole('img').filter({ hasText: /^$/ }).first()).toBeVisible();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Overview
  - paragraph: "1"
  - paragraph: Appearances
  - paragraph: "1"
  - paragraph: Starts
  - paragraph: /\\d+/
  - paragraph: Mins Played
  - paragraph: "1"
  - paragraph: Clean Sheets
  - paragraph: "1"
  - paragraph: Saves
  `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Overview
  - paragraph: "1"
  - paragraph: Appearances
  - paragraph: "1"
  - paragraph: Starts
  - paragraph: /\\d+/
  - paragraph: Mins Played
  - paragraph: "1"
  - paragraph: Clean Sheets
  - paragraph: "1"
  - paragraph: Saves
  - paragraph: Clean Sheets
  - img: /\\d+% 1 \\/ 1 Clean Sheet %/
  - paragraph: Punches
  - paragraph: "0"
  - paragraph: Catches
  - paragraph: "1"
  - paragraph: Shot-stopping
  - img: /\\d+% 1 \\/ 1 Total Saves %/
  - paragraph: Saves Made from Outside Box
  - paragraph: "0"
  - paragraph: Saves Made from Inside Box
  - paragraph: "1"
  - paragraph: Distribution
  - img: /\\d+% \\d+ \\/ \\d+ Pass Completion %/
  - paragraph: Penalties Saved
  - paragraph: "0"
  - paragraph: Clearances
  - paragraph: "0"
  `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - heading "BIO" [level=3]
  - paragraph: /Everton completed the signing of goalkeeper Mark Travers on a four-year contract in July \\d+\\./
  - paragraph: /The Republic of Ireland international joined the Blues from Bournemouth, where he spent nine years after signing in \\d+\\./
  - paragraph: /Travers earned \\d+ appearances for the Cherries, while also experiencing loans spells at Weymouth, Swindon Town and Stoke City, along with Middlesbrough, where he was the No\\.1 for the second half of their \\d+\\/\\d+ Championship campaign, playing \\d+ league matches\\./
  - paragraph: /Alongside his club football, the shot-stopper – born in Maynooth, Leinster – became a senior international with the Republic of Ireland in September \\d+ and has four caps to date\\./
  `);

});

test('First Team Squad - Pick a Player - Sponsors - Live Preview', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.afcb.co.uk/teams/first-team/marcos-senesi');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.waitForTimeout(1000);
await expect(page.getByText('Sponsored by', { exact: true })).toBeVisible();
await expect(page.getByRole('main')).toContainText('Sponsored by');
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Sponsored by
  - link "Sponsor Image":
    - /url: https://www.upn.co.uk
    - img "Sponsor Image"
  `);

});

test('First Team Squad - Pick a Player - Sponsors - Prod', async ({ browser }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.afcb.co.uk/teams/first-team/marcos-senesi');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.waitForTimeout(1000);
await expect(page.getByText('Sponsored by', { exact: true })).toBeVisible();
await expect(page.getByRole('main')).toContainText('Sponsored by');
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - paragraph: Sponsored by
  - link "Sponsor Image":
    - /url: https://www.upn.co.uk
    - img "Sponsor Image"
  `);

});

test('First Team Squad - Pick a Player - Stats - LivePreview', async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/teams/men/tomking');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Overview
    - paragraph: "0"
    - paragraph: Appearances
    - paragraph: "0"
    - paragraph: Starts
    - paragraph: "0"
    - paragraph: Mins Played
    - paragraph: "0"
    - paragraph: Clean Sheets
    - paragraph: "0"
    - paragraph: Saves
    - paragraph: Clean Sheets
    - img: 0% 0 / 0 Clean Sheet %
    - paragraph: Punches
    - paragraph: "0"
    - paragraph: Catches
    - paragraph: "0"
    - paragraph: Shot-stopping
    - img: 0% 0 / 0 Total Saves %
    - paragraph: Saves Made from Outside Box
    - paragraph: "0"
    - paragraph: Saves Made from Inside Box
    - paragraph: "0"
    - paragraph: Distribution
    - img: 0% 0 / 0 Pass Completion %
    - paragraph: Penalties Saved
    - paragraph: "0"
    - paragraph: Clearances
    - paragraph: "0"
    `);
}); 

test('First Team Squad - Pick a Player - Stats - Prod', async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.evertonfc.com/teams/men/tomking');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: Overview
    - paragraph: "0"
    - paragraph: Appearances
    - paragraph: "0"
    - paragraph: Starts
    - paragraph: "0"
    - paragraph: Mins Played
    - paragraph: "0"
    - paragraph: Clean Sheets
    - paragraph: "0"
    - paragraph: Saves
    - paragraph: Clean Sheets
    - img: 0% 0 / 0 Clean Sheet %
    - paragraph: Punches
    - paragraph: "0"
    - paragraph: Catches
    - paragraph: "0"
    - paragraph: Shot-stopping
    - img: 0% 0 / 0 Total Saves %
    - paragraph: Saves Made from Outside Box
    - paragraph: "0"
    - paragraph: Saves Made from Inside Box
    - paragraph: "0"
    - paragraph: Distribution
    - img: 0% 0 / 0 Pass Completion %
    - paragraph: Penalties Saved
    - paragraph: "0"
    - paragraph: Clearances
    - paragraph: "0"
    `);
}); 

test('First Team Squad - Pick a Player - Player Bio - Live Preview', async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/teams/men/harrytyrer');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('heading', { name: 'BIO' })).toBeVisible();
await expect(page.getByText('BIOCrosby-born Tyrer has been')).toBeVisible();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - heading "BIO" [level=3]
  - paragraph: Crosby-born Tyrer has been with Everton since the age of seven.
  - paragraph: /An athletic, commanding goalkeeper, Tyrer established himself in Everton's Under-\\d+[hmsp]+ side in \\d+\\/\\d+ before breaking into David Unsworth's Under-\\d+[hmsp]+ team the following season\\./
  - paragraph: /Boyhood Evertonian Tyrer played \\d+ of the young Blues' \\d+ Premier League 2 matches, delivering a series of fine performances before the campaign was halted due to the coronavirus pandemic\\./
  - paragraph: /Tyrer's impressive development was underlined when he penned a first professional contract with the Club in January \\d+\\./
  - paragraph: /The talented stopper was a regular in Everton first-team training by the end of the \\d+\\/\\d+ season\\./
  - paragraph: /Valuable loan moves followed for Tyrer, who earned regular football with Chester in the National League North during \\d+\\/\\d+\\./
  - paragraph: Stepping up a division, he helped Chesterfield earn promotion from the National League to the EFL the following season.
  - paragraph: /In \\d+\\/\\d+, he signed on loan with Blackpool, where he made \\d+ League One appearances\\./
  - paragraph:
    - emphasis: "/Contracted until: June \\\\d+/"
  `);
});

test('First Team Squad - Pick a Player - Player Bio - Prod', async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/teams/men/harrytyrer');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('heading', { name: 'BIO' })).toBeVisible();
await expect(page.getByText('BIOCrosby-born Tyrer has been')).toBeVisible();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - heading "BIO" [level=3]
  - paragraph: Crosby-born Tyrer has been with Everton since the age of seven.
  - paragraph: /An athletic, commanding goalkeeper, Tyrer established himself in Everton's Under-\\d+[hmsp]+ side in \\d+\\/\\d+ before breaking into David Unsworth's Under-\\d+[hmsp]+ team the following season\\./
  - paragraph: /Boyhood Evertonian Tyrer played \\d+ of the young Blues' \\d+ Premier League 2 matches, delivering a series of fine performances before the campaign was halted due to the coronavirus pandemic\\./
  - paragraph: /Tyrer's impressive development was underlined when he penned a first professional contract with the Club in January \\d+\\./
  - paragraph: /The talented stopper was a regular in Everton first-team training by the end of the \\d+\\/\\d+ season\\./
  - paragraph: /Valuable loan moves followed for Tyrer, who earned regular football with Chester in the National League North during \\d+\\/\\d+\\./
  - paragraph: Stepping up a division, he helped Chesterfield earn promotion from the National League to the EFL the following season.
  - paragraph: /In \\d+\\/\\d+, he signed on loan with Blackpool, where he made \\d+ League One appearances\\./
  - paragraph:
    - emphasis: "/Contracted until: June \\\\d+/"
  `);
});

test.skip('First Team Squad - Pick a Player - Articles - Live Preview' , async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://livepreview.evertonfc.com/teams/men/harrytyrer');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('heading', { name: 'Related News' })).toBeVisible();
await expect(page.locator('#carousel-carousel-list')).toBeVisible();
await expect(page.locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
  - group /1 of \\d+/:
    - link /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall Under-\\d+[hmsp]+ \\| \\d+ December \\d+/:
      - /url: /news/2020/december/17/under-23s-keeper-tyrer-reveals-amazing-message-he-received-from-legend-southall/
      - img /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall/
      - heading /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall/ [level=3]
      - paragraph: /Under-\\d+[hmsp]+ \\|/
  - group /2 of \\d+/:
    - link "Beto and Dibling Surprise Fans As Stadium Tours Commence Beto and Dibling Surprise Fans As Stadium Tours Commence Men | 1 hour ago":
      - /url: /news/2025/september/16/beto-and-dibling-surprise-fans-as-stadium-tours-commence/
      - img "Beto and Dibling Surprise Fans As Stadium Tours Commence"
      - heading "Beto and Dibling Surprise Fans As Stadium Tours Commence" [level=3]
      - paragraph: Men |
  - group /3 of \\d+/:
    - link "Everton Launches New Women's Hall Of Fame Everton Launches New Women's Hall Of Fame Women | 2 hours ago":
      - /url: /news/2025/september/16/everton-launches-new-women-s-hall-of-fame/
      - img "Everton Launches New Women's Hall Of Fame"
      - heading "Everton Launches New Women's Hall Of Fame" [level=3]
      - paragraph: Women |
  `);

});

test.skip('First Team Squad - Pick a Player - Articles - Prod' , async ({ browser }, testinfo) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
// Navigate to the Tranmere Rovers live preview site
await page.goto('https://www.evertonfc.com/teams/men/harrytyrer');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await expect(page.getByRole('heading', { name: 'Related News' })).toBeVisible();
await expect(page.locator('#carousel-carousel-list')).toBeVisible();
await expect(page.locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
  - group /1 of \\d+/:
    - link /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall Under-\\d+[hmsp]+ \\| \\d+ December \\d+/:
      - /url: /news/2020/december/17/under-23s-keeper-tyrer-reveals-amazing-message-he-received-from-legend-southall/
      - img /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall/
      - heading /Under-\\d+[hmsp]+ Keeper Tyrer Reveals Amazing Message He Received From Legend Southall/ [level=3]
      - paragraph: /Under-\\d+[hmsp]+ \\|/
  - group /2 of \\d+/:
    - link "Beto and Dibling Surprise Fans As Stadium Tours Commence Beto and Dibling Surprise Fans As Stadium Tours Commence Men | 1 hour ago":
      - /url: /news/2025/september/16/beto-and-dibling-surprise-fans-as-stadium-tours-commence/
      - img "Beto and Dibling Surprise Fans As Stadium Tours Commence"
      - heading "Beto and Dibling Surprise Fans As Stadium Tours Commence" [level=3]
      - paragraph: Men |
  - group /3 of \\d+/:
    - link "Everton Launches New Women's Hall Of Fame Everton Launches New Women's Hall Of Fame Women | 2 hours ago":
      - /url: /news/2025/september/16/everton-launches-new-women-s-hall-of-fame/
      - img "Everton Launches New Women's Hall Of Fame"
      - heading "Everton Launches New Women's Hall Of Fame" [level=3]
      - paragraph: Women |
  `);

});

test('First Team Squad - Pick a Player - Return to Teams / Squads Page - Prod' , async ({ browser }, testinfo ) => {
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
await page.goto('https://www.evertonfc.com/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByRole('link', { name: 'Teams' }).click();
await page.getByRole('link', { name: 'Jordan Pickford 1 Jordan' }).click();
await page.getByRole('link', { name: 'Teams' }).click();
await expect(page.getByText('MenWomenU21U18')).toBeVisible();
});

test('Other Squads (Development, U23, U18, Women etc) - Live Preview' , async ({ browser }, testinfo ) => {
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
await page.getByRole('link', { name: 'Teams' }).click();
await page.getByRole('link', { name: 'Jordan Pickford 1 Jordan' }).click();
await page.getByRole('link', { name: 'Teams' }).click();
await expect(page.getByText('MenWomenU21U18')).toBeVisible();
});

test.skip('Other Squads (Development, U23, U18, Women etc) - Prod', async ({ browser }, testinfo) => { 
    test.setTimeout(120000); // 2 minutes
  
    const context = await browser.newContext({
      httpCredentials: {
        username: previewUsername,
        password: previewPassword,
      },
    });
  
    const page = await context.newPage();
  
await page.goto('https://www.evertonfc.com/');
await page.getByRole('button', { name: 'Accept All Cookies' }).click();
await page.getByLabel('Burger Menu').click();
await page.getByRole('tab', { name: 'Teams' }).click();
await page.getByRole('tab', { name: 'Tab U18' }).click();
await expect(page.locator('#carousel-carousel-list')).toMatchAriaSnapshot(`
  - group "1 of 4":
    - tab "Tab Men"
  - group "2 of 4":
    - tab "Tab Women"
  - group "3 of 4":
    - tab "Tab U21"
  - group "4 of 4":
    - tab "Tab U18" [selected]
  `);
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
  - heading "Goalkeeper" [level=2]
  - link "Goodness Gospel-Eze Goodness Gospel-Eze Goalkeeper":
    - /url: /teams/u18/goodnessgospel-eze
    - img "Goodness Gospel-Eze"
    - heading "Goodness Gospel-Eze" [level=3]
  - link "Douglass Lukjanciks Douglass Lukjanciks Goalkeeper":
    - /url: /teams/u18/douglaslukjanciks
    - img "Douglass Lukjanciks"
    - heading "Douglass Lukjanciks" [level=3]
  - link "Seve Patrick Seve Patrick Goalkeeper":
    - /url: /teams/u18/sevepatrick
    - img "Seve Patrick"
    - heading "Seve Patrick" [level=3]
  - heading "Defender" [level=2]
  - link "Harvey Billington Harvey Billington":
    - /url: /teams/u18/harveybillington
    - img "Harvey Billington"
    - heading "Harvey Billington" [level=3]
  - link "John Dodds John Dodds Centre Back":
    - /url: /teams/u18/johndodds50
    - img "John Dodds"
    - heading "John Dodds" [level=3]
  - link "Lewis Evans Lewis Evans Centre Back":
    - /url: /teams/u18/lewisevans50
    - img "Lewis Evans"
    - heading "Lewis Evans" [level=3]
  - link "Freddie Freedman Freddie Freedman Centre-Back":
    - /url: /teams/u18/freddiefreedman
    - img "Freddie Freedman"
    - heading "Freddie Freedman" [level=3]
  - link "Reuben Gokah Reuben Gokah":
    - /url: /teams/u18/reubengokah
    - img "Reuben Gokah"
    - heading "Reuben Gokah" [level=3]
  - link "Rocco Lambert Rocco Lambert":
    - /url: /teams/u18/roccolambert
    - img "Rocco Lambert"
    - heading "Rocco Lambert" [level=3]
  - link "Louis Poland Louis Poland Full-Back":
    - /url: /teams/u18/louispoland
    - img "Louis Poland"
    - heading "Louis Poland" [level=3]
  - heading "Midfielder" [level=2]
  - link "Demi Akarakiri Demi Akarakiri Attacking Midfielder":
    - /url: /teams/u18/ademideakakriki
    - img "Demi Akarakiri"
    - heading "Demi Akarakiri" [level=3]
  - link "Justin Clarke Justin Clarke":
    - /url: /teams/u18/justinclarke
    - img "Justin Clarke"
    - heading "Justin Clarke" [level=3]
  - link "Luis Gardner Luis Gardner":
    - /url: /teams/u18/luisgardner
    - img "Luis Gardner"
    - heading "Luis Gardner" [level=3]
  - link "Melvin Matos Melvin Matos":
    - /url: /teams/u18/melvinmatos
    - img "Melvin Matos"
    - heading "Melvin Matos" [level=3]
  - link "Amari Moses Amari Moses":
    - /url: /teams/u18/amarimoses
    - img "Amari Moses"
    - heading "Amari Moses" [level=3]
  - link "Freddie Murdock Freddie Murdock":
    - /url: /teams/u18/freddiemurdock
    - img "Freddie Murdock"
    - heading "Freddie Murdock" [level=3]
  - link "Malik Olayiwola Malik Olayiwola Midfielder":
    - /url: /teams/u18/malikolayiwola
    - img "Malik Olayiwola"
    - heading "Malik Olayiwola" [level=3]
  - heading "Forward" [level=2]
  - link "Braiden Graham Braiden Graham":
    - /url: /teams/u18/braidengraham
    - img "Braiden Graham"
    - heading "Braiden Graham" [level=3]
  - link "Ceiran Loney Ceiran Loney":
    - /url: /teams/u18/ceiranloney
    - img "Ceiran Loney"
    - heading "Ceiran Loney" [level=3]
  - link "Shea Pita Shea Pita Winger / Attacking Midfielder":
    - /url: /teams/u18/sheapita50
    - img "Shea Pita"
    - heading "Shea Pita" [level=3]
  - link "Ray Robert Ray Robert":
    - /url: /teams/u18/rayroberts
    - img "Ray Robert"
    - heading "Ray Robert" [level=3]
  - link "Charlie Stewart Charlie Stewart":
    - /url: /teams/u18/charliestewart
    - img "Charlie Stewart"
    - heading "Charlie Stewart" [level=3]
  - link "Kean Wren Kean Wren":
    - /url: /teams/u18/keanwren
    - img "Kean Wren"
    - heading "Kean Wren" [level=3]
  `);
});