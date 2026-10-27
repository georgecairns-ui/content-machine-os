# Maintaining Content Machine OS

For people developing the kit itself. Customers never need this folder, but it is public on GitHub, so keep it free of anything private.

## What this project is

Content Machine OS is tool 5 of the small business toolkit, built the same way as Task List OS (the reference build), Pipeline OS and Skill and Folder Map OS. A small business owner asks Claude to clone it, opens it in Claude Code and types `/setup`. It plans a business's posts from what its customers search for and what works for its competitors, writes them in the owner's voice, scores each one for each platform and leaves every post for the owner to approve and post themselves.

- **Claude never posts.** "Automatic" on a post means Claude finishes and approves it without asking. "Ask me first" means it waits for the owner's Approve. Either way the owner posts it, from To do (and Task List OS when attached), with a Copy button, an "Open <platform>" button and "I've posted it". Nothing in the kit posts, schedules, messages, follows, likes or logs in anywhere.
- **Words plus a shot list.** Claude writes captions, scripts, posts and emails and a picture or video idea. Photos and videos are To do items for the owner. No image generation.
- **Research is the public web only** (search suggestions, "people also ask" style questions, public forums, local news, public competitor pages), through WebSearch and WebFetch.

`maintainers/SPEC.md` is the build spec (data shape, pages, score, skills, setup, attaching). `maintainers/BUILD-PROMPT.md` has George's brief and the earlier 7 October prompt. Where the spec and a reference kit differ, the reference kit's pattern was copied and the spec notes it.

The tool's id is `content`, its folder is `apps/content/`, its code namespace is `window.CM`, its sidebar icon is `megaphone` and its repository is `content-machine-os`.

## Stack

- Same as the other toolkit OSs: no framework, no build step, nothing from the internet. Shared parts (`apps/server/`, `apps/shared/`, `apps/home/`, `ATTACHING.md`, `setup/scripts/`, `setup/connections/`, and the shared skills listed in `SHARED-V3-CHANGES.md`) are copied byte for byte from Task List OS. **Never change them here: change them in Task List OS first, raise the shared version, then copy the change to every tool.** `SHARED-V3-CHANGES.md` through `SHARED-V11-CHANGES.md` are the exact record of what's shared and what each tool keeps for itself; read them in order. The shared parts here are at shared version 11 (`apps/shared/VERSION`). **Exception, 21 October 2026:** shared version 7 (the helper's photo and video routes) was made in this kit first, at George's request. It was copied to Task List OS and the other tools in their next release (`SHARED-V7-CHANGES.md` says how). The one deliberate exception is the `content` entry's description in `apps/shared/catalogue.json`: see `SHARED-CATALOGUE-RENAME.md`.
- `apps/content/` is this tool's own folder: `index.html`, `menu.json` (the pages and the Home scripts), `home-boxes.js` (4 boxes, all off to start), `claude-jobs.json` (the 3 jobs below), `CLAUDE.md` (Claude's reference for the data), `ATTACH-CLAUDE.md` (what's copied into another folder's `CLAUDE.md` when attached) and `data/content.json`.
- `apps/content/app/`: `model.js` (pure functions, no DOM, also runs under Node: `PLATFORMS`, `score`, `bestPlatform`, `recommended`, `postStatus`, `todo`, `stats`, `health`, `weeklyPosted`, `preview`, `postsForDay`, `weekDays`, `monthGrid`, `newPost`, `postFromIdea`, `charCount`), `components.js`, `calendar.js` (the month and week), `hovercard.js` (the scores card), `drawer.js` (the post editor), `settings.js` (the Settings pop-up), the `view-*.js` views (To do, Ideas, Research, Platforms, Health check) and `app.js` (the rail and the one page), with `app.css` and `views.css`. Every number the app shows is worked out in `model.js` from the raw data, never typed.
- There is no demo mode (shared version 6 removed it from every tool): a fresh install shows a "Let's set up your content machine" card on Calendar and the first Home box, with the phrase to say to Claude.
- Platform tags are coloured 2 letter badges drawn with CSS from theme variables, never platform logos. Each platform's hue is defined once in `apps/content/app/app.css`, in both the light and dark sets.

## The data file

One file, `apps/content/data/content.json`. Its shape is in `SPEC.md` and in `apps/content/CLAUDE.md`. It ships empty, exactly as `SPEC.md` shows it, and the release check refuses anything else. 3 owners write to it:

| Section | Who writes it |
|---|---|
| `settings` | The app (Settings) and setup. Claude fills `businessName`, `ownerName`, `about` and `themes` during setup only |
| `platforms` | The person (the Platforms page, setup). Claude sets only `recommended` and `why` |
| `research` | Claude (`research-my-market`, `build-my-content-skill`) |
| `ideas` | The app, the person (brain dump, "Add an idea") and Claude (`turn-this-into-posts`, `plan-my-content`, `sort-content-brain-dump`). Dropping never deletes |
| `posts` | The app and Claude. Claude fills `platforms.<key>.text`, `factors`, `reason`, `shot`, `needs`, and sets `status` per `approval`. The app sets `postedAt`, `posted`, `approvedAt` on Approve and `request` when a button asks for a job |
| `activity` | Both, newest first, capped at 200 by the app |

**Rule for Claude: never write a score total.** Claude fills the 5 factors (`fit`, `demand`, `hook`, `proof`, `timing`, each 0, 1 or 2) and a one-line `reason`. `CM.model.score` adds them up. A platform scoring 7 or more is "recommended" for the post.

## The 3 Claude jobs

Defined in `apps/content/claude-jobs.json` (the shared job mechanism from `SHARED-V4-CHANGES.md`: the app asks `POST /api/claude/run/content/<job>` with only the job's name; the words Claude follows live in this file, never in the request). Each is also a skill in `.claude/skills/<name>/SKILL.md` so it works the same whether the app triggers it or the person just asks Claude. Every prompt ends "Change nothing else."

- **`research-my-market`** (Refresh research): public web only. Fills `research`, sets `platforms.<key>.recommended` and `why`, adds up to 5 ideas for high demand searches, then runs `build-my-content-skill`.
- **`plan-my-content`** (Plan next 2 weeks; the label uses `settings.planWeeks`): fills the next weeks without touching existing posts, hits each platform's `perWeek`, writes the words for every post, including ones that need a photo or video (those needs stay open); only posts that need a case study or information from the person wait for their answer.
- **`write-posts`** (Ask Claude to write it, Ask Claude to change it, Send to Claude on a case study): for every post with a `request`.

The other skills are for asking in chat: `turn-this-into-posts`, `use-my-case-study`, `content-check-in`, `ive-posted-it`, and `sort-content-brain-dump` (called by the shared `sort-brain-dump`). What each platform allows and rewards lives once in `.claude/skills/write-posts/references/platforms.md`; keep it conservative and never add a statistic.

## The skill Claude builds for the customer

`build-my-content-skill` writes `.claude/skills/<business-slug>-what-works/SKILL.md` and a zip in `skills-to-upload/`, the same way Task List OS's build-your-skills step does. **Neither ever ships:** `.gitignore` ignores `.claude/skills/*-what-works/` and `skills-to-upload/*.zip`, and the release check refuses them. `.claude/settings.json` lets Claude write to those paths and to `apps/content/data`, `apps/home/data`, `context`, `files` and `setup/progress.md`, plus WebSearch and WebFetch. It pre-approves nothing that sends, posts or deletes.

## Attaching

`toolkit.json` and `apps/content/ATTACH-CLAUDE.md`. Reads: Pipeline OS won deals (each new win becomes an idea with `source: "pipeline"` and a case-study need) and `context/voice.md`. Sends to Task List OS: posts due today and every open need, as suggested tasks in the task list's own format, with `"source": { "tool": "content", "id": ... }`, waiting for the person's click. Content Machine OS never edits another tool's records.

## How the release works

`bash maintainers/make-release.sh` from the repo root runs `node maintainers/test-model.js`, builds `dist/content-machine-os.zip`, a clean copy for a customer to download: it checks every file that ships is still a blank template (the data file must equal the empty file in `SPEC.md`; `context/content.md` and every other context file blank; no `*-what-works` skill; no zip in `skills-to-upload`; no demo code; nothing that sends or posts pre-approved), copies the kit into a folder called "Content Machine OS" leaving out this `maintainers/` folder and clutter, runs the checks again on the copy plus structural ones (every file that must exist, every JSON file that must parse, every skill in `toolkit.json` present with a matching name, the 3 jobs pointing at real skills, the app's scripts syntax-check cleanly, no em dash, no banned word, no old tool name in the files this tool owns), then zips it. `dist/` is git-ignored. Publishing follows the other tools: a `claude/...` branch from `origin/main`, the release script run and passing, a pull request into `main`, never a direct push or a force push.

## Rules

- Anything committed ships, so never commit a filled-in `context/`, a non-empty data file, a ticked `setup/progress.md`, "Setup: complete" in `CLAUDE.md`, a `-what-works` skill or a zip in `skills-to-upload`.
- No prices for Get AI Powers services anywhere (point to getaipowers.com), no em dashes, British English, digits for numbers, no "delve", "game-changer", "unlock", "elevate" or hype. Customer-facing words never say agent, repo, repository, artifact, JSON, schema, API or MCP.
- Claude never posts, messages, follows, likes or logs in. Research reads public pages only, and says so when a platform blocks reading.
- Claude never invents proof: no results, numbers, statistics, quotes or customer names. Missing facts become a need for the owner.
- Every number on screen is worked out in `model.js` from the data. Claude writes only the 0 to 2 factors.
- Claude proposes, the person approves: an "Ask me first" post waits for Approve, and every post is posted by the person.
- Never delete files. Move them to `files/99-archive/` (or `_archive/` for build files) and say so.

## Open questions for George

- `ATTACHING.md`'s toolkit table row for this tool carries the old description; the catalogue entry here has the new one (see `SHARED-CATALOGUE-RENAME.md`). The change needs making in Task List OS first, then copying to every tool.
- Shared skill `match-my-brand` still says "during setup (step 5)", written for the shared template. In this kit the brand step is step 1. It's a shared file, so the fix belongs in Task List OS first.
- Decided: `plan-my-content` writes the words for every post it plans, including ones that need a photo or video (the caption is written and the need stays open). Only a post that needs a case study or information from the owner stays an idea with no words until they answer, and `write-posts` picks it up when it's asked, or inside 7 days of the post date. Still open: `turn-this-into-posts` step 4 still writes only when nothing is needed from the owner; align it if owners expect the same there. Watch how often owners find a caption written before the photo no longer fits the photo they take.
- Research can only read what a platform shows without a login. For many Instagram and Facebook profiles that is very little, and the skill says so plainly. Worth watching how often that happens on real runs.
- The platform limits and "what each rewards" notes in `platforms.md` are general guidance, not checked against each platform's current help page. Worth a check before each release.
