// Real local product capture; presentation annotations adapted from the owner's Aster workflow.
const {
  chromium,
  expect,
  request,
} = require("../../../frontend/node_modules/@playwright/test");
const fs = require("node:fs"),
  path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "../../..");
const recording = path.join(root, ".scratch/portfolio-presentation/recording");
const runtime = JSON.parse(
  fs.readFileSync(path.join(recording, "runtime.json"), "utf8"),
);
for (const origin of [runtime.ui, runtime.api]) {
  const url = new URL(origin);
  if (
    url.protocol !== "http:" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    url.username ||
    url.password
  )
    throw Error("Capture requires an owned loopback origin.");
}
if (!runtime.databaseName.endsWith("_presentation") || !runtime.production)
  throw Error(
    "Capture requires an explicit presentation database and production build.",
  );
const taskboardOnly = process.argv.includes("--taskboard-only");
const rehearsal = process.argv.includes("--rehearsal"),
  speed = rehearsal ? 0.03 : 1;
const output = path.join(
  recording,
  rehearsal
    ? taskboardOnly
      ? "rehearsal-taskboard"
      : "rehearsal"
    : `${taskboardOnly ? "taskboard-retake" : "take"}-${Date.now()}`,
);
fs.mkdirSync(output, { recursive: true });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms * speed));
const scenes = [],
  errors = [],
  sources = {};
const evidence = {
  origin: runtime.ui,
  applicationCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim(),
  rehearsal,
  checks: { database: runtime.databaseName, loopback: true },
  scenes,
  sources,
};
function installPointer() {
  addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = `*{cursor:none!important} #capture-pointer{position:fixed;left:0;top:0;width:28px;height:32px;z-index:2147483647;pointer-events:none;transform:translate(1250px,70px);filter:drop-shadow(0 2px 3px #0005)} #capture-pulse{position:fixed;left:0;top:0;width:42px;height:42px;margin:-21px;border:3px solid #91b8ff;border-radius:50%;pointer-events:none;z-index:2147483646;opacity:0} #capture-highlight{position:fixed;border:3px solid #91b8ff;border-radius:9px;box-shadow:0 0 0 4px #91b8ff25;pointer-events:none;z-index:2147483645;display:none} @keyframes capture-click{0%{opacity:.9;scale:.55}100%{opacity:0;scale:1.5}}`;
    document.head.append(style);
    const pointer = document.createElement("div");
    pointer.id = "capture-pointer";
    pointer.innerHTML = `<svg width="28" height="32" viewBox="0 0 28 32"><path d="M3 2v24l6-6 5 10 5-3-5-9h9Z" fill="#fff" stroke="#152230" stroke-width="2" stroke-linejoin="round"/></svg>`;
    const pulse = document.createElement("div");
    pulse.id = "capture-pulse";
    const highlight = document.createElement("div");
    highlight.id = "capture-highlight";
    document.body.append(pointer, pulse, highlight);
    // Native dialogs occupy the browser's top layer, above every body z-index.
    // Keep the capture annotations in that layer while a dialog is open.
    const attach = () => {
      const target =
        [...document.querySelectorAll("dialog[open]")].at(-1) ?? document.body;
      for (const element of [pointer, pulse, highlight]) {
        if (element.parentElement !== target) target.append(element);
      }
    };
    new MutationObserver(attach).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    let point = { x: 1250, y: 70 };
    addEventListener(
      "pointermove",
      (event) => {
        point = { x: event.clientX, y: event.clientY };
        pointer.style.transform = `translate(${point.x}px,${point.y}px)`;
      },
      true,
    );
    function click() {
      pulse.style.left = `${point.x}px`;
      pulse.style.top = `${point.y}px`;
      pulse.style.setProperty("animation", "none", "important");
      void pulse.offsetWidth;
      pulse.style.setProperty(
        "animation",
        "capture-click .45s ease-out forwards",
        "important",
      );
    }
    addEventListener("pointerdown", click, true);
    window.captureAnnotations = {
      click,
      sync() {
        const marker = document.createElement("div");
        Object.assign(marker.style, {
          position: "fixed",
          left: "0",
          top: "0",
          width: "8px",
          height: "8px",
          background: "rgb(0,0,255)",
          zIndex: "2147483647",
          pointerEvents: "none",
        });
        document.body.append(marker);
        setTimeout(() => marker.remove(), 200);
      },
      highlight(rect, duration) {
        Object.assign(highlight.style, {
          display: "block",
          left: `${rect.x - 5}px`,
          top: `${rect.y - 5}px`,
          width: `${rect.width + 10}px`,
          height: `${rect.height + 10}px`,
        });
        setTimeout(() => {
          highlight.style.display = "none";
        }, duration);
      },
    };
  });
}

async function controls(page) {
  let pointer = { x: 1250, y: 70 };
  const viewport = page.viewportSize();
  if (viewport.width < 500) pointer = { x: 240, y: 60 };
  async function reveal(locator) {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    if (box.y < 20 || box.y + box.height > viewport.height - 30) {
      await locator.evaluate(
        (element, smooth) =>
          element.scrollIntoView({
            behavior: smooth ? "smooth" : "instant",
            block: "center",
          }),
        !rehearsal,
      );
      await pause(650);
    }
  }
  async function move(locator) {
    await reveal(locator);
    const box = await locator.boundingBox();
    const target = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const from = { ...pointer };
    const frames = rehearsal ? 1 : 24;
    for (let frame = 1; frame <= frames; frame++) {
      const ratio = frame / frames;
      const eased = ratio * ratio * (3 - 2 * ratio);
      await page.mouse.move(
        from.x + (target.x - from.x) * eased,
        from.y + (target.y - from.y) * eased,
      );
      if (!rehearsal) await pause(12);
    }
    pointer = target;
  }
  async function click(locator) {
    await move(locator);
    await pause(180);
    await locator.click();
    await pause(300);
  }
  async function type(locator, text) {
    await click(locator);
    await locator.press("Control+A");
    await locator.pressSequentially(text, { delay: rehearsal ? 0 : 38 });
    await pause(250);
  }
  async function select(locator, value) {
    await move(locator);
    await locator.focus();
    await page.evaluate(() => window.captureAnnotations.click());
    await locator.selectOption(value);
    await pause(550);
  }
  async function highlight(locator, duration = 1800) {
    await reveal(locator);
    await page.evaluate(
      ({ rect, duration }) =>
        window.captureAnnotations.highlight(rect, duration),
      { rect: await locator.boundingBox(), duration: duration * speed },
    );
    await pause(duration);
  }
  async function nav(name) {
    const menu = page.getByRole("button", {
      name: "Open project navigation",
      exact: true,
    });
    if (await menu.isVisible()) await click(menu);
    await click(page.getByRole("button", { name, exact: true }));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await pause(450);
  }
  return { click, type, select, highlight, nav, reveal };
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome" });
  const contexts = [];
  const wallStart = performance.now();
  const now = () => (performance.now() - wallStart) / 1000;
  let api;
  try {
    api = await request.newContext({ baseURL: runtime.ui });
    const login = await api.post("/api/auth/instant-login", { data: {} });
    expect(login.ok()).toBe(true);
    const { accessToken } = await login.json();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const list = await (await api.get("/api/projects", { headers })).json();
    const project = list.find((p) => p.title === "Orbit — Product Delivery");
    expect(project).toBeTruthy();
    const full = await (
      await api.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const sprint = full.sprints.find((s) => s.name === "Sprint 2 — Delivery");
    expect(sprint).toBeTruthy();
    const ticket = full.tickets.find(
      (t) =>
        t.title === "Build the sprint overview" && t.sprintId === sprint.id,
    );
    expect(ticket).toBeTruthy();
    const task = ticket.tasks[0];
    expect(task).toBeTruthy();
    const ticketFrom = full.ticketStatuses.find(
      (s) => s.name === "IN_PROGRESS",
    );
    const ticketTo = full.ticketStatuses.find((s) => s.name === "CODE_REVIEW");
    const taskFrom = full.taskStatuses.find((s) => s.name === "TODO");
    const taskTo = full.taskStatuses.find((s) => s.name === "IN_PROGRESS");
    expect([ticketFrom, ticketTo, taskFrom, taskTo].every(Boolean)).toBe(true);
    // Only these two fictional local fields are staged; no reset or public mutation.
    expect(
      (
        await api.patch(`/api/tickets/${ticket.id}`, {
          headers,
          data: {
            id: ticket.id,
            statusId: ticketFrom.id,
            updatedBy: "visitor@demo.example",
          },
        })
      ).ok(),
    ).toBe(true);
    expect(
      (
        await api.patch(`/api/tasks/${task.id}`, {
          headers,
          data: {
            id: task.id,
            statusId: taskFrom.id,
            updatedBy: "visitor@demo.example",
          },
        })
      ).ok(),
    ).toBe(true);
    evidence.checks.work = {
      project: project.title,
      sprint: sprint.name,
      ticket: ticket.title,
      task: task.title,
      ticketId: ticket.id,
      taskId: task.id,
    };
    async function context(name, width = 1600, height = 840) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
        colorScheme: "light",
        ...(rehearsal
          ? {}
          : {
              recordVideo: {
                dir: path.join(output, "raw"),
                size: { width, height },
              },
            }),
      });
      contexts.push(ctx);
      await ctx.addInitScript(installPointer);
      const page = await ctx.newPage();
      page.setDefaultTimeout(12000);
      page.on("pageerror", (error) => errors.push(error.message));
      sources[name] = { width, height, page, context: ctx };
      return page;
    }
    async function sync(name) {
      const page = sources[name].page;
      await page.evaluate(() => document.fonts.ready);
      const before = now();
      await page.evaluate(() => window.captureAnnotations.sync());
      sources[name].syncWallTime = (before + now()) / 2;
      await pause(700);
    }
    async function enter(page) {
      await page.goto(runtime.ui + "/auth/instantLogin");
      await page
        .getByRole("button", { name: "Explore demo", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Projects.", exact: true }),
      ).toBeVisible();
    }
    async function workspace(page, section = "board?tab=board") {
      await page.goto(`${runtime.ui}/projects/${project.id}/${section}`);
      await expect(
        page.getByRole("combobox", { name: "Selected sprint", exact: true }),
      ).toBeVisible();
      const selector = page.getByRole("combobox", {
        name: "Selected sprint",
        exact: true,
      });
      if (!(await selector.innerText()).includes(sprint.name)) {
        await selector.click();
        await page
          .getByRole("option", { name: sprint.name, exact: true })
          .click();
      }
    }
    async function shot(page, name) {
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() =>
        document
          .querySelectorAll('[id^="capture-"]')
          .forEach((e) => (e.style.visibility = "hidden")),
      );
      await page.screenshot({
        path: path.join(output, name + ".png"),
        animations: "disabled",
      });
      await page.evaluate(() =>
        document
          .querySelectorAll('[id^="capture-"]')
          .forEach((e) => (e.style.visibility = "")),
      );
    }
    async function scene(id, title, seconds, captions, action, options = {}) {
      const start = now();
      console.log("Scene " + id);
      await pause(450);
      await action();
      const remaining = seconds * speed - (now() - start);
      if (remaining > 0)
        await new Promise((resolve) => setTimeout(resolve, remaining * 1000));
      const result = {
        id,
        title,
        start,
        rawSeconds: now() - start,
        seconds,
        captions,
        source: "desktop",
        ...options,
      };
      scenes.push(result);
      return result;
    }
    const observer = await context("observer");
    const socketEvents = [];
    let connected = false,
      observerNavigations = 0;
    observer.on("websocket", (socket) =>
      socket.on("framereceived", (frame) => {
        const payload = String(frame.payload);
        if (payload.startsWith("40")) connected = true;
        if (payload.startsWith("42")) {
          try {
            const [event, data] = JSON.parse(payload.slice(2));
            if (event === "ticketUpdated" && data.id === ticket.id)
              socketEvents.push({
                event,
                ticketId: data.id,
                statusId: data.statusId,
                taskStatusId: data.tasks.find((t) => t.id === task.id)
                  ?.statusId,
                at: now(),
              });
          } catch {}
        }
      }),
    );
    await enter(observer);
    await workspace(observer);
    await observer
      .getByRole("textbox", { name: "Search work", exact: true })
      .fill(ticket.title);
    await expect.poll(() => connected).toBe(true);
    const state = (page) =>
      page.getByRole("combobox", {
        name: `Ticket state #${ticket.id}`,
        exact: true,
      });
    await expect(state(observer)).toHaveText("In Progress");
    await sync("observer");
    observer.on("framenavigated", (frame) => {
      if (frame === observer.mainFrame()) observerNavigations++;
    });
    const page = await context("desktop"),
      c = await controls(page);
    if (taskboardOnly) {
      await enter(page);
      await workspace(page, "board?tab=backlog");
      await sync("desktop");
    } else {
      await page.goto(runtime.ui + "/auth/instantLogin");
      await sync("desktop");
      await scene(
        "entry",
        "01 / A workspace for delivery",
        14,
        [
          "An original full-stack project for planning, tracking and reviewing team delivery.",
          "Explore populated fictional projects without creating a personal account.",
        ],
        async () => {
          await pause(1000);
          await c.click(
            page.getByRole("button", { name: "Explore demo", exact: true }),
          );
          await expect(
            page.getByRole("heading", { name: "Projects.", exact: true }),
          ).toBeVisible();
          await pause(1800);
          await c.click(
            page.getByRole("link", { name: project.title, exact: true }),
          );
          await expect(
            page.getByRole("combobox", {
              name: "Selected sprint",
              exact: true,
            }),
          ).toBeVisible();
        },
      );
      await scene(
        "overview",
        "02 / Project context, sprint focus",
        8,
        [
          "Project progress covers the whole project. Sprint metrics follow the selected sprint.",
        ],
        async () => {
          await c.highlight(
            page.getByRole("combobox", {
              name: "Selected sprint",
              exact: true,
            }),
            1600,
          );
          await shot(page, "overview-light");
        },
      );
      await scene(
        "hierarchy",
        "03 / Connect the bigger picture",
        10,
        [
          "Epics and features link project goals to concrete tickets across sprints.",
        ],
        async () => {
          await c.nav("Epics & Features");
          await c.click(page.getByRole("button", { name: /^Expand / }).first());
          await pause(2200);
        },
      );
      await scene(
        "backlog",
        "04 / Plan the selected sprint",
        8,
        [
          "The Backlog keeps sprint work searchable, with ticket-level filters and configurable columns.",
        ],
        async () => {
          await c.nav("Backlog");
          await c.type(
            page.getByRole("textbox", { name: "Search work", exact: true }),
            ticket.title,
          );
          await expect(
            page.getByRole("button", { name: ticket.title, exact: true }),
          ).toBeVisible();
        },
      );
      await scene(
        "details",
        "05 / Requirements, estimates and child tasks",
        20,
        [
          "Inspect the ticket requirements, ownership and planning details.",
          "Story points, time estimates and child tasks stay connected to the same work item.",
        ],
        async () => {
          await c.click(
            page.getByRole("button", { name: ticket.title, exact: true }),
          );
          const editor = page.getByRole("dialog", {
            name: "Ticket Details",
            exact: true,
          });
          await expect(editor).toBeVisible();
          await pause(2200);
          await c.click(
            editor.getByRole("tab", { name: "Planning", exact: true }),
          );
          await pause(2000);
          await c.click(
            editor.getByRole("tab", { name: "Tasks", exact: true }),
          );
          await pause(1800);
          await c.click(
            editor.getByRole("button", {
              name: "Close ticket editor",
              exact: true,
            }),
          );
        },
      );
    }
    await scene(
      "taskboard",
      "06 / Tickets in rows. Tasks by state.",
      8,
      [
        "Each row is a ticket. Columns represent the independent states of its tasks.",
      ],
      async () => {
        await c.nav("Taskboard");
        await page
          .getByRole("button", { name: "Clear filters", exact: true })
          .click();
        await shot(page, "taskboard-light");
        await c.type(
          page.getByRole("textbox", { name: "Search work", exact: true }),
          ticket.title,
        );
        await expect(state(page)).toHaveText("In Progress");
      },
    );
    const transition = await scene(
      "ticket-state",
      "07 / Session A · update the ticket",
      8,
      [
        "Move the ticket from In Progress to Code Review through the actual API.",
      ],
      async () => {
        await c.click(state(page));
        await c.click(
          page.getByRole("option", { name: "Code Review", exact: true }),
        );
        await expect(state(page)).toHaveText("Code Review");
        await expect(state(observer)).toHaveText("Code Review");
      },
    );
    scenes.push({
      ...transition,
      id: "live-ticket",
      title: "08 / Session B · no refresh",
      source: "observer",
      captions: [
        "The same change arrives in an independent browser session over WebSockets. No refresh.",
      ],
    });
    const movement = await scene(
      "task-move",
      "09 / Session A · move a child task",
      10,
      [
        "Task state is separate from ticket state. Move a child task into In Progress.",
      ],
      async () => {
        await c.click(
          page.getByRole("button", {
            name: `Change status for task #${task.id}`,
            exact: true,
          }),
        );
        const editor = page.getByRole("dialog", {
          name: "Task Details",
          exact: true,
        });
        await expect(editor).toBeVisible();
        await c.click(
          editor.getByRole("combobox", { name: "Change status", exact: true }),
        );
        await c.click(
          page.getByRole("option", { name: "In Progress", exact: true }),
        );
        await c.click(
          editor.getByRole("button", { name: "Save", exact: true }),
        );
        await expect(editor).toHaveCount(0);
        const destination = page.locator(
          `[data-task-state="${taskTo.name}"][data-ticket-id="${ticket.id}"]`,
        );
        await expect(
          destination.getByRole("button", {
            name: `Drag task #${task.id}`,
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          observer
            .locator(
              `[data-task-state="${taskTo.name}"][data-ticket-id="${ticket.id}"]`,
            )
            .getByRole("button", {
              name: `Drag task #${task.id}`,
              exact: true,
            }),
        ).toBeVisible();
      },
    );
    scenes.push({
      ...movement,
      id: "live-task",
      title: "10 / Session B · work stays in sync",
      source: "observer",
      captions: [
        "The moved task appears in the second session, while its parent ticket remains in Code Review.",
      ],
    });
    const saved = await (
      await api.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const savedTicket = saved.tickets.find((t) => t.id === ticket.id);
    expect(savedTicket.statusId).toBe(ticketTo.id);
    expect(savedTicket.tasks.find((t) => t.id === task.id).statusId).toBe(
      taskTo.id,
    );
    expect(observerNavigations).toBe(0);
    expect(socketEvents.some((e) => e.statusId === ticketTo.id)).toBe(true);
    expect(socketEvents.some((e) => e.taskStatusId === taskTo.id)).toBe(true);
    evidence.checks.websocket = {
      independentContexts: true,
      event: "ticketUpdated",
      events: socketEvents,
      observerReloads: observerNavigations,
      canonicalTicketState: "CODE_REVIEW",
      canonicalTaskState: "IN_PROGRESS",
      persistence: true,
    };
    if (!taskboardOnly) {
      await scene(
        "team",
        "11 / People behind the work",
        8,
        [
          "The project-wide team connects people to assigned work and sprint planning.",
        ],
        async () => {
          await c.nav("Team");
          await pause(1600);
        },
      );
      await scene(
        "capacity",
        "12 / Plan available capacity",
        10,
        [
          "Sprint capacity shows the team’s available hours and planned workload.",
        ],
        async () => {
          await c.nav("Capacity");
          await pause(1800);
        },
      );
      await scene(
        "goals",
        "13 / Track the sprint outcome",
        10,
        [
          "Sprint goals pair a clear outcome with an actionable checklist and progress.",
        ],
        async () => {
          await c.nav("Goals");
          await pause(2000);
        },
      );
      await scene(
        "retrospective",
        "14 / Make room for feedback",
        14,
        [
          "Review what worked, what did not, and what the team can improve next.",
          "Retrospective cards and reactions belong to the selected sprint.",
        ],
        async () => {
          await c.nav("Retrospective");
          await expect(
            page.getByRole("heading", { name: "Retrospective.", exact: true }),
          ).toBeVisible();
          await pause(2600);
        },
      );
      const phone = await context("mobile", 390, 844),
        m = await controls(phone);
      await enter(phone);
      await workspace(phone, "overview");
      await sync("mobile");
      await scene(
        "mobile",
        "15 / Same workflow. Smaller screen.",
        16,
        [
          "A real 390px viewport: responsive navigation, sprint work and contextual editing.",
        ],
        async () => {
          await m.nav("Backlog");
          await m.type(
            phone.getByRole("textbox", { name: "Search work", exact: true }),
            ticket.title,
          );
          await m.click(
            phone.getByRole("button", { name: ticket.title, exact: true }),
          );
          await expect(
            phone.getByRole("dialog", { name: "Ticket Details", exact: true }),
          ).toBeVisible();
          await shot(phone, "work-mobile");
          await pause(1800);
          await m.click(
            phone.getByRole("button", {
              name: "Close ticket editor",
              exact: true,
            }),
          );
        },
        { source: "mobile" },
      );
      await scene(
        "appearance",
        "16 / Two complete appearances",
        8,
        [
          "Switch appearance explicitly. The choice is remembered across visits.",
        ],
        async () => {
          await m.click(
            phone.getByRole("button", {
              name: "Open project navigation",
              exact: true,
            }),
          );
          await m.click(
            phone.getByRole("button", { name: "Open user menu", exact: true }),
          );
          await m.click(
            phone.getByRole("menuitem", {
              name: "Switch to dark theme",
              exact: true,
            }),
          );
          await phone.keyboard.press("Escape");
          await phone.keyboard.press("Escape");
          await pause(1200);
        },
        { source: "mobile" },
      );
      await scene(
        "close",
        "17 / Built across the stack",
        12,
        [
          "React + TypeScript → NestJS REST API → Prisma + PostgreSQL. Socket.IO keeps sessions synchronized.",
          "Explore the live demo or inspect the implementation on GitHub.",
        ],
        async () => {
          await c.nav("Overview");
          await pause(1500);
        },
      );
    }
    expect(errors).toEqual([]);
    evidence.checks.browserErrors = errors;
    evidence.checks.scenes = scenes.length;
    for (const [name, source] of Object.entries(sources)) {
      const file = rehearsal ? null : await source.page.video().path();
      await source.context.close();
      sources[name] = {
        file: file && path.relative(output, file),
        width: source.width,
        height: source.height,
        syncWallTime: source.syncWallTime,
      };
    }
    const seconds = scenes.reduce((sum, s) => sum + s.rawSeconds, 0);
    evidence.durationBeforeEdit = seconds;
    fs.writeFileSync(
      path.join(output, "manifest.json"),
      JSON.stringify(evidence, null, 2),
    );
    fs.writeFileSync(
      path.join(
        recording,
        "latest-" +
          (taskboardOnly ? "taskboard-" : "") +
          (rehearsal ? "rehearsal" : "take") +
          ".json",
      ),
      JSON.stringify({ output }, null, 2),
    );
    console.log(
      JSON.stringify({
        output,
        rehearsal,
        seconds,
        scenes: scenes.length,
        checks: evidence.checks,
      }),
    );
  } catch (error) {
    fs.writeFileSync(path.join(output, "failure.txt"), error.stack);
    for (const ctx of contexts) {
      for (const page of ctx.pages())
        await page
          .screenshot({
            path: path.join(
              output,
              "failure-" + contexts.indexOf(ctx) + ".png",
            ),
          })
          .catch(() => {});
    }
    throw error;
  } finally {
    await api?.dispose();
    for (const ctx of contexts) await ctx.close().catch(() => {});
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error.stack);
  process.exitCode = 1;
});
