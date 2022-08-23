const puppeteer = require("puppeteer");
const Keygrip = require("keygrip");

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
}, 90000);

test("clicking login starts oauth flow", async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
}, 90000);

test("when signed in show logout button", async () => {
  // get userID and generate face session
  const user ="62ff77abc269b88fa053a2cd";
  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {passport: {user}};
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const keygrip = new Keygrip(["helloworld"]);
  const sig = keygrip.sign('session=' + sessionString);

  // setting session and signature on our page instance
  await page.setCookie({name: 'session', value: sessionString});
  await page.setCookie({name: 'session.sig', value: sig});
  await page.goto('localhost:5000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual("Logout");
 }, 100000);
