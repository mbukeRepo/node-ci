const puppeteer = require("puppeteer");
const Keygrip = require("keygrip");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

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
        await page.waitFor('a.brand-logo');
	expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.waitFor('.right a')
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("when signed in show logout button", async () => {
  // get userID and generate face session
  const user = await userFactory();
  const {session, sig} = sessionFactory(user);
  // setting session and signature on our page instance
  await page.setCookie({name: 'session', value: session});
  await page.setCookie({name: 'session.sig', value: sig});
  await page.goto('localhost:5000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual("Logout");
 });
