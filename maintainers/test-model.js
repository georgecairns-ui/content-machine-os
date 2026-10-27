/*
  Checks the rules in apps/content/app/model.js with plain Node assertions.
  Run: node maintainers/test-model.js   (prints how many checks passed, exits 1 if any failed)
*/
"use strict";

// The owner is in the UK: timestamps are checked against London time, with the clocks forward in summer
process.env.TZ = "Europe/London";

const assert = require("assert");
const path = require("path");
const M = require(path.join(__dirname, "..", "apps", "content", "app", "model.js"));

let passed = 0;
function check(name, fn) {
  try { fn(); passed += 1; } catch (e) { console.error("FAILED: " + name + "\n  " + e.message); process.exit(1); }
}

function entry(factors, extra) {
  return Object.assign({ on: true, format: "photo", text: "", factors: factors, reason: "", postedAt: null, link: "" }, extra || {});
}
const FULL = { fit: 2, demand: 2, hook: 2, proof: 2, timing: 1 };   // 9
const LOW = { fit: 1, demand: 0, hook: 1, proof: 0, timing: 1 };    // 3

function blank() {
  return M.normalise({ settings: { businessName: "Fern & Finch", weekStarts: 1 }, platforms: {}, posts: [], ideas: [] });
}

check("score adds the 5 factors", function () { assert.strictEqual(M.score(entry(FULL)), 9); });
check("score is null when a factor is missing", function () {
  assert.strictEqual(M.score(entry({ fit: 2, demand: 2, hook: 2, proof: 2 })), null);
  assert.strictEqual(M.score(entry(null)), null);
  assert.strictEqual(M.score(null), null);
});
check("score is null when a factor is not a number", function () { assert.strictEqual(M.score(entry({ fit: "2", demand: 2, hook: 2, proof: 2, timing: 2 })), null); });

check("best platform is the highest score, ties by platform order", function () {
  const post = { platforms: { tiktok: entry(FULL), instagram: entry(FULL), linkedin: entry(LOW) } };
  assert.deepStrictEqual(M.bestPlatform(post), { key: "instagram", score: 9 });
  assert.strictEqual(M.bestPlatform({ platforms: { instagram: entry(null) } }), null);
  assert.strictEqual(M.bestPlatform({ platforms: { instagram: entry(FULL, { on: false }) } }), null);
});
check("recommended is 7 or more, off platforms too", function () {
  const post = { platforms: { x: entry(FULL, { on: false }), instagram: entry(LOW), tiktok: entry(FULL) } };
  assert.deepStrictEqual(M.recommended(post), ["tiktok", "x"]);
});

check("status: skipped and posted win, then needs you, then stored", function () {
  const open = [{ id: "n", done: false }];
  assert.strictEqual(M.postStatus({ status: "skipped", needs: open }), "skipped");
  assert.strictEqual(M.postStatus({ status: "posted", needs: open }), "posted");
  assert.strictEqual(M.postStatus({ status: "approved", needs: open }), "needs-you");
  assert.strictEqual(M.postStatus({ status: "approved", needs: [{ done: true }] }), "approved");
  assert.strictEqual(M.postStatus({ status: "drafted" }), "drafted");
  assert.strictEqual(M.postStatus({ status: "nonsense" }), "idea");
});

check("week days start on Monday or Sunday", function () {
  assert.deepStrictEqual(M.weekDays("2026-10-20", 1), ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24", "2026-10-25"]);
  assert.strictEqual(M.weekDays("2026-10-20", 0)[0], "2026-10-18");
  assert.strictEqual(M.weekDays("2026-10-25", 1)[0], "2026-10-19");
  assert.strictEqual(M.weekDays("2026-10-25", 0)[0], "2026-10-25");
});
check("month grid covers the month in whole weeks", function () {
  const grid = M.monthGrid("2026-10-20", 1);
  assert.strictEqual(grid.length, 5);
  grid.forEach(function (w) { assert.strictEqual(w.length, 7); });
  assert.strictEqual(grid[0][0].iso, "2026-09-28");
  assert.strictEqual(grid[0][0].inMonth, false);
  assert.strictEqual(grid[0][3].iso, "2026-10-01");
  assert.strictEqual(grid[0][3].inMonth, true);
  assert.strictEqual(grid[4][6].iso, "2026-11-01");
});
check("month grid shows 6 weeks when the month needs them, and at least 5", function () {
  assert.strictEqual(M.monthGrid("2026-11-10", 0).length, 5);
  assert.strictEqual(M.monthGrid("2026-02-10", 1).length, 5);   // February 2026 fits 4 weeks, padded to 5
  assert.strictEqual(M.monthGrid("2027-05-10", 1).length, 6);   // 1 May 2027 is a Saturday
});

check("characters are counted against the limit, YouTube by first line", function () {
  assert.deepStrictEqual(M.charCount("x", "a".repeat(281)), { count: 281, limit: 280, over: true });
  assert.deepStrictEqual(M.charCount("x", "hello"), { count: 5, limit: 280, over: false });
  assert.deepStrictEqual(M.charCount("youtube", "Short title\n" + "b".repeat(500)), { count: 11, limit: 100, over: false });
  assert.strictEqual(M.charCount("email", "a".repeat(9000)).over, false);
});

check("posts for a day skip skipped posts, sort by time and filter by platform", function () {
  const d = blank();
  d.posts = [
    { id: "a", date: "2026-10-21", time: "12:00", status: "idea", platforms: { x: entry(null) } },
    { id: "b", date: "2026-10-21", time: "08:00", status: "idea", platforms: { instagram: entry(null) } },
    { id: "c", date: "2026-10-21", time: "09:00", status: "skipped", platforms: { instagram: entry(null) } },
    { id: "d", date: "2026-10-22", time: "09:00", status: "idea", platforms: {} }
  ];
  assert.deepStrictEqual(M.postsForDay(d, "2026-10-21").map(function (p) { return p.id; }), ["b", "a"]);
  assert.deepStrictEqual(M.postsForDay(d, "2026-10-21", ["x"]).map(function (p) { return p.id; }), ["a"]);
  assert.deepStrictEqual(M.postsForDay(d, "2026-10-21", []).length, 2);
});

check("weekly target adds posts a week over the platforms that are on", function () {
  const d = blank();
  d.platforms = { instagram: { on: true, perWeek: 2 }, tiktok: { on: true, perWeek: 1 }, x: { on: false, perWeek: 5 } };
  assert.strictEqual(M.weeklyTarget(d), 3);
  assert.deepStrictEqual(M.onPlatforms(d), ["instagram", "tiktok"]);
});

check("set up means a business name or any post", function () {
  assert.strictEqual(M.isSetUp({ settings: { businessName: "" }, posts: [] }), false);
  assert.strictEqual(M.isSetUp({ settings: { businessName: "  " }, posts: [] }), false);
  assert.strictEqual(M.isSetUp({ settings: { businessName: "A" }, posts: [] }), true);
  assert.strictEqual(M.isSetUp({ settings: { businessName: "" }, posts: [{}] }), true);
});

check("a new post takes its defaults from settings", function () {
  const d = blank();
  d.settings.defaultTime = "10:30";
  d.settings.defaultApproval = "auto";
  const p = M.newPost(d, { title: "Hello", date: "2026-10-22" });
  assert.strictEqual(p.time, "10:30");
  assert.strictEqual(p.approval, "auto");
  assert.strictEqual(p.status, "idea");
  assert.strictEqual(p.title, "Hello");
  assert.strictEqual(p.request, null);
  assert.ok(/^p-/.test(p.id));
});
check("a post from an idea uses recommended platforms, else every platform that is on", function () {
  const d = blank();
  d.platforms = { instagram: { on: true, recommended: true }, tiktok: { on: true }, x: { on: false, recommended: true } };
  const idea = { id: "i-1", title: "Menu", notes: "Before and after", theme: "Real work" };
  const p = M.postFromIdea(d, idea, "2026-10-23");
  assert.deepStrictEqual(Object.keys(p.platforms), ["instagram"]);
  assert.strictEqual(p.platforms.instagram.format, "photo");
  assert.strictEqual(p.ideaId, "i-1");
  assert.strictEqual(p.notes, undefined);
  assert.strictEqual(p.date, "2026-10-23");
  d.platforms.instagram.recommended = false;
  assert.deepStrictEqual(Object.keys(M.postFromIdea(d, idea, null).platforms), ["instagram", "tiktok"]);
});

function todoData() {
  const d = blank();
  d.platforms = { instagram: { on: true, perWeek: 2 }, linkedin: { on: true, perWeek: 1 } };
  d.posts = [
    { id: "need", date: "2026-10-22", status: "idea", platforms: {}, needs: [{ id: "n1", type: "photo", text: "Photo", due: null, done: false }, { id: "n2", type: "video", text: "Done", due: "2026-10-01", done: true }] },
    { id: "late", date: "2026-10-10", status: "idea", platforms: {}, needs: [{ id: "n3", type: "quote", text: "Quote", due: "2026-10-12", done: false }] },
    { id: "draft", date: "2026-10-30", status: "drafted", platforms: {}, needs: [] },
    { id: "undated", date: null, status: "drafted", platforms: {}, needs: [{ id: "n4", type: "info", text: "Info", done: false }] },
    { id: "go", date: "2026-10-20", time: "09:00", status: "approved", platforms: { instagram: entry(FULL), linkedin: entry(LOW, { postedAt: "2026-10-20T09:00:00Z" }) }, needs: [] },
    { id: "future", date: "2026-10-25", status: "approved", platforms: { instagram: entry(FULL) }, needs: [] },
    { id: "gone", date: "2026-10-20", status: "skipped", platforms: {}, needs: [{ id: "n5", done: false }] }
  ];
  return d;
}
check("to do sorts items into overdue, today, this week and later", function () {
  const t = M.todo(todoData(), "2026-10-20");
  assert.deepStrictEqual(t.overdue.map(function (i) { return i.kind + ":" + i.post.id; }), ["need:late"]);
  assert.deepStrictEqual(t.today.map(function (i) { return i.kind + ":" + i.post.id + (i.platform ? ":" + i.platform : ""); }), ["need:undated", "post:go:instagram"]);
  assert.deepStrictEqual(t.week.map(function (i) { return i.kind + ":" + i.post.id; }), ["need:need"]);
  assert.deepStrictEqual(t.later.map(function (i) { return i.kind + ":" + i.post.id; }), ["approve:draft"]);
});
check("a need is due the day before its post unless it has its own date", function () {
  const t = M.todo(todoData(), "2026-10-20");
  assert.strictEqual(t.week[0].due, "2026-10-21");
  assert.strictEqual(t.overdue[0].due, "2026-10-12");
  assert.strictEqual(t.today[0].due, "2026-10-20");
});
check("to do leaves out skipped posts, posted platforms, future posts and undated drafts", function () {
  const all = [].concat.apply([], Object.values(M.todo(todoData(), "2026-10-20")));
  assert.ok(!all.some(function (i) { return i.post.id === "gone" || i.post.id === "future"; }));
  assert.ok(!all.some(function (i) { return i.platform === "linkedin"; }));
  assert.ok(!all.some(function (i) { return i.kind === "approve" && i.post.id === "undated"; }));
});

check("stats count this month's posts against the target so far, and the weeks ahead", function () {
  const d = todoData();
  d.posts.push({ id: "old", date: "2026-09-29", status: "posted", platforms: { instagram: entry(FULL, { postedAt: "2026-09-29T09:00:00Z" }) }, needs: [] });
  const s = M.stats(d, "2026-10-20");
  assert.strictEqual(s.posted, 1);                          // the LinkedIn post on the 20th; September's is not counted
  assert.strictEqual(s.target, Math.round(3 * 20 / 7));      // the whole week's target, rounded once
  assert.strictEqual(s.plannedWeeks, 1.6);                   // 20 to 30 October is 11 days counting both ends
  assert.strictEqual(s.waiting, 4);                          // 3 open needs and 1 draft; the undated draft is not asked for yet
  assert.strictEqual(s.averageScore, 7);                     // (9 + 3 + 9) / 3 over the next 2 weeks
  const empty = M.stats(blank(), "2026-10-20");
  assert.deepStrictEqual(empty, { posted: 0, target: 0, plannedWeeks: 0, waiting: 0, averageScore: null });
});
check("the average score rounds to 1 decimal and skips unscored platforms", function () {
  const d = blank();
  d.posts = [
    { id: "a", date: "2026-10-21", status: "approved", needs: [], platforms: { instagram: entry({ fit: 2, demand: 2, hook: 2, proof: 2, timing: 1 }) } },
    { id: "b", date: "2026-10-22", status: "approved", needs: [], platforms: { instagram: entry({ fit: 2, demand: 2, hook: 2, proof: 1, timing: 0 }), tiktok: entry(null) } },
    { id: "c", date: "2026-10-23", status: "approved", needs: [], platforms: { instagram: entry({ fit: 0, demand: 0, hook: 1, proof: 0, timing: 0 }), x: entry(FULL, { on: false }) } },
    { id: "d", date: "2026-11-20", status: "approved", needs: [], platforms: { instagram: entry(FULL) } }   // beyond the next 2 weeks
  ];
  assert.strictEqual(M.stats(d, "2026-10-20").averageScore, 5.7);   // (9 + 7 + 1) / 3
});
check("the total target is rounded once, so 3 platforms at 1 a week on the 3rd is 1", function () {
  const d = blank();
  d.platforms = { instagram: { on: true, perWeek: 1 }, tiktok: { on: true, perWeek: 1 }, linkedin: { on: true, perWeek: 1 } };
  assert.strictEqual(M.stats(d, "2026-10-03").target, 1);
});
check("posted per week counts each platform's post in the week it went out, newest week last", function () {
  const d = blank();
  d.platforms = { instagram: { on: true, perWeek: 1 } };
  function posted(date, extra) { return { id: date, date: date, status: "posted", platforms: { instagram: entry(FULL, { postedAt: date + "T09:00:00Z" }) }, needs: [] }; }
  d.posts = [posted("2026-10-06"), posted("2026-10-13"), posted("2026-10-20"), posted("2026-10-20")];
  d.posts[3].id = "second";
  assert.deepStrictEqual(M.weeklyPosted(d, "2026-10-21", 3), [{ start: "2026-10-05", posted: 1 }, { start: "2026-10-12", posted: 1 }, { start: "2026-10-19", posted: 2 }]);
  assert.deepStrictEqual(M.weeklyPosted(d, "2026-10-21", 1), [{ start: "2026-10-19", posted: 2 }]);
  d.settings.weekStarts = 0;
  assert.strictEqual(M.weeklyPosted(d, "2026-10-21", 1)[0].start, "2026-10-18");
  assert.deepStrictEqual(M.weeklyPosted(blank(), "2026-10-21", 2).map(function (w) { return w.posted; }), [0, 0]);
});

// A calendar in good shape on Wednesday 21 October: 2 a week for 4 whole weeks, 2 weeks planned, nothing waiting
function healthyData() {
  const d = blank();
  d.settings.planWeeks = 2;
  d.platforms = { instagram: { on: true, perWeek: 2 } };
  const done = ["2026-09-22", "2026-09-24", "2026-09-29", "2026-10-01", "2026-10-06", "2026-10-08", "2026-10-13", "2026-10-15"];
  d.posts = done.map(function (date) { return { id: "done-" + date, date: date, status: "posted", needs: [], platforms: { instagram: entry(FULL, { postedAt: date + "T09:00:00Z" }) } }; });
  [["2026-10-22", "Real work"], ["2026-10-26", "Tips"], ["2026-10-29", "Real work"], ["2026-11-03", "Tips"]].forEach(function (x) {
    d.posts.push({ id: "next-" + x[0], date: x[0], theme: x[1], status: "approved", needs: [], platforms: { instagram: entry(FULL) } });
  });
  return d;
}
function stateOf(checks, key) { return checks.find(function (c) { return c.key === key; }).state; }
check("a healthy calendar passes every check", function () {
  const checks = M.health(healthyData(), "2026-10-21");
  assert.deepStrictEqual(checks.map(function (c) { return c.key; }), ["rhythm", "ahead", "waiting", "score", "spread", "mix"]);
  checks.forEach(function (c) { assert.strictEqual(c.state, "ok", c.key); assert.ok(c.label && c.hint && c.valueText && c.targetText, c.key); });
  assert.strictEqual(checks[0].value, 2);
  assert.strictEqual(checks[1].value, 2);
  assert.strictEqual(M.healthOverall(checks), "ok");
});
check("an empty calendar needs action on planning and spread, and watches the rest", function () {
  const d = healthyData();
  d.posts = [];
  const checks = M.health(d, "2026-10-21");
  assert.strictEqual(stateOf(checks, "rhythm"), "warn");
  assert.strictEqual(checks[0].value, null);
  assert.strictEqual(stateOf(checks, "ahead"), "bad");
  assert.strictEqual(stateOf(checks, "waiting"), "ok");
  assert.strictEqual(stateOf(checks, "score"), "warn");
  assert.strictEqual(checks[3].value, null);
  assert.strictEqual(stateOf(checks, "spread"), "bad");
  assert.strictEqual(stateOf(checks, "mix"), "warn");
  assert.strictEqual(M.healthOverall(checks), "bad");
});
check("posting rhythm compares whole weeks with the target, and ignores weeks before the first post", function () {
  function keep(ids) { const d = healthyData(); d.posts = d.posts.filter(function (p) { return /^next/.test(p.id) || ids.indexOf(p.id.slice(5)) > -1; }); return d; }
  const half = M.health(keep(["2026-09-22", "2026-09-29", "2026-10-06", "2026-10-13"]), "2026-10-21")[0];
  assert.strictEqual(half.value, 1);                          // 1 a week against 2
  assert.strictEqual(half.state, "warn");
  const low = M.health(keep(["2026-09-22"]), "2026-10-21")[0];
  assert.strictEqual(low.value, 0.3);                         // 1 post in 4 whole weeks, rounded
  assert.strictEqual(low.state, "bad");
  const fresh = M.health(keep(["2026-10-15"]), "2026-10-21")[0];
  assert.strictEqual(fresh.value, 1);                         // only the week of 12 October counts, not the 3 before it
  assert.strictEqual(M.health(keep([]), "2026-10-21")[0].value, null);
  const none = healthyData();
  none.platforms = {};
  assert.strictEqual(M.health(none, "2026-10-21")[0].state, "warn");   // no target to measure against
});
check("waiting on you counts overdue things twice", function () {
  const d = healthyData();
  const need = function (n, due) { return { id: "n" + n, type: "photo", text: "Photo " + n, due: due, done: false }; };
  d.posts[8].needs = [need(1, "2026-10-30"), need(2, "2026-10-30"), need(3, "2026-10-30")];
  assert.strictEqual(stateOf(M.health(d, "2026-10-21"), "waiting"), "ok");     // 3 things
  d.posts[8].needs.push(need(4, "2026-10-30"));
  assert.strictEqual(stateOf(M.health(d, "2026-10-21"), "waiting"), "warn");   // 4 things
  d.posts[8].needs.forEach(function (n) { n.due = "2026-10-01"; });
  const waiting = M.health(d, "2026-10-21")[2];
  assert.strictEqual(waiting.state, "bad");                                    // 4 overdue count as 8
  assert.strictEqual(waiting.value, 8);
  assert.strictEqual(waiting.valueText, "4 things");
});
check("average score is healthy at 7, watch from 5, needs action below", function () {
  const d = healthyData();
  d.posts.filter(function (p) { return /^next/.test(p.id); }).forEach(function (p) { p.platforms.instagram.factors = { fit: 1, demand: 1, hook: 1, proof: 1, timing: 1 }; });   // 5
  assert.strictEqual(stateOf(M.health(d, "2026-10-21"), "score"), "warn");
  d.posts.filter(function (p) { return /^next/.test(p.id); }).forEach(function (p) { p.platforms.instagram.factors = LOW; });   // 3
  assert.strictEqual(stateOf(M.health(d, "2026-10-21"), "score"), "bad");
});
check("platform spread needs a post on every platform that is on in the next 2 weeks", function () {
  const d = healthyData();
  d.platforms.tiktok = { on: true, perWeek: 1 };
  d.platforms.linkedin = { on: true, perWeek: 1 };
  d.posts[8].platforms.tiktok = entry(FULL);
  const spread = M.health(d, "2026-10-21")[4];
  assert.strictEqual(spread.value, 2);
  assert.strictEqual(spread.target, 3);
  assert.strictEqual(spread.state, "warn");
  d.posts[8].platforms.tiktok.on = false;                    // 1 of 3 is under half
  assert.strictEqual(M.health(d, "2026-10-21")[4].state, "bad");
  d.platforms.linkedin.on = false;                           // 1 of 2 is half
  assert.strictEqual(M.health(d, "2026-10-21")[4].state, "warn");
  d.platforms = {};
  assert.strictEqual(M.health(d, "2026-10-21")[4].state, "warn");
});
check("theme mix watches one theme taking over, and waits for 4 posts before judging", function () {
  const d = healthyData();
  const next = d.posts.filter(function (p) { return /^next/.test(p.id); });
  next.forEach(function (p) { p.theme = "Real work"; });
  assert.strictEqual(M.health(d, "2026-10-21")[5].value, 100);
  assert.strictEqual(M.health(d, "2026-10-21")[5].state, "bad");
  next[0].theme = "Tips";   // 3 of 4 is 75%
  assert.strictEqual(M.health(d, "2026-10-21")[5].state, "bad");
  next[1].theme = "Tips";   // 2 and 2 is 50%
  assert.strictEqual(M.health(d, "2026-10-21")[5].state, "ok");
  d.posts = d.posts.filter(function (p) { return p.id !== "next-2026-11-03"; });
  assert.strictEqual(M.health(d, "2026-10-21")[5].value, null);
  assert.strictEqual(M.health(d, "2026-10-21")[5].state, "warn");
});
check("the overall state is the worst check", function () {
  const c = function (state) { return { state: state }; };
  assert.strictEqual(M.healthOverall([c("ok"), c("ok")]), "ok");
  assert.strictEqual(M.healthOverall([c("ok"), c("warn")]), "warn");
  assert.strictEqual(M.healthOverall([c("warn"), c("bad"), c("ok")]), "bad");
  assert.deepStrictEqual(Object.keys(M.HEALTH_LABELS), ["ok", "warn", "bad"]);
});
check("the preview cuts at the platform's see more point, at a word end", function () {
  const words = "word ".repeat(60);
  const ig = M.preview("instagram", words);
  assert.strictEqual(ig.cut, true);
  assert.ok(ig.shown.length <= 125 && ig.shown.endsWith("word"));
  assert.strictEqual(M.preview("linkedin", words).shown.length > 125, true);
  assert.strictEqual(M.preview("linkedin", words).cut, true);
  assert.deepStrictEqual(M.preview("facebook", "Short and sweet"), { shown: "Short and sweet", cut: false });
  assert.strictEqual(M.preview("x", words).cut, false);
  assert.strictEqual(M.preview("instagram", "a".repeat(300)).shown.length, 125);   // no space to cut at
  assert.deepStrictEqual(M.preview("instagram", null), { shown: "", cut: false });
});

check("activity is newest first and capped at 200", function () {
  const d = blank();
  for (let i = 0; i < 205; i++) M.logActivity(d, "Moved " + i, "p-1");
  assert.strictEqual(d.activity.length, 200);
  assert.strictEqual(d.activity[0].what, "Moved 204");
  assert.strictEqual(d.activity[0].postId, "p-1");
  assert.ok(d.activity[0].at);
});

check("validate rejects the wrong kind of list", function () {
  assert.throws(function () { M.validate({ posts: {} }); }, /posts/);
  assert.throws(function () { M.validate({ ideas: "x" }); }, /ideas/);
  assert.throws(function () { M.validate({ platforms: [] }); }, /platforms/);
  M.validate({ version: 1, posts: [], ideas: [], platforms: {} });
});

check("a timestamp becomes the owner's own day, not the UTC date", function () {
  assert.strictEqual(M.localDay("2026-09-30T23:30:00Z"), "2026-10-01");   // 00:30 on 1 October, British Summer Time
  assert.strictEqual(M.localDay("2026-12-01T23:30:00Z"), "2026-12-01");   // winter, no shift
  assert.strictEqual(M.localDay("not a date"), null);
  assert.strictEqual(M.localDay(null), null);
});
check("a post just after midnight in summer counts in the right month and week", function () {
  const d = blank();
  d.platforms = { instagram: { on: true, perWeek: 1 } };
  d.posts = [{ id: "a", date: "2026-10-01", status: "posted", needs: [], platforms: { instagram: entry(FULL, { postedAt: "2026-09-30T23:30:00Z" }) } }];
  assert.strictEqual(M.stats(d, "2026-10-20").posted, 1);       // October, not September
  assert.strictEqual(M.stats(d, "2026-09-29").posted, 0);
  assert.deepStrictEqual(M.postedCounts(d, "2026-10-20"), { instagram: 1 });
  d.posts[0].platforms.instagram.postedAt = "2026-10-18T23:30:00Z";   // 00:30 on Monday 19 October
  assert.deepStrictEqual(M.weeklyPosted(d, "2026-10-19", 2).map(function (w) { return w.posted; }), [0, 1]);
});

check("dates Claude writes badly become null instead of breaking pages", function () {
  const d = M.normalise({
    posts: [{ id: "p", date: "2026-02-31", needs: [{ id: "n", type: "photo", text: "Photo", due: "next Tuesday", done: false }], platforms: { instagram: entry(null, { postedAt: "yesterday" }) } }],
    research: { trends: [{ id: "t", title: "Spring", why: "x", until: "soon", platforms: ["instagram"] }] }
  });
  assert.strictEqual(d.posts[0].date, null);
  assert.strictEqual(d.posts[0].needs[0].due, null);
  assert.strictEqual(d.posts[0].platforms.instagram.postedAt, null);
  assert.strictEqual(d.research.trends[0].until, null);
  assert.strictEqual(M.validIso("2026-10-20"), "2026-10-20");
  assert.strictEqual(M.validIso("2026-10-20T09:00:00Z"), null);
  const t = M.todo(d, "2026-10-20");                  // must not throw
  assert.strictEqual(t.today.length, 1);               // the need has no date, so it is due today
});
check("unknown platforms, odd demand and missing lists are tidied", function () {
  const d = M.normalise({
    settings: { weekStarts: 6 },
    research: {
      searches: [{ id: "s", phrase: "x", demand: "huge" }, { id: "s2", phrase: "y", demand: "low" }],
      trends: [{ id: "t", title: "T", platforms: ["instagram", "myspace"] }, { id: "t2", title: "T2" }],
      competitors: [{ id: "c", name: "C", platforms: ["myspace", "x"], examples: [{ platform: "myspace", what: "a" }, { platform: "x", what: "b" }] }, { id: "c2", name: "C2" }]
    }
  });
  assert.strictEqual(d.research.searches[0].demand, "medium");
  assert.strictEqual(d.research.searches[1].demand, "low");
  assert.deepStrictEqual(d.research.trends[0].platforms, ["instagram"]);
  assert.deepStrictEqual(d.research.trends[1].platforms, []);
  assert.deepStrictEqual(d.research.competitors[0].platforms, ["x"]);
  assert.deepStrictEqual(d.research.competitors[0].examples.map(function (x) { return x.what; }), ["b"]);
  assert.deepStrictEqual(d.research.competitors[1].examples, []);
  assert.strictEqual(d.settings.weekStarts, 1);        // only Monday and Sunday are supported
});
check("only Monday and Sunday start a week", function () {
  assert.strictEqual(M.weekStartsOf({ settings: { weekStarts: 0 } }), 0);
  assert.strictEqual(M.weekStartsOf({ settings: { weekStarts: "0" } }), 0);
  assert.strictEqual(M.weekStartsOf({ settings: { weekStarts: 6 } }), 1);
  assert.strictEqual(M.weekStartsOf({ settings: {} }), 1);
});

check("planning an idea makes a post and Undo puts the idea back", function () {
  const d = blank();
  d.platforms = { instagram: { on: true } };
  d.ideas = [{ id: "i-1", title: "Menu", status: "new", postId: null }];
  const post = M.planIdea(d, "i-1", "2026-10-23", "p-fixed");
  assert.strictEqual(post.id, "p-fixed");
  assert.strictEqual(d.posts.length, 1);
  assert.strictEqual(d.posts[0].date, "2026-10-23");
  assert.strictEqual(d.ideas[0].status, "planned");
  assert.strictEqual(d.ideas[0].postId, "p-fixed");
  M.unplanIdea(d, "i-1", "p-fixed");
  assert.strictEqual(d.posts.length, 0);
  assert.strictEqual(d.ideas[0].status, "new");
  assert.strictEqual(d.ideas[0].postId, null);
  assert.throws(function () { M.planIdea(d, "nope", "2026-10-23", "p-2"); }, /idea/);
  assert.throws(function () { M.planIdea(d, "i-1", "", "p-2"); }, /day/);
});
check("marking posted sets the status when the last platform is posted, and undo restores it", function () {
  const post = { status: "approved", approvedAt: "x", platforms: { instagram: entry(FULL), tiktok: entry(FULL) }, needs: [] };
  M.markPosted(post, "instagram", " https://example.com/p ", "2026-10-20T09:00:00Z");
  assert.strictEqual(post.status, "approved");
  assert.strictEqual(post.platforms.instagram.link, "https://example.com/p");
  M.markPosted(post, "tiktok", "", "2026-10-20T10:00:00Z");
  assert.strictEqual(post.status, "posted");
  M.unmarkPosted(post, "tiktok", "approved", "2026-10-20T10:05:00Z");
  assert.strictEqual(post.status, "approved");
  assert.strictEqual(post.platforms.tiktok.postedAt, null);
  assert.throws(function () { M.markPosted(post, "x", "", "2026-10-20T10:00:00Z"); }, /version/);
});
check("answering a need marks it done and asks Claude to write: a case study kind for case studies", function () {
  const post = { needs: [{ id: "n1", type: "case-study", done: false }, { id: "n2", type: "info", done: false }] };
  M.answerNeed(post, "n1", "We did a patio", "2026-10-20T09:00:00Z");
  assert.strictEqual(post.needs[0].answer, "We did a patio");
  assert.strictEqual(post.needs[0].done, true);
  assert.strictEqual(post.request.kind, "case-study");
  M.answerNeed(post, "n2", "Open on bank holidays", "2026-10-20T09:00:00Z");
  assert.strictEqual(post.request.kind, "write");
  assert.throws(function () { M.answerNeed(post, "n9", "x", "2026-10-20T09:00:00Z"); }, /question/);
});
check("a need is due its own day, else the day before its post, else today", function () {
  assert.strictEqual(M.needDue({ date: "2026-10-22" }, { due: "2026-10-01" }, "2026-10-20"), "2026-10-01");
  assert.strictEqual(M.needDue({ date: "2026-10-22" }, { due: null }, "2026-10-20"), "2026-10-21");
  assert.strictEqual(M.needDue({ date: null }, {}, "2026-10-20"), "2026-10-20");
});
check("a research search with an idea already is found by id or by title, and dropped ideas don't count", function () {
  const d = { ideas: [{ id: "i1", source: "research", title: "Other", researchId: "s-1", status: "new" }, { id: "i2", source: "research", title: "Same title", status: "planned" }, { id: "i3", source: "you", title: "Gone", researchId: "s-3", status: "dropped" }] };
  assert.strictEqual(M.hasResearchIdea(d, { id: "s-1", phrase: "x" }), true);
  assert.strictEqual(M.hasResearchIdea(d, { id: "s-2", phrase: "Same title" }), true);
  assert.strictEqual(M.hasResearchIdea(d, { id: "s-3", phrase: "Gone" }), false);
  assert.strictEqual(M.hasResearchIdea(d, { phrase: "Unseen" }), false);
});
check("titles and day labels are made once", function () {
  assert.strictEqual(M.titleOf({ title: "" }), "Untitled post");
  assert.strictEqual(M.titleOf({ title: "Menu" }), "Menu");
  assert.strictEqual(M.dayLabel("2026-10-20"), "Tue 20 Oct");
  assert.deepStrictEqual(M.onKeys({ platforms: { tiktok: entry(null), instagram: entry(null), x: entry(null, { on: false }) } }), ["instagram", "tiktok"]);
  assert.strictEqual(M.addDaysIso("2026-10-31", 1), "2026-11-01");
});

// ---------- Photos and videos ----------
function item(id, type, ext) { return { id: id, file: id + "." + ext, name: id + "." + ext, type: type, size: 10, addedAt: "2026-10-21T09:00:00Z" }; }

check("mediaUrl builds the address of a stored file", function () {
  assert.strictEqual(M.mediaUrl("m-k3x9q2.jpg"), "/api/media/content/m-k3x9q2.jpg");
  assert.strictEqual(M.mediaUrl("a b.jpg"), "/api/media/content/a%20b.jpg");
});
check("a new post has an empty media list", function () { assert.deepStrictEqual(M.newPost(blank(), {}).media, []); });
check("cover is the first image, else the first video, else null", function () {
  assert.strictEqual(M.cover({ media: [] }), null);
  assert.strictEqual(M.cover({}), null);
  assert.strictEqual(M.cover({ media: [item("m-v1", "video", "mp4"), item("m-i1", "image", "jpg"), item("m-i2", "image", "png")] }).id, "m-i1");
  assert.strictEqual(M.cover({ media: [item("m-v1", "video", "mp4"), item("m-v2", "video", "mov")] }).id, "m-v1");
});
check("normalise gives every post a media list and drops items without a usable file name", function () {
  const d = M.normalise({ posts: [
    { id: "a" },
    { id: "b", media: "nope" },
    { id: "c", media: [item("m-ok1", "image", "jpg"), { id: "x" }, null, { file: "../etc/passwd.jpg" }, { file: "Bad Name.jpg" }, { file: "m-zip.zip" }, { file: "m-ok2.mov" }] }
  ] });
  assert.deepStrictEqual(d.posts[0].media, []);
  assert.deepStrictEqual(d.posts[1].media, []);
  assert.deepStrictEqual(d.posts[2].media.map(function (m) { return m.file; }), ["m-ok1.jpg", "m-ok2.mov"]);
  assert.deepStrictEqual(d.posts[2].media[1], { id: "m-ok2", file: "m-ok2.mov", name: "m-ok2.mov", type: "video", size: 0, addedAt: "" });
  assert.strictEqual(M.normalise({ posts: [{ id: "z", media: [{ file: "m-q.png", type: "video" }] }] }).posts[0].media[0].type, "image");
});
check("checkMediaFile says plainly why a file can't be added", function () {
  assert.deepStrictEqual(M.checkMediaFile({ name: "Patio.JPEG", type: "image/jpeg", size: 5 }), { ok: true, ext: "jpg", kind: "image" });
  assert.deepStrictEqual(M.checkMediaFile({ name: "clip.MOV", type: "", size: 5 }), { ok: true, ext: "mov", kind: "video" });
  assert.deepStrictEqual(M.checkMediaFile({ name: "photo", type: "image/png", size: 5 }), { ok: true, ext: "png", kind: "image" });
  assert.match(M.checkMediaFile({ name: "plan.pdf", type: "application/pdf", size: 5 }).message, /isn’t a picture or video/);
  assert.match(M.checkMediaFile({ name: "IMG_1.HEIC", type: "image/heic", size: 5 }).message, /JPG/);
  assert.match(M.checkMediaFile({ name: "big.mp4", type: "video/mp4", size: M.MAX_MEDIA_BYTES + 1 }).message, /over 200 MB/);
  assert.strictEqual(M.checkMediaFile({ name: "big.mp4", type: "video/mp4", size: M.MAX_MEDIA_BYTES }).ok, true);
  assert.match(M.checkMediaFile({ name: "empty.jpg", type: "image/jpeg", size: 0 }).message, /empty/);
});
check("adding a file ticks off the one open need of its kind, and only then", function () {
  const post = { media: [], needs: [{ id: "n1", type: "photo", text: "Add a photo", done: false }, { id: "n2", type: "video", text: "Record", done: false }] };
  const ticked = M.attachMedia(post, item("m-i1", "image", "jpg"), "2026-10-21T10:00:00Z");
  assert.strictEqual(ticked.id, "n1");
  assert.strictEqual(post.needs[0].done, true);
  assert.strictEqual(post.needs[1].done, false);
  assert.strictEqual(post.updatedAt, "2026-10-21T10:00:00Z");
  assert.strictEqual(M.attachMedia(post, item("m-i2", "image", "png"), "x"), null);   // none open now
  const two = { needs: [{ id: "a", type: "photo", done: false }, { id: "b", type: "photo", done: false }] };
  assert.strictEqual(M.attachMedia(two, item("m-i3", "image", "jpg"), "x"), null);     // 2 open: nothing ticked for them
  assert.strictEqual(two.needs.some(function (n) { return n.done; }), false);
  assert.deepStrictEqual(M.tickable(two).map(function (n) { return n.id; }), ["a", "b"]);
  assert.strictEqual(two.media.length, 1);                                              // media list created when missing
});
check("undoing an add removes the files and opens the ticked need again", function () {
  const post = { media: [], needs: [{ id: "n1", type: "photo", text: "Add a photo", done: false }] };
  const added = item("m-i1", "image", "jpg");
  const ticked = M.attachMedia(post, added, "x");
  M.undoAttach(post, [added.id], [ticked.id]);
  assert.deepStrictEqual(post.media, []);
  assert.strictEqual(post.needs[0].done, false);
});
check("remove takes a file off the post, restore puts it back where it was", function () {
  const post = { media: [item("m-a", "image", "jpg"), item("m-b", "image", "jpg"), item("m-c", "video", "mp4")] };
  const gone = M.detachMedia(post, "m-b");
  assert.deepStrictEqual(post.media.map(function (m) { return m.id; }), ["m-a", "m-c"]);
  M.restoreMedia(post, gone.item, gone.at);
  assert.deepStrictEqual(post.media.map(function (m) { return m.id; }), ["m-a", "m-b", "m-c"]);
  M.restoreMedia(post, gone.item, gone.at);   // twice does not duplicate it
  assert.strictEqual(post.media.length, 3);
  assert.throws(function () { M.detachMedia(post, "nope"); }, /no longer/);
});
check("make cover and reorder change the order", function () {
  const post = { media: [item("m-a", "image", "jpg"), item("m-b", "image", "jpg"), item("m-c", "image", "png")] };
  M.makeCover(post, "m-c");
  assert.deepStrictEqual(post.media.map(function (m) { return m.id; }), ["m-c", "m-a", "m-b"]);
  assert.strictEqual(M.cover(post).id, "m-c");
  M.moveMedia(post, "m-c", "m-b");
  assert.deepStrictEqual(post.media.map(function (m) { return m.id; }), ["m-a", "m-c", "m-b"]);
  M.moveMedia(post, "m-a", null);
  assert.deepStrictEqual(post.media.map(function (m) { return m.id; }), ["m-c", "m-b", "m-a"]);
  assert.strictEqual(M.mediaWords({ media: [item("m-a", "image", "jpg"), item("m-b", "image", "jpg"), item("m-c", "video", "mp4")] }), "2 photos and 1 video");
});

check("todoTotal adds every To do group", function () {
  assert.strictEqual(M.todoTotal({ overdue: [1, 2], today: [], week: [3], later: [4, 5, 6] }), 6);
  assert.strictEqual(M.todoTotal({ overdue: [], today: [], week: [], later: [] }), 0);
});
check("postsOnDays counts posts on the given days and skips skipped ones", function () {
  const data = { posts: [{ date: "2026-10-26", status: "drafted" }, { date: "2026-10-27", status: "approved" }, { date: "2026-10-27", status: "skipped" }, { date: "2026-11-09", status: "drafted" }] };
  assert.strictEqual(M.postsOnDays(data, ["2026-10-26", "2026-10-27", "2026-10-28"]), 2);
  assert.strictEqual(M.postsOnDays(data, []), 0);
});
check("averagePercent is a whole number, 0 when nothing is uploading", function () {
  assert.strictEqual(M.averagePercent([]), 0);
  assert.strictEqual(M.averagePercent([{ percent: 10 }, { percent: 25 }]), 18);
});

console.log(passed + " checks passed");
