const puppeteer = require("puppeteer");

let browser;
let page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto("localhost:5000");
});

afterEach(async () => {
   await browser.close();
});

test("header logo has correct text", async() => {
      	const text = await page.$eval("a.brand-logo", el => el.innerHTML);
	expect(text).toEqual("Blogster");
}, 70000);

test("clicking login starts oauth flow", async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
}, 70000);
