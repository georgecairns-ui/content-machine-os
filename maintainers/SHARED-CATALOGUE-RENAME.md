# Catalogue change: Content Machine OS's description

The catalogue entry for `content` in `apps/shared/catalogue.json` has a new description in this kit. The id (`content`), name (`Content Machine OS`), icon (`megaphone`), app folder (`apps/content/`) and repository (`content-machine-os`) are unchanged.

**20 October 2026 (this change):** the tool now researches what customers search for and what competitors do, scores each post for each platform, and leaves every post for the owner to approve and post, so the description changed:

- `description`: "Plans your posts from what your customers search for and what works for your competitors, drafted in your voice and scored for each platform. You approve every post and post it yourself."

**The previous text** (from the shared catalogue, written before the tool was specified): "A week of posts planned and drafted in your voice. Claude turns your wins, ideas and news into posts, and you approve each one before you post it yourself."

Task List OS, Pipeline OS and every other tool's own copy of `apps/shared/catalogue.json` still carry the previous text. The change is a shared-file change: it must be made in Task List OS first, then copied to every tool, the same as any other change to `catalogue.json`. Until then, this kit's copy differs from the others in this one entry only, and nothing else in the file has been touched.

`ATTACHING.md`'s toolkit table has the old row for this tool. Suggested wording for its "What it does" cell: "Plans your posts from what customers search for and what works for competitors, drafted in your voice and scored for each platform. You approve every post and post it yourself." Make the change in Task List OS first, then copy it to every tool, per the shared-file rule.
