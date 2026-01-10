const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper"); 

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Hakam Test",
        username: "hakam_test",
        password: "password123",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("hakam_test"); // input pertama biasanya username
      await page.getByRole("textbox").last().fill("password123"); // input kedua password
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Hakam Test logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("hakam_test");
      await page.getByRole("textbox").last().fill("wrongpassword");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".error"); 
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toContainText("wrong credentials");

      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("Hakam Test logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("textbox").first().fill("hakam_test");
      await page.getByRole("textbox").last().fill("password123");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();

      await page
        .getByPlaceholder("write title here")
        .fill("Playwright Testing");
      await page.getByPlaceholder("write author here").fill("Hakam");
      await page
        .getByPlaceholder("write url here")
        .fill("http://playwright.dev");

      await page.getByRole("button", { name: "save" }).click();

      const blogList = page.locator(".blog"); 
      await expect(page.getByText("Playwright Testing Hakam")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "Blog to Like", "User A", "http://a.com");

      const blogElement = page.getByText("Blog to Like").locator("..");
      await blogElement.getByRole("button", { name: "view" }).click();

      await expect(blogElement.getByText("likes 0")).toBeVisible();
      await blogElement.getByRole("button", { name: "like" }).click();

      await expect(blogElement.getByText("likes 1")).toBeVisible();
    });
    
    test("user who created a blog can delete it", async ({ page }) => {
      await createBlog(page, "Blog to Delete", "User A", "http://delete.com");

      const blogElement = page
        .locator(".blog")
        .filter({ hasText: "Blog to Delete" })
        .first();

      await blogElement.getByRole("button", { name: "view" }).click();

      page.on("dialog", (dialog) => dialog.accept());

      await blogElement.getByRole("button", { name: "delete" }).click();

      await expect(blogElement).not.toBeVisible();
    });

    test("only the creator can see the delete button", async ({
      page,
      request,
    }) => {
      await createBlog(page, "Hakam Blog", "Hakam", "http://hakam.com");

      await page.getByRole("button", { name: "Logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Other User",
          username: "other_user",
          password: "password123",
        },
      });

      await page.getByRole("textbox").first().fill("other_user");
      await page.getByRole("textbox").last().fill("password123");
      await page.getByRole("button", { name: "login" }).click();

      const blogElement = page.getByText("Hakam Blog").locator("..");
      await blogElement.getByRole("button", { name: "view" }).click();

      await expect(
        blogElement.getByRole("button", { name: "delete" })
      ).not.toBeVisible();
    });

    test("blogs are ordered by likes", async ({ page }) => {
      await createBlog(page, "Blog A", "Author", "url");
      await createBlog(page, "Blog B", "Author", "url");
      await createBlog(page, "Blog C", "Author", "url");



      const blogB = page.locator(".blog").filter({ hasText: "Blog B" }).first();
      await blogB.getByRole("button", { name: "view" }).click();
      await blogB.getByRole("button", { name: "like" }).click();
      await expect(blogB.getByText("likes 1")).toBeVisible();
      await blogB.getByRole("button", { name: "like" }).click();
      await expect(blogB.getByText("likes 2")).toBeVisible();

      const blogC = page.getByText("Blog C").first().locator("..");
      await blogC.getByRole("button", { name: "view" }).click();
      await blogC.getByRole("button", { name: "like" }).click();
      await expect(blogC.getByText("likes 1")).toBeVisible();

    
      const blogs = page.locator(".blog");

      await expect(blogs.nth(0)).toContainText("Blog B");

      await expect(blogs.nth(1)).toContainText("Blog C");

      await expect(blogs.nth(2)).toContainText("Blog A");
    });
  });
});


