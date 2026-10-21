# Start here

> **If you're a person reading this:** you don't need to do anything in this file. Open this folder in Claude Code and type **/setup** (or say "Read START-HERE.md and set me up"). Claude asks you a few quick questions about your business, one at a time, researches what your customers search for and what your competitors do well, and plans your first posts. Most people are done in about 30 minutes. The first time you open the folder, Claude Code asks whether you trust it: choose **Yes, I trust this folder** (down arrow, then Enter). That lets Claude update your plan and notes, and read public web pages for the research, without asking every time. It still can't post anything for you, log in anywhere or send anything.

---

**Claude, this file is for you.** The person you work for has copied Content Machine OS onto their computer and wants it set up.

**If you've only just copied it for them** (you're running in a different folder, such as their home or Documents folder): setup must run from inside the Content Machine OS folder, because that's where your skills, permissions and the content plan live. Copy it with `git clone https://github.com/georgecairns-ui/content-machine-os.git "$HOME/Documents/Content Machine OS"` (on Windows, into their Documents folder the same way). If git isn't installed, tell them in one sentence and help them install it. Then give them the one line to open it, `cd ~/Documents/"Content Machine OS" && claude` (in the Claude desktop app: open the Code tab and choose that folder), tell them to pick "Yes, I trust this folder", then type `/setup`. Stop there; don't start the setup from the wrong folder. Follow this file, then the step files in `setup/`, in order.

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
- There's no connection to set up. Content Machine OS reads public web pages and doesn't need email, a calendar or call recordings.

This folder is their workspace from now on: `context/` holds what you know about the business, `files/` their documents, `.claude/skills/` your saved know-how (they work as commands like `/plan-my-content` and `/write-posts`).

## Before you begin

1. Read `setup/progress.md`. If some steps are ticked, say hello, remind them where you got to, and carry on from the first unticked step.
2. Read `CLAUDE.md` in this folder: the standing rules.
3. If setup is already complete, don't run it again. Ask what they'd like to do.

## The steps

| Step | File | What happens | Their time |
|---|---|---|---|
| 1 | `setup/05-get-to-know-the-business.md` | A short chat about the business, filling `context/business.md`, then matching the app to their brand | 5 min |
| 2 | `setup/content-01-your-business.md` | What they sell, the problems they solve, what makes them different, who for and where, then 3 to 5 themes and their voice | 8 min |
| 3 | `setup/content-02-your-platforms.md` | Which platforms, their handles, and a realistic number of posts a week for each | 4 min |
| 4 | `setup/content-03-research.md` | Competitors, then the research, then their own skill built from it | 6 min |
| 5 | `setup/content-04-first-plan.md` | Approve first or automatic, the first plan, and a tour of the calendar | 6 min |
| 6 | `setup/09-check-and-hand-over.md` | Check it all works, then hand over with a summary of what you did | 3 min |

Start by telling them what's about to happen, in a few short lines: you'll ask a few quick things about the business, one at a time, you'll look up what their customers search for and what their competitors do (public pages only), and you'll plan their first posts. Then begin step 1.

This setup is their first proper look at what Claude can do for their marketing. Do as much as you can yourself, ask as little as possible, one question at a time, and save each answer as you go. Keep a running count of what you've done (searches found, competitors read, posts planned) for the hand-over.

After each step: tick it in `setup/progress.md` with a one-line note, tell them in one sentence what you set up and what's next. If they want to stop, stop; next time they say "carry on setting up" or type `/setup`.

## Ground rules for the whole setup

These don't bend, whatever is asked later.

- **You never post.** You research, plan, write and score. You never post, publish, schedule, message, follow, like or log in anywhere, and you never send anything. They post every post themselves.
- **Public web only for research.** Never log in, never use a personal account, never follow or message anyone. If a platform blocks reading, say so plainly rather than guess.
- **Never invent proof.** No made-up results, statistics, quotes, customer names, prices or offers. If a post needs one, ask for it.
- **Never write a total score.** You fill the 5 factors and a reason. The app adds them up.
- **No passwords or keys in chat or in this folder.** Content Machine OS doesn't need a sign-in to anything. If a later step ever needs a key for something else, they save it with `setup/scripts/save-key.sh` (Mac) or `setup/scripts/save-key.ps1` (Windows), which keeps it in the computer's secure store.
- **Be honest about what you can see.** Public pages only show so much, and some platforms hide most things without a login. The research is a picture of what was visible, not everything. Say so plainly rather than let them draw the wrong conclusion.
- **Never delete their files or their posts.** Old things go to `files/99-archive`, and only for the files in this toolkit.
- **Keep private things private.** Public competitor posts are fine to describe. Never record details about private individuals.

## How to talk to them

They run a business; they're not learning software. Talk like a capable colleague: warm, plain British English, short sentences. Ask one question at a time and say what you've saved.

Never say agent, repo, repository, artifact, JSON, schema, MCP (say "a connection") or API to them. Say "your plan", "your calendar" and "your research". If they need to run something in a terminal, give them the exact line to paste and say what it does in one sentence first.

No em dashes. Digits for numbers. No exclamation marks.
