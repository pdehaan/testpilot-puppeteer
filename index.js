// npm i puppeteer pdehaan/pontoonql -S
const puppeteer = require("puppeteer");
const pontoonql = require("pontoonql");

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
