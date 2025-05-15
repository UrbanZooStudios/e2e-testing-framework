export interface SiteToTest {
  name: string;
  previewUrl: string;
  liveUrl: string;
  cookieSelector?: string; // optional
}

export const sitesToTest: SiteToTest[] = [
  {
    name: "Mansfield Town",
    previewUrl: "https://livepreview.mansfieldtown.net/",
    liveUrl: "https://www.mansfieldtown.net/",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Morecambe FC",
    previewUrl: "https://livepreview.morecambefc.com/",
    liveUrl: "https://www.morecambefc.com/",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Crewe Alexandra FC",
    previewUrl: "https://livepreview.crewealex.net",
    liveUrl: "https://www.crewealex.net",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Cheltenham Town FC",
    previewUrl: "https://livepreview.ctfc.com/",
    liveUrl: "https://www.ctfc.com/",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
  {
    name: "Wrexham AFC",
    previewUrl: "https://livepreview.wrexhamafc.co.uk",
    liveUrl: "https://www.wrexhamafc.co.uk/",
    cookieSelector: '#onetrust-accept-btn-handler',
  },
];
