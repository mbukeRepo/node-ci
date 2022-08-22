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

test("Testing Header Component of my app", async() => {
    const text = await page.$eval("a.brand-logo", el => el.innerHTML);

    expect(text).toEqual("Blogster");
}, 30000);
