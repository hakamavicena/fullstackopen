async function createBlog(page, title, author, url) {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByPlaceholder("write title here").fill(title);
  await page.getByPlaceholder("write author here").fill(author);
  await page.getByPlaceholder("write url here").fill(url);
  await page.getByRole("button", { name: "save" }).click();
  await page.getByText(`${title} ${author}`).first().waitFor();
}

module.exports = {createBlog}