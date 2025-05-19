export interface SiteToTest {
  name: string;
  previewUrl: string;
  liveUrl: string;
  cookieSelector?: string;
  previewNewsUrl?: string;
  liveNewsUrl?: string;
  previewMatchesUrl?: string;
  liveMatchesUrl?: string;
  previewTeamsUrl?: string;
  liveTeamsUrl?: string;
}

export const sitesToTest: SiteToTest[] = [
  {
    name: "Mansfield Town",
    previewUrl: "https://livepreview.mansfieldtown.net/",
    liveUrl: "https://www.mansfieldtown.net/",
    previewNewsUrl: "https://livepreview.mansfieldtown.net/news",
    liveNewsUrl: "https://www.mansfieldtown.net/news",
    previewMatchesUrl: "https://livepreview.mansfieldtown.net/matches",
    liveMatchesUrl: "https://www.mansfieldtown.net/matches",
    previewTeamsUrl: "https://livepreview.mansfieldtown.net/teams",
    liveTeamsUrl: "https://www.mansfieldtown.net/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Morecambe FC",
    previewUrl: "https://livepreview.morecambefc.com/",
    liveUrl: "https://www.morecambefc.com/",
    previewNewsUrl: "https://livepreview.morecambefc.com/news",
    liveNewsUrl: "https://www.morecambefc.com/news",
    previewMatchesUrl: "https://livepreview.morecambefc.com/matches",
    liveMatchesUrl: "https://www.morecambefc.com/matches",
    previewTeamsUrl: "https://livepreview.morecambefc.com/teams",
    liveTeamsUrl: "https://www.morecambefc.com/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Crewe Alexandra FC",
    previewUrl: "https://livepreview.crewealex.net",
    liveUrl: "https://www.crewealex.net",
    previewNewsUrl: "https://livepreview.crewealex.net/news",
    liveNewsUrl: "https://www.crewealex.net/news",
    previewMatchesUrl: "https://livepreview.crewealex.net/matches",
    liveMatchesUrl: "https://www.crewealex.net/matches",
    previewTeamsUrl: "https://livepreview.crewealex.net/teams",
    liveTeamsUrl: "https://www.crewealex.net/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Cheltenham Town FC",
    previewUrl: "https://livepreview.ctfc.com/",
    liveUrl: "https://www.ctfc.com/",
    previewNewsUrl: "https://livepreview.ctfc.com/news",
    liveNewsUrl: "https://www.ctfc.com/news",
    previewMatchesUrl: "https://livepreview.ctfc.com/matches",
    liveMatchesUrl: "https://www.ctfc.com/matches",
    previewTeamsUrl: "https://livepreview.ctfc.com/teams",
    liveTeamsUrl: "https://www.ctfc.com/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Wrexham AFC",
    previewUrl: "https://livepreview.wrexhamafc.co.uk",
    liveUrl: "https://www.wrexhamafc.co.uk/",
    previewNewsUrl: "https://livepreview.wrexhamafc.co.uk/news",
    liveNewsUrl: "https://www.wrexhamafc.co.uk/news",
    previewMatchesUrl: "https://livepreview.wrexhamafc.co.uk/matches",
    liveMatchesUrl: "https://www.wrexhamafc.co.uk/matches",
    previewTeamsUrl: "https://livepreview.wrexhamafc.co.uk/teams",
    liveTeamsUrl: "https://www.wrexhamafc.co.uk/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Preston North End",
    previewUrl: "https://livepreview.pnefc.net/",
    liveUrl: "https://www.pnefc.net/",
    previewNewsUrl: "https://livepreview.pnefc.net/news",
    liveNewsUrl: "https://www.pnefc.net/news",
    previewMatchesUrl: "https://livepreview.pnefc.net/matches",
    liveMatchesUrl: "https://www.pnefc.net/matches",
    previewTeamsUrl: "https://livepreview.pnefc.net/teams",
    liveTeamsUrl: "https://www.pnefc.net/teams",
    cookieSelector: '#onetrust-accept-btn-handler',
  },

];
