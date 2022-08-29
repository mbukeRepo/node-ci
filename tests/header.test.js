const Keygrip = require("keygrip");
const Page = require("./helpers/page");

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto("http://localhost:5000");
});

afterEach(async () => {
   await page.close();
});

test("header logo has correct text", async() => {
        await page.waitFor('a.brand-logo');
      	const text = await page.getContent("a.brand-logo");
	expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.waitFor('.right a')
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
}, 90000);

test("when signed in show logout button", async () => {
  await page.login();
  const text = await page.getContent('a[href="/auth/logout"]');
  expect(text).toEqual("Logout");
 }, 90000);
