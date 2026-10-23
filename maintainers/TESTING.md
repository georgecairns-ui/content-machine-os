# Testing Content Machine OS

How to test the whole thing as a customer would, without touching the repo. Also follow section 5 of `SHARED-V3-CHANGES.md` and the testing sections of `SHARED-V4-CHANGES.md`, `SHARED-V5-CHANGES.md`, `SHARED-V6-CHANGES.md` and `SHARED-V7-CHANGES.md` for the shared parts.

## 1. The model's own tests

Run these first, from the repo root. They need Node only and touch nothing:

```bash
node maintainers/test-model.js
```

It runs plain assertions on `apps/content/app/model.js` for `score`, `todo`, `stats`, `health`, `weeklyPosted`, `preview`, `postStatus`, `monthGrid` and the photo and video rules (`mediaUrl`, `cover`, `normalise` of `media`, `checkMediaFile`, `attachMedia`, `undoAttach`, `detachMedia`, `restoreMedia`, `makeCover`, `moveMedia`). It must print no failures. `make-release.sh` runs it too. If you change a rule in `model.js`, change the test in the same commit.

What the tests must cover, so a future change can't quietly break a rule:

- **`score`**: the sum of the 5 factors (0 to 10); `null` if any factor is missing; a factor outside 0 to 2 is not silently accepted.
- **`todo`**: open needs with their due date (default the post's date minus 1 day), drafted posts due on the post date, approved posts due today or overdue as one row per on-platform not yet posted; posted and skipped posts never appear; the Overdue, Today, This week and Later grouping around midnight and across a month end.
- **`stats`**: posted this month and the target so far (sum of `perWeek` for the on-platforms times the weeks so far, rounded once); weeks planned ahead; what is waiting on the owner; the average score of the next 2 weeks. Every number from the data.
- **`health`**: the 6 checks (posting rhythm, planned ahead, waiting on you, average score, platform spread, theme mix), each `ok`, `warn` or `bad` at the documented thresholds, including an empty calendar, a new start (no weeks of history yet) and overdue things counting twice; `healthOverall` is the worst of them.
- **`weeklyPosted`**: posts put out in each of the last N weeks, oldest first, for a Monday or a Sunday week start, with a post just after midnight in summer in the right week.
- **`preview`**: the words cut where the platform says "see more" (125 characters for Instagram and Facebook, 210 for LinkedIn), at a word end, never for other platforms.
- **`postStatus`**: idea, drafted, approved, posted and skipped, and "Needs you" derived from any need not done. A post is posted only when every on-platform has `postedAt`.
- **`media`**: `mediaUrl` builds `/api/media/content/<file>`; `cover` is the first image, else the first video, else `null`; `normalise` gives every post a `media` list and drops items without a valid stored file name; `checkMediaFile` refuses the wrong kind, an empty file and one over 200 MB in plain words; `attachMedia` ticks off a need only when exactly one open need of the matching kind exists, and `undoAttach`, `detachMedia` and `restoreMedia` put everything back.
- **`monthGrid`**: 5 and 6 row months, a month that starts on the `weekStarts` day, February in a leap year, and a week that starts on Sunday as well as Monday.

## 2. Make a fresh copy

Never test inside the repo: setup writes real details into it. Build the release zip and unzip it somewhere else:

```bash
bash maintainers/make-release.sh
```

Then unzip `dist/content-machine-os.zip` into a test location, for example `Documents/Content Machine OS test`. Each test run starts from a fresh unzip. Then check the release script itself refuses what it should, on a scratch copy of the repo, by adding each of these and running it (each must stop with a plain message):

- a non-empty `posts` list in `apps/content/data/content.json`,
- a filled-in `context/content.md`,
- an empty folder called `.claude/skills/test-what-works`,
- an empty file `skills-to-upload/test.zip`,
- any file (other than `.gitkeep`) in `apps/content/data/media/`,
- a ticked box in `setup/progress.md`,
- "Setup: complete" in `CLAUDE.md`.

## 3. Page checks

Run the app (`node apps/server/server.js` or `python3 apps/server/server.py`), open http://localhost:4747, go into Content Machine OS, and check:

- **One page**: the sidebar shows one item, "Content calendar". Under the top bar is the rail: Calendar | To do | Ideas | Research | Platforms (To do shows its count), a Health check button with a coloured dot, and the Settings gear. Each view has its own address (`#calendar`, `#todo`, `#ideas`, `#research`, `#platforms`, `#health`) and Back and Forward move between them; the keys 1 to 6 do too. The rail's tabs scroll inside themselves on a phone and nothing scrolls sideways from 320 to 2560 pixels.
- **Fresh install** (empty data file): every view (Calendar, To do, Ideas, Research, Platforms and Health check) and the first Home box show "Let's set up your content machine" with the `/setup` line and a copy button. Every other empty page says what will fill it. Nothing mentions a demo.
- **Stats strip** (Calendar only): Posted this month (of the target so far), Planned ahead (weeks), Waiting on you, Average score. Each is a button: Posted and Average score open Health check, Waiting on you opens To do, Planned ahead goes to this month.
- **Hover card**: resting the mouse on a post, or tabbing to it, shows its status, each platform's tag with its score out of 10 and Claude's reason, and anything still needed. It hides on leaving, on blur, on Escape, on scrolling and when a drag starts, never runs off any edge of the screen, and never shows on a touch screen (a tap opens the post).
- **Calendar, week**: 7 columns from `settings.weekStarts`; today's column has the accent; a "+" on a column adds a blank post that day and opens the editor; every card is the same height; no sideways scroll at any width (7 columns wide, 2 under 1,000 pixels, 1 under 560).
- **Calendar, month** (the first view): 5 and 6 row months; chips with a coloured left edge for the best platform, the time, tags, need icons and a status dot; clicking a day number switches to that week. Under 560 pixels a post is a small dot and a tap on it opens the week. **New post** adds an unplanned post and opens it.
- **Drag and drop**: drag a card to another day (the data changes and `activity` gets a line, newest first); drag it onto the Unplanned tray (`date: null`); drag an idea card onto a day (it becomes a post with `ideaId`, the recommended platforms, the default approval, status idea, and the idea becomes `planned`). The toast's Undo puts it back. Without a mouse: every card's Move button opens the date picker with an Unplanned option and works by keyboard.
- **Filter chips**: hiding platforms hides cards with none of them; the choice survives a reload.
- **Photos and videos** (needs the helper, not the folder-picker mode): in a post's editor, the "Photos and videos" section sits under the title, day, time and approval. Drag 2 pictures and a short video from a folder onto the section, and then onto another part of the open panel: a bar fills while each saves, then each shows as a thumbnail (the video as its first frame with a play mark), the first picture says Cover, and `content.json` has the `media` items with `file` names like `m-k3x9q2.jpg` and the files are in `apps/content/data/media/`. **Add from your computer** does the same with the file picker. Drag a thumbnail to a new place, or use its earlier and later buttons, and the order changes and is kept after a reload. **Make cover** moves a picture first. Click a thumbnail: it opens large, the arrow keys step through, a video plays with controls, Escape closes it and leaves the editor open. **Remove from post** takes it off with an Undo, the section says the file stays in the folder, and the file is still there. A `.pdf`, a HEIC photo, a file over 200 MB and an empty file each give a plain message in the section, and nothing is saved. With the helper stopped, adding a file says the content machine can't be reached. Add a photo to a post with exactly 1 open photo need: that need is ticked off, with an Undo that also takes the photo off again. With 2 open photo needs: nothing is ticked and each gets a "Tick off: <text>" button. Adding a video ticks a video need, never a photo need. The preview of each platform shows the cover above the words.
- **Photos and videos on the calendar**: a post with media shows a small square cover in the month and a strip along the top of the card in the week (every card in that week is the same height); a video shows its first frame with a play mark. Drop a file from a folder on a post chip (month), a card (week) or a card in the Unplanned tray: a bar runs along it while it saves, then it has a cover, and a toast says what was added, with Undo. Dragging a post to another day still works, and dropping a file on an empty part of the calendar or the page does nothing (the browser never opens the file). Hover a post with a picture: the card shows about 260 pixels of post (the business name, the cover, the first lines of the words on its best platform) and then the scores. A post with a video shows the video's first frame. A post with no media shows the card as before with the shot list idea in italics. Check both in light and dark, and that the card stays on screen at the edges.
- **To do, photo and video needs**: each has an **Add the file** button that opens the post at its photos and videos, with focus on Add from your computer.
- **Post editor** (a wide panel, 640 pixels on a desktop): title, date, time, theme, the Ask me first | Automatic switch with its one line. Platform toggles only for platforms that are on, plus All and Recommended (7 or more). "Also good on TikTok, 8/10" appears for an off platform with a score and switches it on. Each tab: format select from that platform's formats, a preview of the words above the box that cuts at 125 characters (Instagram, Facebook) or 210 (LinkedIn) with "see more" and follows what is typed, character count against the limit (a warning colour over it; YouTube counts the first line against 100), Copy (the text really is on the clipboard), Open <platform> (a new tab to the right link; email has none), I've posted it (sets `postedAt`, optional link; the last one sets status posted). A "How it scored" section gives each platform's 5 factors as small bars with Claude's reason. Shot list editable. Needs: tick, add, a case study need with its text box and Send to Claude.
- **Buttons**: Ask Claude to write it (`request.kind: "write"`), Ask Claude to change it with a note (`rewrite`), Approve (drafted to approved with `approvedAt`), Skip this post (hidden, Undo, never deleted). Each Claude button calls the `write-posts` job and shows the Claude status pill. With the helper unable to start Claude (503), the message reads "Claude isn't switched on for the app. Open the folder in Claude and say: write my waiting posts."
- **To do**: Overdue, Today, This week and Later; the accent count is items due today or overdue; open needs, drafted posts ("Check and approve: <title>") and approved posts due (one row per platform not posted, with Copy, Open and I've posted it); a case study row answers inline and then the post gets a `request`; each row opens the editor.
- **Ideas**: filter by source and theme; Plan it (date picker, creates the post); Drop (Undo, never deleted); Add an idea; the Brain dump button's picker "An idea or post…".
- **Research**: last updated date; Refresh research runs the job; searches with demand pills and Make it an idea; trends with their end dates; competitor cards with platform tags and examples; one card per on-platform from `whatWorks`; the name of the skill Claude built. Empty state reads "Claude fills this during setup, and again when you press Refresh research."
- **Platforms**: a card per platform; the switch, handle, link, posts a week; "Recommended for you" with Claude's reason; "Posted this month: N"; the line under the title is the sum of `perWeek`, worked out by the app.
- **Health check**: 6 checks each with a Healthy, Watch or Needs action pill, the value and the target; every one matches what `model.js` works out from the data and nothing is typed by Claude. The bar chart shows the last 8 weeks against a dashed target line, with the last bar marked as this week so far. One line says reach and engagement numbers come later. The Home box "Health check" shows the overall state and the 6 checks.
- **Settings** (the gear on the rail or in the sidebar): business name, first name, posts a week, default approval, default time, week start, weeks Plan fills (1 to 4), themes (add, rename, remove). A bad number is refused with a plain message. Save and reload: all kept.
- **Plan next 2 weeks**: the label follows `settings.planWeeks` (change it to 3 and the button says 3).
- **Platform tags**: coloured 2 letter badges in light and dark, each platform distinct, no logos, nothing loaded from the internet (check the network panel).

## 4. Light and dark, phone widths, reduced motion

- **Light and dark**: every page, the editor and the toast take the theme's colours in both. Text contrast at least 4.5 to 1, including the score badge, the warning over the limit and every platform tag.
- **Phone width 320 and 375**: the sidebar opens from the menu button; nothing scrolls sideways on any page; the editor is usable by touch; Move buttons work.
- **Reduced motion**: with the OS setting on, the drop highlight and toast don't animate.

## 5. The 3 jobs, with a stand-in `claude`

Point `TLOS_CLAUDE` at a stand-in script that follows the job prompts without using real Claude (see Task List OS's own stand-in for the pattern). For each job, trigger it from the app and check:

- **`research-my-market`**: the stand-in writes `research` in the right shape (with a `source` on every search and competitor) and sets `research.skill`; the app shows "Claude is researching what your customers search for" while it runs and the result afterwards.
- **`plan-my-content`**: the stand-in adds posts for `settings.planWeeks` weeks and leaves existing posts byte for byte unchanged; no platform goes over its `perWeek`; every on-platform has 5 factors (0 to 2) and a reason; no total score appears anywhere in the file; posts with open needs stay `idea` with no text; `activity` gets a line at the front.
- **`write-posts`**: for each post with a `request`, the stand-in fills `text` within each platform's limit, the factors and reason, sets the status from `approval` (`drafted` for ask, `approved` and `approvedAt` for auto), and clears `request`. A post without a request is untouched.

Then, with real Claude if you can: run `research-my-market` on a made-up business and confirm every finding has a plain source, nothing is invented, and a platform that blocks reading is reported as blocked.

## 6. Claude never posts: a check by reading

Search the whole kit (`apps/content/`, `.claude/skills/`, `setup/`, `docs/`, `.claude/settings.json`) for anything that posts, sends or logs in. Expected result: nothing that does, in code or in a skill. In particular:

- `.claude/settings.json` allows no `mcp__` tool and no command that sends, posts, schedules or deletes. WebSearch and WebFetch are the only network permissions.
- Every skill's rules say it never posts. The Open buttons in the app only open a new browser tab.
- Run each skill's wording through the voice checklist in `write-posts` (no em dash, no "delve", "game-changer", "unlock", "elevate", no list of 3 for effect, no hype, no hashtag wall, no emoji string, no "In today's fast-paced world"). Search the skills and the setup steps for them.

## 7. Menu and locked-tool panel

As `SHARED-V3-CHANGES.md` section 5 describes: on a scratch copy, the sidebar shows Home, Content Machine OS as an open dropdown with its one page (Content calendar, carrying the count of things due today or overdue), and the other 6 tools locked under "More tools" in catalogue order. Folding the dropdown shows the total waiting and the choice is remembered. Each locked tool opens the panel with the right tracking on its button link; Escape and a click outside close it; it works by keyboard and at phone width. `showMoreTools: false` in `catalogue.json` hides the locked tools completely. The `content` entry's description reads as in `SHARED-CATALOGUE-RENAME.md`.

## 8. Setup, as the customer's Claude

On a fresh unzip, run `/setup` as if you were the customer's Claude, with a made-up business. Check:

- It asks one question at a time and saves as it goes (look at `context/content.md` and the data file between questions).
- Step 2 can't be skipped past questions 1 to 3. Quitting half way and typing `/setup` again carries on from `setup/progress.md`.
- Step 3 suggests 2 or 3 platforms, never pushes the posts a week higher than the person says, and saves `platforms` and `settings.postsPerWeek`.
- Step 4 asks for 3 to 5 competitors (suggests some if there are none), runs the research, builds a `<slug>-what-works` skill and a zip in `skills-to-upload`, and shows the Research page.
- Step 5 asks the approval question, plans the first posts and opens the Calendar. Claude says it never posts.
- Step 6 passes every item in `setup/09-check-and-hand-over.md` and marks setup complete only at the very end.
- Nothing in the folder ends up containing a password, a key or a code.

## 9. Attach to a scratch Task List OS (and Pipeline OS)

Follow `ATTACHING.md` on a scratch copy of Task List OS, then check:

- Both tools show as dropdowns in the sidebar; Home offers both tools' boxes (this tool's start off, in the hidden list, per the shared rule); nothing in Task List OS broke; setup didn't ask what the business does a second time.
- `plan-my-content` adds a suggested task to Task List OS for each open need, and `content-check-in` for each post due today, with `source.tool` set to `content`, a `source.id` that matches the post or need, `suggested: true` and `addedBy: "claude"`. They show on its Review page with a New tag and need a click. Running either twice adds nothing twice. A task for a posted post or a need already done is never added.
- With Pipeline OS also attached: a deal moved to `won` becomes one idea (`source: "pipeline"`) with a case-study need once `plan-my-content` runs, never twice, and no deal record is changed.
- With none of those attached: everything above is skipped quietly, with no error.

## 10. Helper: Node and Python behave the same

Run the app once with `node apps/server/server.js` and once with `python3 apps/server/server.py` and repeat the page checks in section 3 for each: saving the data file, the job endpoints for all 3 jobs, and the backup file (`content.backup.json`) all behave the same in both.

## 11. The helper's photo and video routes

`node maintainers/test-helper-media.js` starts a scratch copy of the Node helper, and of the Python helper if `python3` is there, on a free port and checks over http: a photo is saved (201) and played back with the right type; a video answers Range requests with 206 and an impossible range with 416; saving the same name again is a 409 and leaves the first file alone; a request that says it is over 200 MB is a 413 and writes nothing; bad names are 400; the wrong `Content-Type` for the ending is 415; a missing length is 411; a tool without `"media": true`, or not installed, is 404; another website's `Origin` and a wrong `Host` are 403; delete, post and patch are 405; the data file still saves. It uses a temporary folder and never writes into the kit. If it can't open a port it prints `COULD NOT RUN` and exits with 2: run it somewhere that can. It is not part of `make-release.sh`, which has to work on a machine that blocks local ports.

Then once by hand, with each helper in turn: drag a 100 MB or larger video onto a post and check the bar moves, the helper's memory stays low (the upload is streamed to disk, not held in memory), and the video plays and skips around in the lightbox (that is Range working in the browser).

## What can't be tested without real Claude and a real business

- A real `/setup` run: everything above uses a stand-in `claude`, so the actual wording Claude uses when talking to a person, and how it handles an ambiguous answer, needs a run with real Claude.
- Real research: the stand-in proves the mechanics, but only a real run shows what public pages say about a real trade and place, and how many platforms block reading without a login.
- Voice: whether a post really sounds like its owner, and whether the checklist catches every machine tell, needs real owners reading real drafts.
- Time saved: not measured. Don't quote a figure.
