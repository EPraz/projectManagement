import assert from "node:assert/strict";

const origin = new URL(
  process.argv[2] || "https://project-management-murex-pi.vercel.app"
).origin;

async function request(path, options = {}) {
  return fetch(origin + path, {
    ...options,
    signal: AbortSignal.timeout(90000)
  });
}

async function jsonResponse(path, options = {}, status = 200) {
  const response = await request(path, options);
  assert.equal(response.status, status, `${path}: unexpected HTTP status`);
  assert.match(
    response.headers.get("content-type") || "",
    /application\/json/i,
    `${path}: API request received the SPA instead of JSON`
  );
  return { response, body: await response.json() };
}

async function main() {
  const sessions = [];
  for (const suffix of ["", "/"]) {
    const { response, body } = await jsonResponse(
      "/api/auth/instant-login" + suffix,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      },
      201
    );
    assert.equal(typeof body.accessToken, "string");
    sessions.push({
      token: body.accessToken,
      cookie: response.headers.get("set-cookie")?.split(";")[0]
    });
  }

  const headers = { Authorization: `Bearer ${sessions[0].token}` };
  let expectedProjectIds;
  for (const suffix of ["", "/"]) {
    const { body: health } = await jsonResponse("/api/health" + suffix);
    assert.equal(health.status, "ok");
    const { body: projects } = await jsonResponse("/api/projects" + suffix, {
      headers
    });
    assert.ok(Array.isArray(projects) && projects.length > 0);
    const ids = projects.map((project) => project.id).sort();
    if (expectedProjectIds) assert.deepEqual(ids, expectedProjectIds);
    expectedProjectIds = ids;
    const { body: users } = await jsonResponse("/api/users" + suffix, {
      headers
    });
    assert.ok(Array.isArray(users) && users.length > 0);
    const { body: summaries } = await jsonResponse(
      `/api/projects${suffix}?view=summary`,
      { headers }
    );
    assert.deepEqual(summaries.map((project) => project.id).sort(), ids);
    assert.ok(
      summaries.every(
        (project) =>
          Array.isArray(project.tickets) &&
          Array.isArray(project.ticketStatuses)
      )
    );
    assert.doesNotMatch(
      JSON.stringify([projects, users, summaries]),
      /"password"|"refreshToken"/
    );
    await jsonResponse("/api/projects" + suffix, {}, 401);
    await jsonResponse("/api/unknown-deployment-probe" + suffix, {}, 404);
  }

  const { body: workspace } = await jsonResponse(
    `/api/projects/${expectedProjectIds[0]}?view=workspace`,
    { headers }
  );
  assert.ok(
    Array.isArray(workspace.tickets) && Array.isArray(workspace.sprints)
  );
  assert.ok(workspace.sprints.every((sprint) => !("tickets" in sprint)));
  assert.doesNotMatch(JSON.stringify(workspace), /"password"|"refreshToken"/);

  const deepLink = await request(`/projects/${expectedProjectIds[0]}/board`);
  assert.equal(deepLink.status, 200);
  assert.match(deepLink.headers.get("content-type") || "", /text\/html/i);
  assert.match(await deepLink.text(), /id="root"/);
  await jsonResponse(
    "/api/auth/refresh/",
    { method: "POST", headers: { Cookie: sessions[1].cookie } },
    201
  );
  console.log(
    "PASS: API routes return JSON with and without trailing slashes; demo projects, users, sessions and SPA deep links work."
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
