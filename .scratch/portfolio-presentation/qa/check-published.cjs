// Read-only public delivery proof. Never seeds, resets or edits demo content.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const {
  chromium,
  expect,
} = require("../../../frontend/node_modules/@playwright/test");
const root = path.resolve(__dirname, "../../..");
const origin = new URL(
  process.argv[2] || "https://project-management-murex-pi.vercel.app",
);
assert.ok(
  !origin.username &&
    !origin.password &&
    (origin.protocol === "https:" ||
      (origin.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(origin.hostname))),
  "Select an HTTPS deployment or a loopback preview.",
);
const media = JSON.parse(
  fs.readFileSync(
    path.join(root, "frontend/src/pages/walkthrough/walkthrough.json"),
  ),
);
const expected = JSON.parse(
  fs.readFileSync(
    path.join(root, ".scratch/portfolio-presentation/evidence/05-video.json"),
  ),
);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function get(asset, options = {}) {
  return fetch(new URL(asset, origin), {
    ...options,
    signal: AbortSignal.timeout(45000),
  });
}
async function main() {
  const response = await get(media.video);
  assert.equal(response.status, 200, "MP4 request failed");
  assert.match(
    response.headers.get("content-type") || "",
    /video\/mp4/,
    "MP4 must not receive the SPA fallback",
  );
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(
    sha256(bytes),
    expected.sha256,
    "Published MP4 differs from the owner-reviewed export",
  );
  const ranged = await get(media.video, { headers: { Range: "bytes=0-1023" } });
  assert.equal(
    ranged.status,
    206,
    "Native seeking requires actual byte-range delivery",
  );
  assert.equal(
    ranged.headers.get("content-range"),
    `bytes 0-1023/${bytes.length}`,
  );
  assert.ok(
    Buffer.from(await ranged.arrayBuffer()).equals(bytes.subarray(0, 1024)),
  );
  const captions = await get(media.captions);
  assert.equal(captions.status, 200);
  assert.match(captions.headers.get("content-type") || "", /text\/vtt/);
  assert.equal(
    await captions.text(),
    fs.readFileSync(path.join(root, "frontend/public", media.captions), "utf8"),
  );
  const poster = await get(media.poster);
  assert.equal(poster.status, 200);
  assert.match(poster.headers.get("content-type") || "", /image\/jpeg/);
  assert.equal(
    sha256(Buffer.from(await poster.arrayBuffer())),
    sha256(fs.readFileSync(path.join(root, "frontend/public", media.poster))),
  );
  const transcript = await get("/walkthrough/transcript.md");
  assert.equal(transcript.status, 200);
  assert.equal(
    await transcript.text(),
    fs.readFileSync(
      path.join(root, "frontend/public/walkthrough/transcript.md"),
      "utf8",
    ),
  );
  console.log(
    "Published media: exact reviewed hash, poster/captions/transcript and206 byte ranges passed.",
  );
  const browser = await chromium.launch({ channel: "chrome" });
  const layouts = [];
  try {
    for (const width of [390, 1440])
      for (const theme of ["light", "dark"]) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          acceptDownloads: true,
        });
        try {
          await context.addInitScript(
            (mode) => localStorage.setItem("theme-mode", mode),
            theme,
          );
          await context.addCookies([
            {
              name: "jwt",
              value: "expired-untrusted-demo-cookie",
              url: origin.origin,
              httpOnly: true,
            },
          ]);
          const page = await context.newPage();
          const errors = [],
            api = [];
          page.on("pageerror", (error) => errors.push(error.message));
          page.on("request", (request) => {
            const url = new URL(request.url());
            if (
              url.pathname.startsWith("/api/") ||
              url.pathname.startsWith("/socket.io/")
            )
              api.push(url.pathname);
          });
          await page.route("**/api/**", (route) => route.abort());
          await page.route("**/socket.io/**", (route) => route.abort());
          await page.goto(new URL("/walkthrough", origin).href);
          await page.reload();
          await expect(
            page.getByRole("heading", {
              level: 1,
              name: "From planning to delivery.",
              exact: true,
            }),
          ).toBeVisible();
          const video = page.getByLabel(
            "Project Management product walkthrough",
            { exact: true },
          );
          await expect
            .poll(() => video.evaluate((node) => node.readyState), {
              timeout: 20000,
            })
            .toBeGreaterThan(0);
          assert.ok(
            await video.evaluate(
              (node) => node.paused && node.controls && node.playsInline,
            ),
          );
          assert.ok(
            Math.abs(
              (await video.evaluate((node) => node.duration)) -
                expected.duration,
            ) < 0.1,
          );
          await page
            .getByRole("button", {
              name: "1:16 Session B · no refresh",
              exact: true,
            })
            .click();
          await expect
            .poll(() => video.evaluate((node) => node.currentTime))
            .toBeGreaterThan(76);
          await video.evaluate((node) => node.play());
          await expect
            .poll(() => video.evaluate((node) => node.currentTime), {
              timeout: 15000,
            })
            .toBeGreaterThan(77);
          await video.evaluate((node) => node.pause());
          await video.evaluate((node) => node.requestFullscreen());
          assert.ok(
            await video.evaluate((node) => document.fullscreenElement === node),
          );
          await page.evaluate(() => document.exitFullscreen());
          await expect(
            page.getByRole("heading", { name: "Transcript", exact: true }),
          ).toBeVisible();
          for (const [name, filename] of [
            ["Download MP4", "project-management-walkthrough.mp4"],
            ["English captions", "project-management-walkthrough.vtt"],
            ["Download transcript", "project-management-transcript.md"],
          ]) {
            const [download] = await Promise.all([
              page.waitForEvent("download"),
              page.getByRole("link", { name, exact: true }).click(),
            ]);
            assert.equal(download.suggestedFilename(), filename);
            assert.equal(await download.failure(), null);
          }
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          assert.equal(
            api.length,
            0,
            "Viewer must remain independent of the API/session",
          );
          assert.equal(errors.length, 0, "Browser exception in public viewer");
          layouts.push({
            width,
            theme,
            playback: true,
            seek: true,
            fullscreen: true,
            downloads: 3,
            apiRequests: 0,
            horizontalOverflow: false,
          });
        } finally {
          await context.close();
        }
      }
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(new URL("/auth/instantLogin", origin).href);
      await page
        .getByRole("button", { name: "Explore demo", exact: true })
        .click({ timeout: 90000 });
      await expect(
        page.getByRole("heading", { name: "Projects.", exact: true }),
      ).toBeVisible({ timeout: 90000 });
      const before = await context.cookies();
      assert.ok(before.some((cookie) => cookie.name === "jwt"));
      await page.goto(new URL("/walkthrough", origin).href);
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "From planning to delivery.",
          exact: true,
        }),
      ).toBeVisible();
      assert.ok(
        JSON.stringify(await context.cookies()) === JSON.stringify(before),
        "Opening viewer changed an existing demo cookie",
      );
      await page
        .getByRole("link", { name: "Explore demo", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Projects.", exact: true }),
      ).toBeVisible({ timeout: 90000 });
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
  const result = {
    date: new Date().toISOString(),
    origin: origin.origin,
    mp4: {
      sha256: expected.sha256,
      bytes: bytes.length,
      seconds: expected.duration,
      contentType: response.headers.get("content-type"),
      rangeStatus: 206,
    },
    captions: "exact file and text/vtt",
    poster: "exact reviewed JPEG",
    transcript: "exact file",
    layouts,
    existingSession: "cookie preserved; return to demo works",
    contentMutations: 0,
  };
  fs.writeFileSync(
    path.join(
      root,
      ".scratch/portfolio-presentation/evidence/06-public-delivery.json",
    ),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    "Public browser viewing, four layouts, real downloads and existing-session return passed.",
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
