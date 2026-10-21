# Build prompt: Content Machine OS

George's brief of 20 October 2026, which replaces the 7 October build prompt (kept below it for reference). His decisions on the open questions are in `SPEC.md`.

## The brief, 20 October 2026

This needs to stick to the same framework as the other OS systems as part of the toolkit. It helps business owners and marketing teams plan their content.

When they install it, it asks a series of questions about their service, the challenges they solve and the unique selling point of the business: who it is and what it is. From there it researches the topics their prospects and clients are searching for and want value on. For example, for a landscaper it researches what people search for about landscaping, then plans content from that research and what's trending.

It has a calendar. They drag and drop content onto different days of the week. The page shows Instagram, TikTok, LinkedIn, Facebook and the rest; they connect each platform and with a click choose whether a post goes to Instagram, LinkedIn, TikTok or any of them, or select all, and it fills each version in.

It recommends which platforms each post will get the most engagement on. It researches their competitors' social media and builds a skill on what competitors do and what goes viral in their industry. From that it scores each post out of 10 for each platform. It also writes them.

They can brain dump ideas on the fly and it turns them into content ideas.

It's similar to the content system a partner built for George and Joey's own posts. Each post has a scheduled day, and whether it's automatic or needs approval. It tells them what's outstanding: record a video for this day, add a photo for this post. If a post needs a case study, it asks for one and then writes the content.

It's a content strategy system that writes content for them, based on the answers they give when they install it. Same design as the other toolkit OSs. A demo artifact promotes it, with a link to book a call with Joey.

## The 7 October build prompt


You're helping me (George, Get AI Powers) build **Content Machine OS**, one tool in our small business toolkit. I'm not a developer, so explain anything technical in plain English and give me exact click-by-click steps whenever I need to do something myself.

## The toolkit

The toolkit is a set of tools for UK small business owners: Task List OS (already built) plus 8 more. Each one is a complete kit someone can use on its own, and each one can be attached to any of the others, so whatever combination a customer has works as one app with one Claude. Attach all of them and they have the whole toolkit. That's the point Joey and I agreed: separate tools that are useful alone, that we can give away individually, and that click together into something bigger. The people using it run "boring" businesses: trades, agencies, recruiters, brewers, accountants. Smart, busy, non-technical. They'll never look at code.

## Read these first

1. **`ATTACHING.md`**, in the Google Drive toolkit folder: `~/Library/CloudStorage/GoogleDrive-george.cairns@getaipowers.com/Shared drives/Get AI Powers Brain/Claude/05_Marketing/small-business-toolkit/content-machine-os/ATTACHING.md`. The rules every tool follows so they attach to each other and show each other in the menu. Treat it as the spec. Copy it into the repository unchanged.
2. **Task List OS, at `~/Repos/getaipowers/task-list-os`.** It's the reference build, and Content Machine OS must look, feel, set up and behave like it. Read README.md, START-HERE.md, CLAUDE.md, LICENSE, `maintainers/MAINTAINING.md`, `maintainers/TESTING.md`, `docs/CUSTOMISING.md`, `apps/server/`, `apps/shared/`, `apps/home/`, everything in `apps/task-list/` (especially its CLAUDE.md, `menu.json` and `home-boxes.js`), `context/`, `setup/`, `.claude/skills/README.md` and a few skills, including `match-my-brand`. Your tool copies its layout, look, helper, setup style, skills style and wording rules. Its own notes already say future tools go in `apps/<tool-name>/`.
3. **Task List OS's `apps/shared/VERSION`.** It must say 3 or later: the redesign with the Home dashboard, the sidebar dropdowns, light and dark, and `match-my-brand`. If it says less, stop and tell me the Task List OS redesign isn't published yet. Read `maintainers/SHARED-V3-CHANGES.md`: it is the exact list of what every tool copies and what each tool makes for itself (`installed.json`, `toolkit.json`, `menu.json`, `home-boxes.js`, `index.html`, the store). If another tool in `~/Repos/getaipowers/` has a newer shared version, use that one.

If anything in this brief contradicts how Task List OS actually works, Task List OS wins: tell me what you found and follow it. Load my `get-ai-powers-brand` and `brand-web-kit` skills before designing any screen, but follow Task List OS's look (its `theme.css`, light and dark) so the tools match when they're attached.

## This tool: Content Machine OS

**The pain.** Owners know they should post on LinkedIn or Instagram, or send a newsletter. They stare at a blank page, post twice, then stop for 3 months.

**What it does.** A weekly content plan across their channels. Claude keeps an ideas bank from their real work (wins, questions customers ask, behind the scenes) and proposes the week's posts, drafted in their voice. They edit, approve, press copy and post it themselves. One idea can become several formats (a LinkedIn post, a short email, an Instagram caption). Claude never posts.

**Data** (`apps/content/data/content.json`): settings (channels, realistic posts per week, 3 to 5 themes they want to be known for, who they're trying to reach), ideas (where from, theme, status), posts (channel, date, theme, draft, status: idea, drafted, approved, posted), activity log.

**Screens:** week view by channel; ideas bank; post editor with copy button and character count per channel; a simple scorecard (posted this month against the plan).

**Skills:** plan my content, write this up, I've got an idea, turn this into a post, what's due today, I've posted it. Use Task List OS's `write-like-me` and `context/voice.md` for the voice rather than building a second voice system.

**Setup steps:** channels, how often realistically, what they want to be known for, who they want to reach. If `write-like-me` hasn't run yet, offer it.

**Attached:** pipeline wins and What's New updates arrive as ideas. Posts due today become tasks.

**Watch out for:** voice is the whole product. No "delve", "game-changer", "unlock", no em dashes, no lists of 3 for effect, no hype. Load my `george-writing` skill for the anti-AI-voice rules, but write them generically for the customer and fold them into the existing `human-email` approach. No image generation: a post can carry a short "picture idea" note instead.

## Set up the repository (do all of this for me)

1. Create the repository at `~/Repos/getaipowers/content-machine-os`, next to `task-list-os`, and set it up the way Task List OS is set up (same branch habits, same `.gitignore`, same release script adapted for this tool).
2. Lay it out exactly like Task List OS, as set out in `ATTACHING.md` and `SHARED-V3-CHANGES.md`: kit files at the root, `toolkit.json`, `apps/server/`, `apps/shared/` (including `catalogue.json`), `apps/home/`, `apps/installed.json` listing only this tool, `apps/content/` (with `menu.json` for its sidebar pages and `home-boxes.js` for its Home boxes, all `defaultOn: false`), `context/`, `files/`, `setup/`, `.claude/skills/`, `docs/`, `maintainers/`, and the launcher `Open Content Machine.html`. Copy the shared parts across from Task List OS byte for byte, don't rewrite them.
3. Copy Task List OS's LICENSE and change only the product name. Copy this build prompt into `maintainers/BUILD-PROMPT.md` and `ATTACHING.md` to the root.
4. Write `toolkit.json`, `apps/content/ATTACH-CLAUDE.md` and `maintainers/MAINTAINING.md` for this tool.
5. Commit at each milestone (set up, plan agreed, app working, setup and skills written, tested on its own, tested attached) with a plain-English message.
6. Publish: create a public GitHub repository called `content-machine-os` on the same account as Task List OS (`georgecairns-ui`) and push. Before the very first push, tell me in one line what's about to go public and wait for my yes. That's the only time you need to stop and ask.
7. Google Drive copy: refresh the Drive folder `~/Library/CloudStorage/GoogleDrive-george.cairns@getaipowers.com/Shared drives/Get AI Powers Brain/Claude/05_Marketing/small-business-toolkit/content-machine-os/` as a plain copy of the published version (no git history), the same way Task List OS's Drive copy works. Anything in that folder that isn't part of the published version goes into an `_archive` folder inside it, never deleted. Add the same "don't edit here" note Task List OS's copy has.
8. If `gh` (the GitHub command line tool) isn't installed or logged in, install it or walk me through the login in numbered steps, then carry on.

## Make it customisable for clients

- **Look**: `apps/shared/theme.css` and `apps/shared/images/` only, set by the `match-my-brand` step during setup. Every screen in light and dark, in Task List OS's look.
- **The menu**: your tool uses the shared sidebar and `catalogue.json` as they are. Every other toolkit tool shows locked with the Book a free call panel. Don't build your own menu or your own booking link.
- **Words and settings**: labels, stages, categories and anything business-specific in one obvious place, documented in `docs/CUSTOMISING.md` the way Task List OS does it.
- **Demo data**: the same made-up people and businesses as Task List OS (Sam, Priya, Tom at Greenway Café, Marlow Dental and the rest: check its `demo-data.js`), so a demo of several attached tools feels like one believable business.

## Rules (same as Task List OS)

- No frameworks, no libraries, nothing loaded from the internet. The app runs through the shared helper at http://localhost:4747 and works offline.
- Every change to a data file goes through `store.update()`.
- You propose, they approve. Read and draft only in connected apps. Never anything that sends, pays, deletes or posts on the customer's behalf, and never pre-approve tools that could in `.claude/settings.json`.
- Any number the person relies on (totals, VAT, forecasts, cost per lead) is calculated by the app from the raw data, never typed in by Claude.
- Customer-facing words never say agent, repo, repository, artifact, JSON, schema, API or MCP. British English, digits for numbers, no em dashes anywhere, including code comments.
- Never commit filled-in `context/`, real data, a ticked `setup/progress.md` or "Setup: complete". Copy Task List OS's release checks.
- No prices for Get AI Powers services anywhere. Point to getaipowers.com only.
- Never delete files. Move them to `files/99-archive/` (or `_archive/` for build files) and tell me.

## How to work with me

1. Read everything above, then come back with a short plan before writing any code: the screens in words, the data file, the skills and what people say to trigger them, the setup steps, exactly what this tool reads from and sends to the others (from the table in `ATTACHING.md`), any changes the shared parts need, and anything in this brief you think is wrong. Push back if something won't work. Wait for my OK.
2. Don't change the shared parts or Task List OS's skills. If you think they need changing, tell me what and why; that change gets made in Task List OS first and copied to every tool.
3. Build it, then test by hand following Task List OS's `maintainers/TESTING.md` and section 5 of `SHARED-V3-CHANGES.md`, on a scratch copy, never the shipped data.
4. **Test it on its own**: fresh copy, run `/setup` as if you were the customer's Claude with a made-up business, use every page and skill.
5. **Test the menu**: on its own, every other tool shows locked, and clicking one opens the panel with the right booking link and tracking.
6. **Test it attached**: on a scratch copy of Task List OS, follow `ATTACHING.md` to attach this tool. Check both appear as dropdowns in the sidebar, Home offers both tools' boxes, nothing in Task List OS broke, setup didn't ask questions `context/` already answered, and every handoff in the table lands where it should and waits for a click.
7. Write MARKETING.md in `maintainers/`: one plain sentence on what it does, the before and after for the owner, and the 3 things to show in a 60-second video. Mark any time-saving claim "to check".
8. Publish (step 6 of the repository section) and refresh the Drive copy.
9. Finish by telling me in plain English: where it is, the GitHub link, how to open it, how to try the demo, how attaching went, what isn't finished, and what you'd improve next.
