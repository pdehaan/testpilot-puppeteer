// npm i puppeteer pdehaan/pontoonql -S
const puppeteer = require("puppeteer");
const pontoonql = require("pontoonql");

// These were taken from https://github.com/mozilla/testpilot/blob/9c663ab451c4d89de013fd1aaaa5a78f0ae2c438/src/index.html#L6-L7
// But are currently unused since I'm using pontoonql to query the Pontoon directly for locales with 95%+ translations.
// But also, 95% is arbitrary since there are lots of strings and the 5% missing could be the entirety of the EOL site.
const availableLocales = "cs,cy,de,dsb,el,en-CA,en-US,es-AR,es-ES,fr,fy-NL,hsb,hu,it,nl,pt-PT,ru,sk,sl,sv-SE,tr,zh-CN,zh-TW".split(
  ","
);

async function main(locales) {
  if (!locales) {
    const res = await pontoonql("test-pilot-website", 95);
    locales = res.map(({ locale }) => locale.code).sort();
  }

  for (const locale of locales) {
    const browser = await puppeteer.launch({
      headless: true,
      // https://stackoverflow.com/questions/46908636/how-to-specify-browser-language-in-puppeteer
      args: [`--lang=${locale}`]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1024 });
    await page.setExtraHTTPHeaders({
      "Accept-Language": locale
    });
    await page.goto("https://testpilot.firefox.com/", {
      waitUtil: "networkidle2"
    });
    await page.screenshot({ path: `./shots/testpilot-${locale}.png` });
    await browser.close();
  }
}

main();
