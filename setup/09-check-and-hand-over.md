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

## 2. Hand over

Give them a plain summary with real numbers from their own plan, never an example. For instance:

> Here's where you are. You're planning on Instagram, LinkedIn and Facebook. I've planned 6 posts for the next 2 weeks: 3 are written and waiting for your approval, and 3 need something from you first (2 photos and a video). People are searching most for "how much does a patio cost", and 2 of your competitors do well with before and after photos, so that's where I've started. I've saved what I learned as a skill of your own.

Then tell them, briefly:

- **What's waiting on them**, in your own words: what to approve, what to photograph or record, and by when.
- **How a day looks**: open To do, copy, post, press I've posted it.
- **What to say next**: "plan my content" for more weeks, "what's due today?", "I've got an idea", "write my waiting posts", and "refresh my research" about once a month.
- Their link, **http://localhost:4747/content/**. Bookmark it.
- That Claude never posts for them.

## 3. A weekly plan (optional)

Only offer this if they want it, and only as a scheduled routine with the same "ask first" rule as anything else:

> Want me to plan the next weeks automatically every Friday, so your calendar's always full? I'd only ever plan and write; you'd still approve and post everything.

If they say yes, set it up as a scheduled task the same way the other tools in this toolkit do, and note it in `setup/progress.md`.

## 4. Mark setup complete

Only now, at the very end:

1. In `CLAUDE.md`, change `Setup: not done yet` to `Setup: complete on <date>`.

Never commit any of these changes yourself; that's for the people who maintain this kit.

Tick this step in `setup/progress.md` and change "Setup status" to `complete on <date>`.
