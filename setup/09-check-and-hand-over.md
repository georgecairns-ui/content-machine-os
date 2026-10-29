# Step 6 of 6: check and hand over

Goal: prove it all works, then leave them with a clear picture of what's planned and what they need to do.

## 1. What good looks like

Check these yourself. Fix anything that fails, then check again.

- [ ] The app opens at **http://localhost:4747/content/**.
- [ ] The Calendar shows their real posts, with their real platforms and dates, not placeholder text.
- [ ] A post opens, shows each platform's version with its character count, and the Copy and Open buttons work. **I've posted it** marks it posted.
- [ ] To do lists what's waiting on them, grouped by when.
- [ ] Research shows what was found, with where each came from, and Platforms shows their choices.
- [ ] The **Plan next weeks** and **Refresh research** buttons can ask Claude to run a job. It needs Claude Code installed on this computer; if it isn't, the app says to ask Claude instead, rather than failing quietly.
- [ ] The app looks right in both light and dark (the moon or sun button at the top).
- [ ] Nothing secret (a password, a key, a code) is anywhere in this folder, and nothing was posted, sent or logged in to anywhere.
- [ ] Every platform they picked in step 3 has a row in `apps/home/data/connections.json` in a final status: `connected` with a `checked` date from this setup, `export-only`, `no-connector` or `needs-attention`, none left as `not-connected`. A `connected` one still reads now (one small read).

## 2. A weekly plan (their choice)

The tools named in this section are often not loaded yet: search your tools for them first.

### 2.1 Agree the day and time

Ask once, in plain words:

> Want me to plan the next weeks on my own once a week, so your calendar's always full? I'd only ever plan and write; you'd still approve and post everything. I'd suggest Fridays at 4pm, before your week ends. Shall I use that, or would another day or time suit you better?

Suggest the day and time from their working hours in `context/routines.md`. Say plainly: "It uses a little of your Claude allowance each time, and it only runs while your computer is on and the Claude app is open."

If they say no, note "Weekly plan: said no" in `setup/progress.md`, tell them they can say "plan my content" any time, and go to section 3.

### 2.2 Let it read without stopping

Each weekly run also does a content check-in, which reads every platform that's `connected` in `apps/home/data/connections.json` to keep that file true. A run that has to ask permission stops, and nobody is there to answer. If no platform is `connected`, there is nothing to allow: go to 2.3. Otherwise, with their yes, allow the read-only tools of each connected platform:

1. From your own list of tools, collect the names of that connection's read tools. These platforms have no guide in `setup/connections/`, so only names that start with `get_`, `list_`, `search_`, `read_`, `find_`, `fetch_` or `query_`, or end with `_search` or `_get`, and only if they only read. Never any name containing create, update, delete, send, mark, archive, add, remove, set, move, post, reply, label, trash or write, whatever else it matches.
2. Show them the list in one line per platform, for example: "LinkedIn: read your page and your posts." Ask: "Can I let the weekly plan do just these without asking each time?"
3. If they say no, tell them plainly: "Then the weekly plan will stop at each permission prompt. If you'd rather, say 'plan my content' whenever you want more weeks planned." Note "Weekly plan: said no" in `setup/progress.md`, leave out 2.3 and go to section 3.
   With a yes, add them to `permissions.allow` in this folder's `.claude/settings.local.json` (create it if it isn't there, as `{ "permissions": { "allow": [] } }`), using the full tool names as they appear in your list (they start `mcp__`). Never add anything that sends, replies, forwards, deletes, archives, labels, pays, posts, books or changes anything.

`.claude/settings.local.json` stays on this computer and is never part of an update.

### 2.3 Create the weekly plan

Create it from this session, in this folder: a scheduled task runs in the folder it was made in.

First look with `list_scheduled_tasks` for an existing weekly plan task for this folder. If there is one, update it to the agreed day and time rather than making another. If not, create it yourself with the desktop app's scheduled tasks tool (`create_scheduled_task`):
- **Title:** "<their business> weekly plan", for example "Fern & Finch weekly plan".
- **Prompt:** `In <full path of this folder>, run /plan-my-content, then /content-check-in: follow .claude/skills/plan-my-content/SKILL.md, then .claude/skills/content-check-in/SKILL.md. Never send anything except emails the person has already approved in the app; apart from those, never reply, forward, delete, archive, label, pay or post anything.` Fill in this folder's full path.
- **When:** the day and time they agreed, once a week.

Then run it once now (`run_scheduled_task`) and check it finished without stopping to ask anything (`list_task_runs`). With the first plan already in place it only fills gaps, so it adds little or nothing. If it stopped at a permission, ask the person before adding that tool, and only if it is read-only under 2.2's rule; then run it again. If the stop is at a tool that isn't read-only, tell them and leave it. Only ever one weekly plan task for this folder.

Then look up that first run's session with the desktop app's session tools (for example `get_session` with the run's session id) and check 2 things:
- **It ran in this folder.** If it ran somewhere else, delete nothing: update the task's prompt so it opens with this folder's full path, and run it again. If it still runs elsewhere, tell the person plainly that the weekly plan can't find this folder, and offer the alternative: they say "plan my content" whenever they want more weeks planned.
- **It didn't run in an Auto or Bypass permission mode.** If it did, tell the person in one line: "This session is set to act without asking, so the weekly plan would too." Then ask them to switch this session to the normal permission mode, where Claude asks first. Once it is switched, delete that weekly plan task and create it again from this session, so there is still only one. (The "delete nothing" rule above is only for the wrong-folder case.)

### 2.4 Record it

Check that `list_scheduled_tasks` shows exactly one weekly plan task for this folder, and that `.claude/settings.local.json`, if it's there, holds only the read tools 2.2 added with their yes. Note the day and time in `context/routines.md` and `setup/progress.md`.

## 3. Hand over

Give them a plain summary with real numbers from their own plan, never an example. For instance:

> Here's where you are. You're planning on Instagram, LinkedIn and Facebook. I've planned 6 posts for the next 2 weeks: 3 are written and waiting for your approval, and 3 need something from you first (2 photos and a video). People are searching most for "how much does a patio cost", and 2 of your competitors do well with before and after photos, so that's where I've started. I've saved what I learned as a skill of your own.

Then tell them, briefly:

- **What's waiting on them**, in your own words: what to approve, what to photograph or record, and by when.
- **How a day looks**: open To do, copy, post, press I've posted it.
- **What to say next**: "plan my content" for more weeks, "what's due today?", "I've got an idea", "write my waiting posts", and "refresh my research" about once a month.
- Their link, **http://localhost:4747/content/**. Bookmark it.
- That Claude never posts for them.
- That they can say "get the latest version" any time and you will bring the app up to date, keeping everything of theirs.
- **Their platforms**, one line each: which you connected, and which can be read from an export.
- **The weekly plan**, if they chose it: the day and time it runs.

## 4. Mark setup complete

Only now, at the very end:

1. In `CLAUDE.md`, change `Setup: not done yet` to `Setup: complete on <date>`.

Never commit any of these changes yourself; that's for the people who maintain this kit.

Tick this step in `setup/progress.md` and change "Setup status" to `complete on <date>`.
