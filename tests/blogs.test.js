const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:5000');
});

afterEach(async () => {
  await page.close();
});


describe("when not logged in", () => {

});

describe("when logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.waitFor('a.btn-floating');
    await page.click('a.btn-floating');
  });
  test("can see blog create form", async () => {
    await page.waitFor('form label');
    const label = await page.getContent("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("and when using invalid inputs", () => {
    beforeEach(async () => {
       await page.click('form button');
    });
    test("the form shows error message", async () => {
      const titleError = await page.getContent(".title .red-text");
      const contentError = await page.getContent(".content .red-text");
      const msg = "You must provide a value";
      expect(titleError).toEqual(msg);
      expect(contentError).toEqual(msg);
    });
  });

  describe("and when using valid form inputs", () => {});
});
