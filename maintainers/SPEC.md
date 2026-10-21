# Content Machine OS: build spec

Written 20 October 2026 from George's brief (`maintainers/BUILD-PROMPT.md`). Every builder works from this file. If the reference kit (Skill and Folder Map OS, `~/Repos/getaipowers/skill-map-os`, or Proposal OS, `~/Repos/getaipowers/proposal-os`) does something differently, copy the reference kit's pattern and note it here.

Tool id `content`, name **Content Machine OS**, folder `apps/content/`, data file `apps/content/data/content.json`, code namespace `window.CM`, sidebar icon `megaphone`, repository `content-machine-os`, shared version 7.

## George's decisions (20 October 2026)

1. **Claude never posts.** "Automatic" on a post means Claude finishes and approves it without asking. "Ask me first" means it waits in Review for the owner's Approve. Either way the owner posts it: on the day it shows in To do (and in Task List OS when attached) with a Copy button and an "Open <platform>" button, then "I've posted it".
2. **Words plus a shot list.** Claude writes captions, scripts, posts and emails, plus a picture or video idea. Photos and videos are To do items for the owner ("Add a photo of the finished patio", "Record a 30 second video"). No image generation.
3. Demo artifact uses Fern & Finch (2 person design studio in Bristol), same as the other demos. Its booking button goes to Joey: `https://calendly.com/joey-getaipowers/claude-chat`. The kit itself keeps the catalogue's booking link (never changed per tool).
4. Same framework, look, helper, setup style and wording rules as the other toolkit OSs.

## Wording rules (customer-facing text, and code comments)

British English. Digits for numbers. No em dashes anywhere. Never say agent, repo, repository, artifact, JSON, schema, API, MCP on screen. No "delve", "game-changer", "unlock", "seamless", "leverage", no hype, no lists of 3 for effect. No prices for Get AI Powers services; point to getaipowers.com only. No demo mode or sample data in the kit (shared v6 rule).

## The platforms

One list, in `apps/content/app/model.js` as `CM.PLATFORMS` (order matters, it's the display order). Customisable labels live here and are documented in `docs/CUSTOMISING.md`.

| key | label | short | limit (characters) | open link | formats |
|---|---|---|---|---|---|
| `instagram` | Instagram | IG | 2200 | https://www.instagram.com/ | photo, carousel, reel, story |
| `tiktok` | TikTok | TT | 4000 | https://www.tiktok.com/upload | video |
| `linkedin` | LinkedIn | in | 3000 | https://www.linkedin.com/feed/?shareActive=true | text, photo, carousel, video |
| `facebook` | Facebook | FB | 63206 | https://www.facebook.com/ | text, photo, video, reel |
| `youtube` | YouTube Shorts | YT | 100 (title) | https://studio.youtube.com/ | video |
| `google` | Google Business Profile | GB | 1500 | https://business.google.com/ | update, offer, event |
| `x` | X | X | 280 | https://x.com/compose/post | text, photo |
| `email` | Email newsletter | EM | none | (none) | email |

Badges are coloured 2-letter tags drawn with CSS from theme variables, never platform logos (trademarks, and nothing is loaded from the internet). Give each platform a distinct hue via a CSS variable defined in the tool's own `app/app.css` that reads from theme tokens where possible; if a platform hue isn't in `theme.css`, define it once in `app.css` under `:root` and `[data-theme="dark"]` with a comment, never inline in JavaScript.

## The score (app-calculated, never typed by Claude)

For each post on each platform Claude fills 5 factors, each 0, 1 or 2:

| factor | meaning |
|---|---|
| `fit` | the format suits this platform (a 30 second how-to video suits TikTok; a long text post doesn't) |
| `demand` | people are searching for or talking about this topic (from Research) |
| `hook` | the first line or first 2 seconds stop the scroll |
| `proof` | it matches what works for competitors on this platform (from Research), or carries real proof: a photo of real work, a number, a customer's words |
| `timing` | in season, trending now, or tied to a date |

`CM.model.score(platformEntry)` returns the sum (0 to 10), or `null` if any factor is missing. The editor shows the 5 factors and Claude's one-line `reason`. "Best on" for a post = the on-platform with the highest score (ties: platform order). "Recommended platforms" for a post = platforms scoring 7 or more. Claude may fill factors for platforms that aren't switched on yet, so the editor can say "Also good on TikTok, 8/10".

## Data file: `apps/content/data/content.json`

Ships as exactly this (empty, no records):

```json
{
  "version": 1,
  "settings": {
    "businessName": "",
    "ownerName": "",
    "about": { "sells": "", "problems": [], "different": "", "who": "", "where": "" },
    "themes": [],
    "postsPerWeek": 3,
    "defaultApproval": "ask",
    "defaultTime": "09:00",
    "weekStarts": 1,
    "planWeeks": 2
  },
  "platforms": {},
  "research": { "updatedAt": null, "skill": "", "searches": [], "trends": [], "competitors": [], "whatWorks": {} },
  "ideas": [],
  "posts": [],
  "activity": []
}
```

Shapes (every id from `ui.makeId`, every date `YYYY-MM-DD`, every timestamp ISO):

- `platforms.<key>`: `{ "on": true, "handle": "@fernandfinch", "url": "", "perWeek": 2, "recommended": true, "why": "one line from Claude" }`. A missing key means off.
- `research.searches[]`: `{ id, phrase, why, demand: "high"|"medium"|"low", season: "" , source: "where Claude saw it, plain words" }`
- `research.trends[]`: `{ id, title, why, until: date|null, platforms: [keys] }`
- `research.competitors[]`: `{ id, name, url, platforms: [keys], whatWorks: "plain sentences", examples: [{ platform, what, why }] }`
- `research.whatWorks.<key>`: plain paragraph on what goes well in this industry on that platform.
- `research.skill`: name of the business skill Claude built, for example `fern-and-finch-what-works`.
- `ideas[]`: `{ id, title, notes, source: "research"|"brain-dump"|"you"|"pipeline"|"whats-new"|"case-study"|"claude", theme, createdAt, status: "new"|"planned"|"dropped", postId: null }`. Dropping never deletes.
- `posts[]`:

```json
{
  "id": "p_x", "ideaId": null, "title": "Before and after: the Clifton café menu",
  "theme": "Real work", "date": "2026-10-22", "time": "09:00",
  "approval": "ask",
  "status": "idea",
  "platforms": {
    "instagram": { "on": true, "format": "carousel", "text": "", "factors": { "fit": 2, "demand": 1, "hook": 2, "proof": 2, "timing": 1 }, "reason": "", "postedAt": null, "link": "" }
  },
  "shot": "Photo idea: the old menu and the new one side by side on the café counter.",
  "needs": [ { "id": "n_x", "type": "photo", "text": "Add a photo of the new menu on the counter", "due": "2026-10-21", "done": false, "answer": "" } ],
  "request": null,
  "createdAt": "", "updatedAt": "", "approvedAt": null
}
```

  - `status`: `idea` (no words yet), `drafted` (words written, waiting for Approve), `approved`, `posted` (every on-platform has `postedAt`), `skipped` (hidden, never deleted). Shown status "Needs you" is derived: any need not done. The app sets `posted` itself when the last on-platform gets `postedAt`.
  - `approval`: `ask` or `auto`. With `auto`, the write-posts skill sets `status: "approved"` and `approvedAt` when it finishes. With `ask`, it sets `drafted`.
  - `needs[].type`: `photo`, `video`, `case-study`, `quote`, `info`, `other`. A need with `type: "case-study"` or `"info"` is answered in the app (`answer` text); the app then sets `done: true` and a `request` so Claude writes the post.
  - `request`: `null` or `{ "kind": "write"|"rewrite"|"case-study", "note": "", "at": iso }`. The app sets it and calls the `write-posts` job. Claude clears it when done.
- `activity[]`: `{ at, what, postId }`, newest first, cap 200 (app trims).

`validate(d)` in the store throws a plain message if `posts`, `ideas` or `platforms` is the wrong type.

## Pages (sidebar, `menu.json`)

| id | label | icon | what |
|---|---|---|---|
| `calendar` | Calendar | `calendar` | Week and month views with drag and drop (the main page) |
| `todo` | To do | `checkSquare` | Everything waiting on the owner. Accent count = items due today or overdue |
| `ideas` | Ideas | `sparkle` | Ideas bank and brain dump |
| `research` | Research | `search` | What people search for, trends, competitors, what works |
| `platforms` | Platforms | `megaphone` | Turn platforms on, add links, see recommendations |
| `scorecard` | Scorecard | `barChart` | Posted against plan |
| `preferences` | Preferences | `settings` | Business words, defaults |

Home boxes (`home-boxes.js`, all `defaultOn: false`): "Posting today" (size 1), "Waiting on you" (size 1, needs and approvals), "This week's posts" (size 2, 7 mini day columns), "Content scorecard" (size 1). Before setup the first box shows the setup card.

### Top bar (every page)

Page name, a short line, Brain dump button and Claude status pill (shared v5), light/dark switch. On Calendar also: Week | Month segmented switch, previous, Today, next, platform filter chips, and **Plan next 2 weeks** (primary button, runs `plan-my-content`; label uses `settings.planWeeks`).

### Setup card (shared v6)

Before setup (no `settings.businessName` and no posts): Calendar and the first Home box show "Let's set up your content machine": open this folder in the Code tab of the Claude desktop app and type `/setup`, with a copy button. Every other empty state says what fills it.

### Calendar

- **Week**: 7 columns from `settings.weekStarts` (1 = Monday). Today's column carries the accent. Each column lists that day's posts by time. A drop on a column sets `date`. A small "+" on a column adds a blank post that day and opens the editor.
- **Unplanned tray**: above the week on phones, a left column on wide screens: posts with `date: null` and ideas with status `new` (ideas show as dashed cards). Dropping an idea on a day creates a post from it (`ideaId`, `title`, `theme`, status `idea`, platforms = recommended or every on-platform, approval = `settings.defaultApproval`) and marks the idea `planned`. Dropping a post on the tray sets `date: null`.
- **Month**: a 7 by 5 or 6 grid with compact chips (time, short title, platform tags). Drag works the same. Clicking a day number switches to that week.
- **Card**: title (2 lines max), time, platform tags (only on-platforms), the best score as "9/10" on the best platform's tag, status pill (Idea, Drafted, Needs you, Approved, Posted), small icons for open needs (camera for photo, video for video, file for case study), "Auto" tag when `approval: "auto"`. Every card is the same height in week view.
- **Drag and drop**: HTML5 drag events for mouse; for touch and keyboard, each card has a "Move" button opening a small date picker (and "Unplanned"). Dragging shows a drop highlight; the change saves through `store.update()` and logs to `activity`. A toast offers Undo.
- Filter chips hide cards that have none of the selected platforms. Choice remembered in localStorage (wrapped in try/catch).
- No sideways scrolling: container queries as in shared v6 (7 columns wide; under 1000 pixels 2 columns of days; under 560 one list of days).

### Post editor (side drawer, opens from any card, `#calendar/post/<id>` not required)

- Title, date (with "Unplanned"), time, theme (from `settings.themes`), and a 2-way switch **Ask me first | Automatic** with one line explaining that Claude never posts either way.
- **Platforms row**: a toggle per platform that's on in `platforms`, plus **All** and **Recommended** (score 7 or more). Off-platforms with a score show "Also good on TikTok, 8/10" as a link that switches it on.
- For each on-platform, a tab: format select (from the table), textarea, character count against the limit (warning colour over the limit, YouTube counts the first line as the title), score badge with the 5 factors and the reason, **Copy**, **Open <platform>** (opens the link in a new tab), **I've posted it** (sets `postedAt`, optional link box).
- **Shot list**: the `shot` note, editable.
- **What Claude needs from you**: the needs list, tick to mark done, add one, and for case-study and info needs a text box ("Tell Claude about the job: who, what you did, the result") with **Send to Claude**.
- Buttons: **Ask Claude to write it** (status idea, sets `request.kind = "write"`), **Ask Claude to change it** with a note box (`rewrite`), **Approve** (status drafted to approved, `approvedAt`), **Skip this post** (status skipped, with Undo). Every Claude button calls the `write-posts` job and shows the shared Claude status pill. If the job answers 503, say plainly: "Claude isn't switched on for the app. Open the folder in Claude and say: write my waiting posts."

### To do

Grouped Overdue, Today, This week, Later. Item types, derived by `CM.model.todo(data, today)`:
1. Open needs (photo, video, case study, quote, info) with their due date (default: the post's date minus 1 day).
2. Drafted posts waiting for Approve ("Check and approve: <title>"), due on the post date.
3. Approved posts due today or overdue, one row per on-platform not posted: Copy, Open <platform>, I've posted it.
Each row opens the post editor. The case study rows have the answer box inline.

### Ideas

The ideas bank: new ideas as cards (title, notes, source tag, theme), filters by source and theme, "Plan it" (opens a date picker and creates the post), "Drop" (status dropped, Undo). An "Add an idea" box. The shared Brain dump button; the tool registers a picker "An idea or post…" with `brainDump.register("content", ...)`.

### Research

Last updated date, **Refresh research** (runs `research-my-market`). Sections: What people are searching for (phrase, demand pill, season, why, **Make it an idea**), In season and trending (title, why, until, platforms), Your competitors (cards: name, link, platform tags, what works, examples), What works on each platform (one card per on-platform from `whatWorks`), and the name of the skill Claude built. Empty state: "Claude fills this during setup, and again when you press Refresh research."

### Platforms

A card per platform in the list: on/off switch, handle and link inputs, posts a week (number), "Recommended for you" tag with Claude's `why`, and "Posted this month: N". A line under the title: the plan is `sum(perWeek)` posts a week across platforms, worked out by the app.

### Scorecard

Computed by `CM.model.scorecard(data, today)` for the current month: posts planned, approved, posted; posted against target (target = sum of on-platform `perWeek` x weeks in the month so far, rounded); a bar per platform; weeks in a row that hit the weekly target; the average score of posted posts. Every number from the data, nothing typed by Claude.

### Preferences

Business name, posts a week, default approval, default time, week starts on, how many weeks Plan fills (1 to 4), themes (add, rename, remove; 3 to 5 recommended).

## Claude jobs: `apps/content/claude-jobs.json`

| job | label | prompt points at |
|---|---|---|
| `research-my-market` | researching what your customers search for | `.claude/skills/research-my-market` |
| `plan-my-content` | planning your next posts | `.claude/skills/plan-my-content` |
| `write-posts` | writing your waiting posts | `.claude/skills/write-posts` for posts with a `request` |

Each prompt ends "Change nothing else." and keeps to the tool's own data file, its own skills folder entry (research builds one skill) and `context/`.

## Skills (`.claude/skills/`), triggered by what people say

Shared (copied unchanged from the template): `connect-a-tool`, `file-it`, `human-email`, `keep-context-fresh`, `match-my-brand`, `open-task-list`, `polite-chaser`, `setup`, `sort-brain-dump`, `write-like-me`.

The tool's own:

| skill | people say | does |
|---|---|---|
| `research-my-market` | "research my market", "what are people searching for", "refresh my research", "look at my competitors" | Uses WebSearch and WebFetch on public pages only (search suggestions, "people also ask", forums, public competitor profiles and websites). Fills `research`. Then runs `build-my-content-skill`. Never logs in anywhere, never follows or messages anyone |
| `build-my-content-skill` | "update what works for us" | Writes `.claude/skills/<business-slug>-what-works/SKILL.md` (what the audience searches for, what goes viral in the industry per platform, hooks that work, formats, posting rhythm, words to avoid) and a zip in `skills-to-upload/` for the Claude app, the same way Task List OS's build-your-skills step does. Sets `research.skill` |
| `plan-my-content` | "plan my content", "plan next week", "fill my calendar" | Fills `settings.planWeeks` weeks from the next empty day: hits each platform's `perWeek`, mixes themes, uses research and new ideas first, sets dates and times, platforms, approval from settings, `shot`, `needs` (what the owner must supply), factors and reason for every platform. Doesn't overwrite posts that already exist. Writes the words straight away for every post, including ones that need a photo or video (the caption is written and the photo or video stays a need); only a post that needs a case study or info from the owner stays `idea` with no words until they answer (status drafted, or approved if auto) |
| `write-posts` | "write my waiting posts", "write this up" | For posts with a `request` (or the one named): writes each on-platform version in the owner's voice using `write-like-me` and `context/voice.md` plus the what-works skill, fits each platform's limit and format, fills factors and reason, adds needs if something real is missing (a case study, a photo), sets status per `approval`, clears `request` |
| `turn-this-into-posts` | "I've got an idea", "turn this into a post", "make this into content" | Takes what the person says (or a file, a win, a review) and adds an idea or a planned post |
| `use-my-case-study` | "here's a case study", "write up this job" | Turns the story into posts for the right platforms, asks for a photo if there isn't one, answers any open case-study need |
| `content-check-in` | "what's due today", "what do I need to post", "what's outstanding" | Reads To do the same way the app does and says it in plain words |
| `ive-posted-it` | "I've posted it", "that's gone out" | Sets `postedAt` (and link if given) on the matching post and platform |
| `sort-content-brain-dump` | (called by `sort-brain-dump`) | Turns brain dump notes about content into ideas or posts |

Every skill: plain English, reads `context/` first, writes only through the data file (keeping the shape above, appending to `activity`), never posts, never messages, never logs in. Platform rules (limits, formats, what each platform rewards) live once in `.claude/skills/write-posts/references/platforms.md`; other skills point to it. The anti-AI-voice rules: copy the approach of `human-email`, written generically for the customer (no em dashes, no "delve", no lists of 3, no hype, no hashtag walls, no emoji strings).

## Setup (`setup/`)

`setup/progress.md` and the shared `setup` skill list these steps in order:
1. Shared steps from the template (connect, get to know the business with the brand step, voice via `write-like-me`), kept as they are in the template.
2. `setup/content-01-your-business.md`: what you sell, the problems you solve for customers, what makes you different, who your customers are, where you work (town or "online, UK wide"). Saves to `context/content.md` and `settings.about`, and 3 to 5 themes.
3. `setup/content-02-your-platforms.md`: which platforms, handle or link for each, a realistic posts-a-week each. Saves `platforms`. Claude says which it recommends and why.
4. `setup/content-03-research.md`: competitors (asks for 3 to 5 names or links; suggests some if the person has none), then runs `research-my-market`.
5. `setup/content-04-first-plan.md`: approval default, then runs `plan-my-content` and opens the Calendar.
6. `09-check-and-hand-over.md` adapted.

## Context

New `context/content.md` (template with headings only): What we sell, Problems we solve, What makes us different, Who we serve, Where, Themes, Competitors. Other context files stay as in the template.

## Attaching (`ATTACH-CLAUDE.md`, `toolkit.json`)

- Reads: Pipeline OS won deals (each new win becomes an idea with `source: "pipeline"` and a case-study need), What's New in Claude OS updates worth posting about (`source: "whats-new"`), `context/voice.md`.
- Sends to Task List OS: posts due today ("Post to Instagram: <title>") and every open need ("Record a video for Tuesday's TikTok"), written the way Pipeline OS writes tasks into Task List OS (copy its `ATTACH-CLAUDE.md` pattern), waiting for the person's click.
- `catalogue.json`: change only the `content` entry's description, in this kit only, to: "Plans your posts from what your customers search for and what works for your competitors, drafted in your voice and scored for each platform. You approve every post and post it yourself." Note it in `maintainers/SHARED-CATALOGUE-RENAME.md` like the other kits.

## Settings (`.claude/settings.json`)

Allow `Read(./**)`, Edit and Write on `./apps/content/data/**`, `./apps/home/data/**`, `./context/**`, `./files/**`, `./skills-to-upload/**`, `./.claude/skills/*-what-works/**`, Edit `./setup/progress.md`, `WebSearch`, `WebFetch`, and the start scripts. Nothing that sends, posts or deletes.

## Files and layout

```
apps/content/
  CLAUDE.md  ATTACH-CLAUDE.md  claude-jobs.json  menu.json  home-boxes.js  index.html
  data/content.json
  app/ app.css app.js model.js components.js calendar.js drawer.js
       view-todo.js view-ideas.js view-research.js view-platforms.js view-scorecard.js view-preferences.js
```

`model.js` is pure functions only (no DOM), exposed on `window.CM.model`, so `home-boxes.js` and the views share one set of rules: `PLATFORMS`, `score`, `bestPlatform`, `recommended`, `postStatus`, `todo`, `scorecard`, `postsForDay`, `weekDays`, `monthGrid`, `newPost`, `postFromIdea`, `charCount`. It also runs under Node for tests (`if (typeof module !== "undefined") module.exports = ...`).

Release check (`maintainers/make-release.sh`): adapt to `apps/content/data/content.json` (must equal the empty file above), refuse filled `context/content.md`, any `*-what-works` skill folder, `skills-to-upload/*.zip`, demo code, real data.

## Tests

`maintainers/TESTING.md` adapted. Plus `maintainers/test-model.js`: plain Node assertions for `score`, `todo`, `scorecard`, `postStatus`, `monthGrid`, run with `node maintainers/test-model.js`.

## Redesign, 20 October 2026 (George, after seeing a partner's content calendar)

This section overrides the Pages section above where they differ. Reference look: the LinkedIn content calendar a partner built for Get AI Powers (one page, a rail of segmented tabs at the top, a stats strip, a month grid of chips with a coloured left edge, a Health check view).

- **One page.** `apps/content/index.html` is a single page. Under the top bar sits a **rail**: on the left a segmented switch **Calendar | To do | Ideas | Research | Platforms** (To do shows its count) and a **Health check** button; on the right, for Calendar: Week | Month, previous, the month or week label, next, Today, **Plan next 2 weeks**, **New post** (primary). A small **Settings** button (gear) opens a dialog with the business settings (business name, first name, posts a week, default approval, default time, week starts, weeks Plan fills, themes). There is no Preferences page and no Scorecard page.
- **Stats strip** under the rail on Calendar: Posted this month (of target), Planned ahead (weeks), Waiting on you, Average score. Each is a button that jumps to the matching view or filter. All numbers from `model.js`.
- **Calendar**: month view is the default (like the reference); week view stays. Post chips: a coloured left edge for the best platform, time, title, platform tags, status dot, need icons. **Hover (and keyboard focus) shows a small card**: status, each on-platform with its score out of 10 and the one-line reason. **Click opens the post** (the drawer) where everything is edited in place: title, date, time, approval, platforms, each platform's words, the shot list and needs, and the full score breakdown (the 5 factors per platform, a bar each). A small preview of how the post reads on that platform (name, text cut at the platform's "see more" point) sits above each platform's words.
- **Health check** (a view in the same page): 4 to 6 checks, each Healthy, Watch or Needs action with a value and a target line, worked out by the app: posting rhythm (posted per week over the last 4 weeks against the weekly target), planned ahead (weeks of posts in the calendar against `planWeeks`), waiting on you (open needs and drafts, overdue ones count double), average score of the next 2 weeks against 7, platform spread (every on-platform has a post in the next 2 weeks), theme mix (no theme above half of the next 2 weeks). Below: a simple bar chart of posts per week for the last 8 weeks against the target. No follower or engagement numbers: the kit doesn't read platform stats (say so in one line: "Reach and engagement numbers come later, once Claude can read your platform stats.").
- **Sidebar**: the tool shows one page, "Content calendar". The rail views have their own addresses (`#calendar`, `#todo`, `#ideas`, `#research`, `#platforms`, `#health`) so Home boxes can link straight to them.
- Platforms keeps the name **Platforms**.

## Photos and videos, 21 October 2026 (shared version 7)

The owner asked: people can click on the content and drag and drop content into the actual post, like from a folder; and see an image of the post when they hover over it in the calendar. Decision: the real files are saved on this computer through the helper (a shared part upgrade, version 7, made in this kit first; `maintainers/SHARED-V7-CHANGES.md`).

**The contract (a demo builder codes against it; keep it exact):**

- `post.media`: array, default `[]`, of `{ id, file, name, type: "image" | "video", size, addedAt }`. `id` is `m-` and 6 random lowercase letters or digits (from `makeId("m")`). `file` is the stored name, `id` plus the extension, for example `m-k3x9q2.jpg` (lowercase extension, `jpeg` is saved as `jpg`). `name` is the original file name. `size` is bytes, `addedAt` an ISO timestamp. Order is the order shown; the first image is the cover.
- `CM.model.mediaUrl(file)` returns `"/api/media/content/" + encodeURIComponent(file)`. Every place that shows media builds its `src` with it (photos, video frames, the lightbox, the previews).
- `CM.model.cover(post)` returns the first media item (an image if there is one, else the first video) or `null`.
- `normalise`: `media` missing or not a list becomes `[]`; an item without a valid stored file name (`^[a-z0-9][a-z0-9-]{0,60}\.(jpg|jpeg|png|webp|gif|mp4|mov|webm)$`) is dropped; the rest is filled in (`type` always follows the file ending).
- Other pure rules in `model.js`: `checkMediaFile` (type, size, plain-words message), `mediaItem`, `attachMedia` (adds it and ticks off the one open need of the matching kind, `photo` for an image and `video` for a video, when exactly one is open), `undoAttach`, `detachMedia` and `restoreMedia` (Remove from post, Undo), `makeCover`, `moveMedia`, `tickable`, `mediaWords`.

**The helper** (`apps/server/server.js` and `server.py`, the only shared parts changed): `PUT /api/media/<tool>/<name>` saves the raw bytes, `GET /api/media/<tool>/<name>` plays them back with Range support (206 for video). Only for a tool in `apps/installed.json` with `"media": true` (set on `content` there and in `toolkit.json`). The name must match the pattern above; the `Content-Type` must match the ending; same-origin checks as the data save; at most 200 MB (413, decided from the `Content-Length` header before anything is read); never overwrites (409); written to `apps/<tool>/data/media/<name>` through a `.saving` temporary file and a rename; answers 201 with `{ "file": name }`. A missing length is 411. There is no delete route and everything else stays refused. `maintainers/test-helper-media.js` checks all of it over http against both helpers.

**The app:**

- **Post editor** (`drawer.js`): a "Photos and videos" section right under the title, day, time and approval. A drop zone and **Add from your computer** (a file picker, several files, `image/*,video/*`); files can also be dropped anywhere on the open panel. Each file is checked (type, size) in `model.js`, saved by `media.js` as `m-<id>.<ext>` with a progress bar, then added with `ctx.update` and logged. Thumbnails in a grid (images as pictures, videos as their first frame with a play mark), drag to reorder (and earlier and later buttons for keyboard and touch), **Make cover** (images), **Remove from post** (unlinks only, with Undo, and the section says the file stays in the folder), click to view large in a simple pop-up (arrow keys step through, Escape closes). When a file answers an open photo or video need, that need is ticked off if it is the only one of its kind, otherwise a "Tick off: <need text>" button is offered for each. Errors are plain words in the section (too big, not a picture or video, HEIC photos, the helper not running). The platform preview shows the cover above the words.
- **Calendar** (`calendar.js`): a chip with media shows a small square cover beside the title in the month, and a 32 pixel strip along the top of the card in the week (every card in that week grows by the strip, so they stay the same height). Files dragged in from a folder and dropped on a post are added to it by the same code (`media.js`); a drag that carries `"Files"` in `dataTransfer.types` is told apart from a post being dragged, and a thin progress bar runs along a post while it saves. A file dropped anywhere else does nothing (the page never opens it).
- **Hover card** (`hovercard.js`): with a cover, about 260 pixels of post at the top (the business name, the cover or the video's first frame, the first lines of the words on the platform it scores best on) and then the scores as before. Without media the card is as before plus the shot list idea in italics.
- **To do**: a photo or video need has an **Add the file** button that opens the post at its photos and videos (`ctx.openPost(id, "media")`).

**Claude**: `write-posts` and `use-my-case-study` look at the attached pictures (image files in `apps/content/data/media/`) and use what is in them; `plan-my-content` adds no photo or video need to a post that already has one; `content-check-in` says when a need looks answered. Claude never adds, removes or reorders `media`, and never writes into the media folder.

**Release**: `apps/*/data/media/` is in `.gitignore`; `make-release.sh` refuses any file there except a `.gitkeep`, and checks that `media: true` is on the content tool in `apps/installed.json` and `toolkit.json`. The helper creates the folder on the first upload.
