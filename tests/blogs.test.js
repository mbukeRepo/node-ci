const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:5000');
});

afterEach(async () => {
  await page.close();
});

test("when logged in, can see blog create form", async () => {
    await page.login();
    await page.waitFor('a.btn-floating');
    await page.click('a.btn-floating');
    await page.waitFor('form label');
    const label = await page.getContent("form label");
    expect(label).toEqual("Blog Title");
});
