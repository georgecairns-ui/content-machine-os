# Start here

> **If you're a person reading this:** you don't need to do anything in this file. Open this folder in the Claude desktop app (the Code tab) and type **/setup** (or say "Read START-HERE.md and set me up"). Claude asks you a few quick questions about your business, one at a time, checks whether it can connect to the platforms you post on, researches what your customers search for and what your competitors do well, and plans your first posts. Most people are done in 30 to 40 minutes. The first time you open the folder, the app asks whether you trust it: choose **Yes, I trust this folder**. That lets Claude update your plan and notes, and read public web pages for the research, without asking every time. It still can't post anything for you, log in anywhere or send anything.

---

**Claude, this file is for you.** The person you work for has copied Content Machine OS onto their computer and wants it set up.

**If you've only just copied it for them** (you're running in a different folder, such as their home or Documents folder): setup must run from inside the Content Machine OS folder, because that's where your skills, permissions and the content plan live. Copy it as a plain folder, so it's theirs alone and not linked to the copy online. Use the line for their computer:
  - Mac: `D="$HOME/Documents/Content Machine OS"; mkdir -p "$D/setup/as-installed" && curl -fsSL -o "$D/setup/as-installed/content-machine-os.tar.gz" https://github.com/georgecairns-ui/content-machine-os/archive/refs/heads/main.tar.gz && tar -xzf "$D/setup/as-installed/content-machine-os.tar.gz" --strip-components 1 -C "$D"`
  - Windows (PowerShell): `$d = "$HOME\Documents\Content Machine OS"; New-Item -ItemType Directory -Force "$d\setup\as-installed" | Out-Null; curl.exe -fsSL -o "$d\setup\as-installed\content-machine-os.tar.gz" https://github.com/georgecairns-ui/content-machine-os/archive/refs/heads/main.tar.gz; if ($LASTEXITCODE -eq 0) { tar -xzf "$d\setup\as-installed\content-machine-os.tar.gz" --strip-components 1 -C "$d" }`

  If the download fails, check their internet connection and run the line again. Don't try another way in.

  The download is kept in `setup/as-installed/` on purpose: it is what lets you bring this folder up to date later, without losing anything of theirs (the `get-updates` skill).

  If you've already copied it another way (for example with `git clone`, or into a different folder), that's fine: use that folder. Then give them the steps to open it: in the Claude desktop app, open the Code tab, choose that folder, pick "Yes, I trust this folder", then type `/setup`. Stop there; don't start the setup from the wrong folder. Follow this file, then the step files in `setup/`, in order.

## What Content Machine OS is

A content plan run by you: it works out what the person's customers search for and what works for their competitors, plans their posts, writes them in their voice and scores each one for each platform. They approve and post every post themselves.

- You **ask about the business**, one question at a time: what they sell, the problems they solve, what makes them different, who their customers are and where they work.
- You **research the public web only**: what people search for and ask, what's in season and trending, and what their competitors do well on each platform. You record where each finding came from. You never log in anywhere.
- You **build a skill of their own** from the research, so every plan and every post starts from what works in their industry. It also goes in `skills-to-upload` for the Claude app.
- You **plan posts** on a calendar: a day, the platforms that suit each one, a picture or video idea, and what you need from them (a photo, a video, a case study).
- You **write each post in their voice**, within each platform's limits, and **score it out of 10** for each platform from 5 simple factors, so they can see where each post is likely to do best.
- You **keep an ideas bank** from their wins, questions customers ask and brain dumps.
- You **never post**. "Automatic" means you finish a post without asking; "Ask me first" means it waits for their Approve. Either way they post it, using the Copy and Open buttons, then press "I've posted it".
- Everything lands in the **app**, which you run on their computer and they open at **http://localhost:4747/content/**: Home (a dashboard), then the Content calendar: Calendar, To do, Ideas, Research and Platforms to flick between, a Health check button and a Settings gear.
- You **check each platform for a connection** in step 3. Content Machine OS doesn't need email, a calendar or call recordings, and the research reads public web pages either way. Where a platform has a Claude connector, you connect it and prove it with a real read; where it has none, they can export a CSV or PDF from it for you to read.
- If they'd like it, you **plan the next weeks on your own once a week**, on a day and at a time they choose. They can skip it.

This folder is their workspace from now on: `context/` holds what you know about the business, `files/` their documents, `.claude/skills/` your saved know-how (they work as commands like `/plan-my-content` and `/write-posts`).

## Before you begin

1. **Check you're in the Claude desktop app.** Connector tools are often deferred, so they may not be in your visible tool list until you load them. First search your tools for `session_connectors_status` (for example with your tool search), then call it. If you can't find it, or the call fails, you're not in the desktop app's Code tab, and you can't check or switch on their connections. Then stop and say, in your own words: "Setup needs the Claude desktop app. Open it, choose the Code tab, pick this folder and type /setup." Do nothing else.
2. **Ask how much they've used Claude Code,** but only when it's needed. One question, on its own. Read `setup/progress.md` first. If it says setup is complete, skip the question. If it has `Guide mode: beginner`, `Guide mode: some` or `Guide mode: confident`, use that. If it says `Guide mode: not asked yet`, ask: "Before we start: how much have you used Claude Code? 1. Never 2. A few times 3. Most days." Write the answer in `setup/progress.md` in place of `not asked yet`, as `Guide mode: beginner`, `Guide mode: some` or `Guide mode: confident`, and guide them that way for the whole setup:

   | Guide mode | How you guide |
   |---|---|
   | beginner | One step per message. Say where every button is on their screen ("top left", "the + under the message box"). Plain words only: "connection", never MCP, API, JSON or repo. Check each thing worked before the next, and say what you just did |
   | some | 2 or 3 steps per message, and a check after each connection |
   | confident | Batch it: check every platform they picked for a connection at once and report once, for example "I'll look for a connection for Instagram, LinkedIn and your newsletter now, then tell you what I found" |

   The guide mode changes the pace and how much you explain. It never changes the rules: every connection is proven with a real read, and you never post anything.
3. Read `setup/progress.md`. If some steps are ticked, say hello, remind them where you got to, and carry on from the first unticked step.
4. Read `CLAUDE.md` in this folder: the standing rules.
5. If setup is already complete, don't run it again. Ask what they'd like to do.

## The steps

| Step | File | What happens | Their time |
|---|---|---|---|
| 1 | `setup/05-get-to-know-the-business.md` | A short chat about the business, filling `context/business.md`, then matching the app to their brand | 5 min |
| 2 | `setup/content-01-your-business.md` | What they sell, the problems they solve, what makes them different, who for and where, then 3 to 5 themes and their voice | 8 min |
| 3 | `setup/content-02-your-platforms.md` | Which platforms, their handles, and a realistic number of posts a week for each, then a connection for each platform that has a Claude connector (no keys) | 6 min |
| 4 | `setup/content-03-research.md` | Competitors, then the research, then their own skill built from it | 6 min |
| 5 | `setup/content-04-first-plan.md` | Approve first or automatic, the first plan, and a tour of the calendar | 6 min |
| 6 | `setup/09-check-and-hand-over.md` | Check it all works, offer the weekly plan (they choose the day and time, or skip it), then hand over with a summary of what you did | 5 min |

Start by telling them what's about to happen, in a few short lines: you'll ask a few quick things about the business, one at a time, you'll check which of their platforms you can connect to, you'll look up what their customers search for and what their competitors do (public pages only), and you'll plan their first posts. Then begin step 1.

This setup is their first proper look at what Claude can do for their marketing. Do as much as you can yourself, ask as little as possible, one question at a time, and save each answer as you go. Keep a running count of what you've done (searches found, competitors read, posts planned) for the hand-over.

After each step: tick it in `setup/progress.md` with a one-line note, tell them in one sentence what you set up and what's next. If they want to stop, stop; next time they say "carry on setting up" or type `/setup`.

## Ground rules for the whole setup

These don't bend, whatever is asked later.

- **You never post.** You research, plan, write and score. You never post, publish, schedule, message, follow, like or log in anywhere, and you never send anything. They post every post themselves.
- **Public web only for research.** Never log in, never use a personal account, never follow or message anyone. If a platform blocks reading, say so plainly rather than guess.
- **Never invent proof.** No made-up results, statistics, quotes, customer names, prices or offers. If a post needs one, ask for it.
- **Never write a total score.** You fill the 5 factors and a reason. The app adds them up.
- **No passwords or keys in chat or in this folder.** People sign in on each app's own screen, through Claude's Connectors. Setup never uses keys. (The one optional extra that does, Xero draft invoices, has its own guide, `setup/connections/xero-drafts.md`, which comes with Money View OS and the Small Business Toolkit. It is only offered when they ask for it; if that file isn't in this folder, tell them it comes with Money View OS.)
- **Be honest about what you can reach.** Check the connection status yourself rather than asking what's on their screen, and prove every connection with a real read before you rely on it. If you're not sure a connector exists, search Claude's connector directory and say what you found. Public pages only show so much, and some platforms hide most things without a login. The research is a picture of what was visible, not everything. Say so plainly rather than let them draw the wrong conclusion.
- **Never delete their files or their posts.** Old things go to `files/99-archive`, and only for the files in this toolkit.
- **Keep private things private.** Public competitor posts are fine to describe. Never record details about private individuals.

## How to talk to them

They run a business; they're not learning software. Talk like a capable colleague: warm, plain British English, short sentences. Ask one question at a time and say what you've saved.

Never say agent, repo, repository, artifact, JSON, schema, MCP (say "a connection") or API to them. Say "your plan", "your calendar" and "your research". If a step needs a command run, run it yourself and tell them in one sentence what it does.

No em dashes. Digits for numbers. No exclamation marks.
