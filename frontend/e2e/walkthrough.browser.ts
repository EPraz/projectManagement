import { expect, test } from "@playwright/test";
import { enterDemo } from "./support/demo";

test("public walkthrough opens without a session or an available backend", async ({
  page,
}) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/api/"))
      apiRequests.push(request.method());
  });
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/walkthrough");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "From planning to delivery.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Project Management product walkthrough", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Project sections", exact: true }),
  ).toHaveCount(0);
  expect(apiRequests).toEqual([]);
});

test("chapters seek real media and transcript/download alternatives are available", async ({
  page,
}) => {
  await page.goto("/walkthrough");
  const video = page.getByLabel("Project Management product walkthrough", {
    exact: true,
  });
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState))
    .toBeGreaterThan(0);
  expect(await video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(
    true,
  );
  await page
    .getByRole("button", { name: "1:16 Session B · no refresh", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(76);
  await video.evaluate((node: HTMLVideoElement) => node.play());
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(77);
  await video.evaluate((node: HTMLVideoElement) => node.pause());
  await expect(
    page.getByRole("heading", { name: "Transcript", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download MP4", exact: true }),
  ).toHaveAttribute("download", /.+/);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "English captions", exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(
    "project-management-walkthrough.vtt",
  );
});

test("failed media explains recovery and retry loads the real file", async ({
  page,
}) => {
  await page.route(
    "**/walkthrough/project-management-walkthrough.mp4",
    (route) => route.abort(),
  );
  await page.goto("/walkthrough");
  await expect(page.getByRole("alert")).toContainText("could not load");
  await expect(
    page.getByRole("link", { name: "Download MP4", exact: true }),
  ).toBeVisible();
  await page.unroute("**/walkthrough/project-management-walkthrough.mp4");
  await page.getByRole("button", { name: "Retry video", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .getByLabel("Project Management product walkthrough", { exact: true })
        .evaluate((node: HTMLVideoElement) => node.readyState),
    )
    .toBeGreaterThan(0);
});

test("watching preserves an existing demo session and ignores an expired cookie", async ({
  page,
  context,
  baseURL,
}) => {
  await enterDemo(page);
  const before = await context.cookies();
  expect(before.length).toBeGreaterThan(0);
  const requests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/api/"))
      requests.push(request.method());
  });
  await page.goto("/walkthrough");
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "Video chapters" }),
  ).toBeVisible();
  expect(await context.cookies()).toEqual(before);
  expect(requests).toEqual([]);
  await page.getByRole("link", { name: "Explore demo", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Projects.", exact: true }),
  ).toBeVisible();
  await context.clearCookies();
  await context.addCookies([
    {
      name: "refreshToken",
      value: "expired-fictional-token",
      url: baseURL!,
      httpOnly: true,
    },
  ]);
  requests.length = 0;
  await page.route("**/api/**", (route) => route.fulfill({ status: 401 }));
  await page.goto("/walkthrough");
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "Video chapters" }),
  ).toBeVisible();
  expect(requests).toEqual([]);
});

for (const width of [390, 1440]) {
  for (const mode of ["light", "dark"] as const) {
    test(`viewer reflows at ${width}px in ${mode} with keyboard chapters and native fullscreen`, async ({
      page,
    }) => {
      await page.addInitScript((initialMode) => {
        if (!localStorage.getItem("theme-mode"))
          localStorage.setItem("theme-mode", initialMode);
        localStorage.setItem("theme-system-preference", "false");
      }, mode);
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/walkthrough");
      const chapter = page.getByRole("button", {
        name: "0:32 Plan the selected sprint",
        exact: true,
      });
      await chapter.focus();
      await page.keyboard.press("Enter");
      const video = page.getByLabel("Project Management product walkthrough", {
        exact: true,
      });
      await expect(video).toBeFocused();
      await expect
        .poll(() =>
          video.evaluate((node: HTMLVideoElement) => node.currentTime),
        )
        .toBeGreaterThan(32);
      expect(
        await video.evaluate(
          (node: HTMLVideoElement) =>
            node.controls && node.playsInline && node.paused,
        ),
      ).toBe(true);
      await video.evaluate((node: HTMLVideoElement) =>
        node.requestFullscreen(),
      );
      await expect
        .poll(() =>
          video.evaluate((node) => document.fullscreenElement === node),
        )
        .toBe(true);
      await page.evaluate(() => document.exitFullscreen());
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole("button", {
          name:
            mode === "light" ? "Switch to dark theme" : "Switch to light theme",
          exact: true,
        })
        .click();
      await page.reload();
      await expect(
        page.getByRole("button", {
          name:
            mode === "light" ? "Switch to light theme" : "Switch to dark theme",
          exact: true,
        }),
      ).toBeVisible();
    });
  }
}

test("static media supports byte-range seeking and caption/transcript downloads", async ({
  request,
}) => {
  const response = await request.get(
    "/walkthrough/project-management-walkthrough.mp4",
    { headers: { Range: "bytes=0-1023" } },
  );
  expect(response.status()).toBe(206);
  expect(response.headers()["content-type"]).toContain("video/mp4");
  expect(response.headers()["content-range"]).toMatch(/^bytes 0-1023\/\d+$/);
  expect((await response.body()).length).toBe(1024);
  const captions = await request.get(
    "/walkthrough/project-management-walkthrough.vtt",
  );
  expect(captions.ok()).toBe(true);
  expect(captions.headers()["content-type"]).toContain("text/vtt");
  expect(await captions.text()).toContain("WEBVTT");
  expect(await captions.text()).toContain(
    "independent browser session over WebSockets",
  );
  const transcript = await request.get("/walkthrough/transcript.md");
  expect(transcript.ok()).toBe(true);
  expect(await transcript.text()).toContain("Session B");
  expect(
    (await request.get("/walkthrough/poster.jpg")).headers()["content-type"],
  ).toContain("image/jpeg");
});
