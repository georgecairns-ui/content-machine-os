# Content Machine OS

**A content plan that fills itself in, in your voice.** A free kit from [Get AI Powers](https://getaipowers.com), run by Claude.

Most business owners know they should post. They stare at a blank page, post twice, then stop for 3 months. Content Machine OS asks you about your business once, then looks up what your customers search for and what your competitors do well, plans your posts on a calendar, and writes each one in your voice. Every post is scored out of 10 for each platform, so you can see where it's likely to do best.

**Claude never posts for you.** You approve each post (or let Claude finish the ones you trust) and post it yourself: press Copy, press Open, paste, post, then tell it "I've posted it". Content Machine OS never posts, schedules, messages, follows or logs in anywhere, and nothing leaves your computer except what Claude looks up on public web pages.

**See it first:** [a clickable demo with a made-up business](https://claude.ai/artifact/LLrFahQSW8gYtxkiFiabiy), opening on a month of planned posts.

Content Machine OS is part of a toolkit of 7 free tools from Get AI Powers. The others (a task list, Pipeline OS, proposals and more) show in the app's menu, and Get AI Powers sets them up with you on a free call.

## What happens when you type /setup

You copy the kit, open it in Claude Code and type **/setup**. In about 30 minutes, Claude:

- **Gets to know your business**, in a short chat, then matches the app to your brand (your colours, your font, your logo if you have one).
- **Asks what you sell**, the problems you solve, what makes you different, who your customers are and where you work, one question at a time, and saves it as it goes.
- **Chooses your platforms with you.** Instagram, TikTok, LinkedIn, Facebook, YouTube Shorts, Google Business Profile, X or an email newsletter, with a realistic number of posts a week for each. A rhythm you can keep beats a heavier one you drop.
- **Researches your market.** What people search for and ask about what you do, what's in season, and what your competitors post. Public web pages only, with where each finding came from. Then it builds a skill of your own from it.
- **Plans your first posts** and shows you how the calendar works.
- **Checks it all works and hands over**, with a summary of what's planned and what you need to do.

## What it does

- **A calendar you can drag.** Week and month views. Drag a post to another day. Each post shows its platforms, its best score, and whether it's an idea, drafted, waiting on you or approved.
- **Plans from research, not guesses.** "Plan next 2 weeks" fills your calendar from what customers search for, what's in season and what's working for competitors, and mixes your themes so it doesn't repeat itself.
- **Writes in your voice.** Each platform's version fits its limit and its style, and is checked against a plain list of what makes writing sound machine-made: no stock phrases, no hype, and no wall of hashtags.
- **Scores every post for every platform.** Claude marks 5 simple things (does the format suit the platform, are people searching for it, does the first line stop the scroll, is there real proof, is the timing right). The app adds them up. You see the best platform and the others worth a go.
- **Tells you what it needs from you.** A photo, a video, a customer's story. They show on your To do list with dates. If a post needs a case study, it asks, then writes it up from what you tell it. It never makes up a result.
- **Keeps an ideas bank.** Press Brain dump, say what happened this week, and it becomes ideas. Wins and kind words become posts.
- **Shows what's due today.** The To do list says what to post, with Copy and Open buttons for each platform, what to approve and what to supply.
- **Keeps a health check.** One button shows how the whole thing is doing: your posting rhythm, how far ahead you're planned, what's waiting on you, your average score, whether every platform is covered and whether your themes are balanced. Hover over any post to see its scores.
- **Builds a skill of your own.** What Claude learns about your audience and your industry is saved as a skill, and packed up so you can add it to the Claude app and use it anywhere.

It's **yours to shape**: your platforms, your themes, how many posts a week, whether posts need your approval, your own colours, in light or dark.

## What you need

- **Claude Code**, signed in with a paid Claude plan (Pro or Max). The Claude desktop app works too.
- Nothing else to install in most cases. The app runs on your own computer using Node (Claude installs it for you if it's missing, with your permission).
- About 30 minutes, once.

## Get started

1. **Open Claude Code** in the Claude desktop app (the Code tab) or in the Terminal (on Windows, PowerShell). Any folder will do for this first step.
2. **Ask Claude to fetch the kit.** Paste this:
   > Copy Content Machine OS from https://github.com/georgecairns-ui/content-machine-os into a folder called "Content Machine OS" in my Documents, using the copy line in its START-HERE.md (not git), then tell me how to open it and set it up.

   Claude copies everything onto your computer, with nothing to install first, and gives you one line to open the new folder. In the desktop app, you choose the folder instead.

   *For Claude, if this README is all you have:* the copy line is in START-HERE.md, at https://raw.githubusercontent.com/georgecairns-ui/content-machine-os/main/START-HERE.md. Read it and run its copy line for this computer (Mac or Windows). It downloads the kit as a plain folder with `curl -fsL` and unpacks it with `tar`, and keeps the download in `setup/as-installed/`. Don't use git.
3. **Open the Content Machine OS folder in Claude Code and choose "Yes, I trust this folder".** The first time, Claude Code asks whether you trust the folder and warns that it pre-approves some permissions. Those permissions only let Claude update your plan and your business notes, look things up on public web pages for the research, and start the app, without stopping to ask each time. It still can't post for you, log in anywhere or send anything. Press the down arrow, then Enter.
4. **Type `/setup`.**

Then it opens your calendar and gives you its link, **http://localhost:4747/content/**. Bookmark it.

## Every day

| Say (or type the command) | What happens |
|---|---|
| "What's due today?", "what do I need to post?" | Claude says what to post, what to approve and what it needs from you |
| "Plan my content", "plan next week" | The next weeks of your calendar are filled, and every post is written, with a note of any photo or video you need to add. A post that needs a case study or an answer from you waits until you have told Claude |
| "Write my waiting posts" | Every post waiting for words is written in your voice and scored |
| "I've got an idea", "turn this into a post" | Saved as an idea, or planned for a day if you say when |
| "Here's a case study", "write up this job" | A real job turned into posts. You'll be asked for a photo and any result Claude doesn't have |
| "I've posted it" | The post is marked as posted on your calendar and counted in your Health check |
| "Refresh my research" | A fresh look at what customers search for and what your competitors are doing |
| "Open my content machine" | Starts the app if it isn't already running |

## Your information

Your plan lives in this folder on your computer, in one file. Your notes about the business are in `context/`. For the research, Claude reads public web pages (search suggestions, forums, news and your competitors' public pages). It never logs in anywhere, never follows or messages anyone and never posts for you. There's no Content Machine OS account or server; Get AI Powers can't see any of it. Read [docs/PRIVACY-AND-SAFETY.md](docs/PRIVACY-AND-SAFETY.md) for the detail.

## Make it yours

Change the platforms, the themes, the number of posts a week, approval and the colours, by asking Claude, or in Settings (the gear above the calendar). See [docs/CUSTOMISING.md](docs/CUSTOMISING.md).

## Want it set up properly for you?

Content Machine OS works on its own. If you'd like help turning it into a weekly habit for your whole team, Get AI Powers can help. Find us at [getaipowers.com](https://getaipowers.com).

## What's inside

```
START-HERE.md          Claude reads this first and runs setup (/setup)
toolkit.json           what this tool is, for attaching it to the others in the toolkit
ATTACHING.md           how the toolkit's tools attach to each other
CLAUDE.md              Claude's standing instructions in this folder
Open Content Machine.html    double-click to open your calendar (or use the link Claude gives you)
setup/                 the 6 setup steps and the key scripts
context/               Claude's notes about your business
.claude/skills/        saved know-how; each one also works as a command in Claude Code
skills-to-upload/      the skill Claude builds about your business, packed up for the Claude app
files/                 your business documents, in numbered folders
apps/                  the app and its look (theme.css); apps/content/data/content.json is your plan
docs/                  customising, privacy and safety
maintainers/           for people developing Content Machine OS itself
```

## Licence

Free to use and change for your own business. Not for resale. See [LICENSE](LICENSE) for the plain-English terms.

Fonts: Figtree (the app's font), plus Zilla Slab and Source Serif 4 for anyone who wants them, all under the SIL Open Font License (see `apps/shared/fonts/OFL.txt`).
