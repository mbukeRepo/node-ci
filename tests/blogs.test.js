const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:5000');
});

afterEach(async () => {
  await page.close();
});


describe("when not logged in", async () => {
  test("cannot create a blog", async () => {
    const result = await page.evaluate(() => {
       return fetch("http://localhost:5000/api/blogs", 
	{  method: "POST", credentials: 'same-origin', 
	   headers: {"Content-Type": "application/json"
        }, body: JSON.stringify({title: "my", content: "my content"})})
      .then(res => res.json())
    });
    expect(result).toEqual({error: "You must log in!"});
  })
});

describe("when logged in", async () => {
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

  describe("and when using invalid inputs", async () => {
    beforeEach(async () => {
       await page.waitFor('form button');
       await page.click('form button');
    });
    test("the form shows error message", async () => {
      await page.waitFor('.title .red-text');
      const titleError = await page.getContent(".title .red-text");
      await page.waitFor('.content .red-text')
      const contentError = await page.getContent(".content .red-text");
      const msg = "You must provide a value";
      expect(titleError).toEqual(msg);
      expect(contentError).toEqual(msg);
    });
  });

  describe("and when using valid form inputs", async () => {
    beforeEach(async () => {
       await page.waitFor('.title input');
       await page.type(".title input", "Hello world");
       await page.waitFor('.content input');
       await page.type('.content input', "My content");
       await page.waitFor('form button');
       await page.click('form button');
    });
    test("submitting takes to review page", async () => {
      await page.waitFor('form h5');
      const text = await page.getContent("form h5");
      expect(text).toEqual('Please confirm your entries');
    });
    test("submitting then saving adds blog to index page", async () => {
      await page.waitFor('button.green');
      await page.click('button.green');
      await page.waitFor('.card');
      
      const title = await page.getContent(".card-title");
      const p = await page.getContent("p");
      expect(title).toEqual("Hello world");
      expect(p).toEqual("My content");
    });
  });
});
