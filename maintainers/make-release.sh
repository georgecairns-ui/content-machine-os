#!/bin/bash
#
# MAKE RELEASE
# ------------
# Builds dist/content-machine-os.zip: a clean copy of the kit for customers to download.
#
# Run it from the content-machine-os folder with:   bash maintainers/make-release.sh
#
# What it does:
#   1. Checks the files that ship are still blank templates, so nobody's real content plan,
#      business notes, built skill, setup progress or photos and videos can go out by mistake. Stops if not.
#   2. Copies the kit into a temporary folder called "Content Machine OS", leaving out this
#      maintainers folder, git history, old builds, backups and computer clutter.
#   3. Checks the copy is complete and every data and settings file is valid, and syntax-checks the app's scripts.
#   4. Zips it as dist/content-machine-os.zip, replacing any older one.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
STAGE="$(mktemp -d "${TMPDIR:-/tmp}/content-machine-os-build.XXXXXX")"
trap 'rm -rf "$STAGE"' EXIT
NAME="Content Machine OS"
OUT="$STAGE/$NAME"

fail() { echo "RELEASE STOPPED: $1" >&2; exit 1; }

# found <grep arguments>: prints what grep finds. grep exits 0 for a match, 1 for none and 2 when it could not do
# its job (a missing file, say); only 2 stops the release, so a check that couldn't run never passes by accident.
found() {
  local out rc=0
  out=$(grep -s "$@") || rc=$?
  [ "$rc" -le 1 ] || fail "a check could not run (grep exit $rc): grep $*"
  printf '%s' "$out"
}

# ---------- 0. The model's own tests, if they're there ----------
if [ -f "$ROOT/maintainers/test-model.js" ]; then
  node "$ROOT/maintainers/test-model.js" >/dev/null || fail "node maintainers/test-model.js failed. Run it to see why"
fi

# ---------- 1. Is everything that ships still a blank template? ----------
python3 - "$ROOT" <<'PYEOF' || fail "the files above contain real data. Restore them with: git checkout -- apps/content/data context setup/progress.md CLAUDE.md
  (and remove any *-what-works skill in .claude/skills, any zip in skills-to-upload and any file in apps/*/data/media)"
import json, sys, pathlib, re
root = pathlib.Path(sys.argv[1])
problems = []

# The data file must equal the empty file in maintainers/SPEC.md, exactly
EMPTY = {
    "version": 1,
    "settings": {
        "businessName": "",
        "ownerName": "",
        "about": {"sells": "", "problems": [], "different": "", "who": "", "where": ""},
        "themes": [],
        "postsPerWeek": 3,
        "defaultApproval": "ask",
        "defaultTime": "09:00",
        "weekStarts": 1,
        "planWeeks": 2,
    },
    "platforms": {},
    "research": {"updatedAt": None, "skill": "", "searches": [], "trends": [], "competitors": [], "whatWorks": {}},
    "ideas": [],
    "posts": [],
    "activity": [],
}
data = json.loads((root / "apps/content/data/content.json").read_text())
if data != EMPTY:
    for key in sorted(set(data) | set(EMPTY)):
        if data.get(key) != EMPTY.get(key):
            problems.append(f"apps/content/data/content.json: '{key}' is not the blank template")

# No demo mode and no sample data ship
for f in list((root / "apps").rglob("*.js")) + list((root / "apps").rglob("*.html")) + list((root / "apps").rglob("menu.json")):
    txt = f.read_text(errors="ignore")
    if re.search(r"makeDemoData|setDemo|isDemo|demo-data\.js|demo-mode|data-action=\"demo|data-change=\"demo|Demo mode", txt):
        problems.append(f"{f.relative_to(root)} still has demo mode in it")
if (root / "apps/content/app/demo-data.js").exists():
    problems.append("apps/content/app/demo-data.js is back: no tool ships a demo")

# Notes: every context file blank, content.md included
for f in sorted((root / "context").glob("*.md")):
    if f.name != "README.md" and "Status: not filled in yet" not in f.read_text():
        problems.append(f"{f.relative_to(root)} has been filled in")
if not (root / "context/content.md").exists():
    problems.append("context/content.md is missing")

# A customer's own built skill and its zip never ship
for d in sorted((root / ".claude/skills").glob("*-what-works")):
    problems.append(f"{d.relative_to(root)} is a customer's own skill and must not ship")
for z in sorted((root / "skills-to-upload").glob("*.zip")):
    problems.append(f"{z.relative_to(root)} is a customer's own skill and must not ship")

if "Setup status: not started" not in (root / "setup/progress.md").read_text():
    problems.append("setup/progress.md is not blank")
if re.search(r"^- \[[xX]\]", (root / "setup/progress.md").read_text(), re.M):
    problems.append("setup/progress.md has a ticked step")

# The shipped permissions never include a tool that sends, deletes or posts
perms = json.loads((root / ".claude/settings.json").read_text()).get("permissions", {}).get("allow", [])
if any(re.search(r"send|delete|trash|post|forward|reply|publish|schedule", p, re.I) and p.startswith("mcp__") for p in perms):
    problems.append(".claude/settings.json pre-approves a tool that sends, deletes or posts")
if any(re.search(r"\b(curl|wget|ssh|scp|rm|sendmail)\b", p) for p in perms):
    problems.append(".claude/settings.json pre-approves a command that sends or deletes")
if "Setup: not done yet" not in (root / "CLAUDE.md").read_text():
    problems.append("CLAUDE.md says setup is done")

# A person's own photos and videos never ship: apps/<tool>/data/media may hold nothing but a .gitkeep
for f in sorted((root / "apps").glob("*/data/media/**/*")):
    if f.is_file() and f.name != ".gitkeep":
        problems.append(f"{f.relative_to(root)} is a person's own photo or video and must not ship")
for p in problems:
    print("  - " + p, file=sys.stderr)
sys.exit(1 if problems else 0)
PYEOF

# ---------- 2. Copy, leaving out what customers don't need ----------
mkdir -p "$OUT" "$DIST"
rsync -a \
  --exclude '.git' --exclude '.gitignore' --exclude 'dist' --exclude 'maintainers' \
  --exclude '.claude/launch.json' --exclude '.claude/settings.local.json' --exclude '.claude/.cc-writes' \
  --exclude '*.backup.json' --exclude '*.tmp-*' --exclude 'apps/home/data' --exclude '.DS_Store' --exclude '._*' --exclude 'Thumbs.db' --exclude 'desktop.ini' \
  --exclude '__pycache__' --exclude '*.pyc' \
  "$ROOT/" "$OUT/"
# Claude Code can leave empty .claude folders around the kit while it works; only the top one ships
find "$OUT" -mindepth 2 -type d -name .claude -empty -prune -exec rm -rf {} +

# ---------- 3. Checks ----------
for f in "START-HERE.md" "CLAUDE.md" "LICENSE" "README.md" "Open Content Machine.html" "apps/content/index.html" "apps/content/data/content.json" "apps/content/menu.json" "apps/content/home-boxes.js" "apps/content/claude-jobs.json" "apps/content/CLAUDE.md" "apps/content/ATTACH-CLAUDE.md" "apps/content/app/app.js" "apps/content/app/app.css" "apps/content/app/model.js" "apps/content/app/components.js" "apps/content/app/media.js" "apps/content/app/calendar.js" "apps/content/app/drawer.js" "apps/content/app/view-todo.js" "apps/content/app/view-ideas.js" "apps/content/app/view-research.js" "apps/content/app/view-platforms.js" "apps/content/app/hovercard.js" "apps/content/app/settings.js" "apps/content/app/view-health.js" "context/content.md" "setup/progress.md" "setup/05-get-to-know-the-business.md" "setup/content-01-your-business.md" "setup/content-02-your-platforms.md" "setup/content-03-research.md" "setup/content-04-first-plan.md" "setup/09-check-and-hand-over.md" "skills-to-upload/README.md" ".claude/skills/README.md" ".claude/settings.json" ".claude/skills/write-posts/references/platforms.md" "setup/scripts/save-key.sh" "setup/scripts/start-task-list.sh" "apps/server/server.js" "apps/server/server.py" "setup/connections/README.md" "toolkit.json" "ATTACHING.md" "apps/installed.json" "apps/shared/catalogue.json" "apps/shared/VERSION" "apps/shared/sidebar.css" "apps/shared/js/sidebar.js" "apps/shared/js/theme.js" "apps/shared/js/braindump.js" ".claude/skills/sort-brain-dump/SKILL.md" "apps/shared/images/claude-icon.png" "apps/home/index.html" "apps/home/home.js" "apps/home/home.css" "apps/shared/fonts/Figtree-Variable.woff2" "docs/CUSTOMISING.md" "docs/PRIVACY-AND-SAFETY.md"; do
  [ -e "$OUT/$f" ] || fail "missing $f"
done
for f in apps/content/data/content.json apps/content/menu.json apps/content/claude-jobs.json toolkit.json apps/installed.json apps/shared/catalogue.json .claude/settings.json; do
  python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "$OUT/$f" || fail "$f is not valid"
done
# A fresh download lists only Content Machine OS, and no test tool ever ships
python3 -c 'import json,sys; t=json.load(open(sys.argv[1]))["tools"]; sys.exit(0 if [x["id"] for x in t]==["content"] else 1)' "$OUT/apps/installed.json" || fail "apps/installed.json must list only Content Machine OS"
python3 -c 'import json,sys; t=json.load(open(sys.argv[1])); sys.exit(0 if t.get("id")=="content" else 1)' "$OUT/toolkit.json" || fail "toolkit.json must have id content"
[ ! -e "$OUT/apps/test-tool" ] || fail "the test tool is in the release"
# The data file must be listed, in both places that track it
for f in apps/installed.json toolkit.json; do
  python3 -c '
import json, sys
d = json.load(open(sys.argv[1]))
entries = d["tools"] if "tools" in d else [d]
for t in entries:
    if t.get("id") == "content":
        sys.exit(0 if "apps/content/data/content.json" in (t.get("dataFiles") or []) else 1)
sys.exit(1)
' "$OUT/$f" || fail "$f must list apps/content/data/content.json"
done
# Photos and videos need the helper told this tool keeps them, in both places that track it
for f in apps/installed.json toolkit.json; do
  python3 -c '
import json, sys
d = json.load(open(sys.argv[1]))
entries = d["tools"] if "tools" in d else [d]
sys.exit(0 if any(t.get("id") == "content" and t.get("media") is True for t in entries) else 1)
' "$OUT/$f" || fail "$f must mark the content tool with \"media\": true"
done
# Every skill toolkit.json lists exists, with a name that matches its folder and a description
python3 - "$OUT" <<'PYEOF' || fail "a skill listed in toolkit.json is missing or has a bad header"
import json, sys, pathlib, re
out = pathlib.Path(sys.argv[1])
bad = []
for s in json.load(open(out / "toolkit.json"))["skills"]:
    f = out / ".claude/skills" / s / "SKILL.md"
    if not f.exists():
        bad.append(f"{s}: no SKILL.md"); continue
    head = f.read_text().split("---")[1] if f.read_text().startswith("---") else ""
    if not re.search(r"^name: " + re.escape(s) + r"$", head, re.M):
        bad.append(f"{s}: name in the header doesn't match the folder")
    if not re.search(r"^description: .{20,}", head, re.M):
        bad.append(f"{s}: no description")
for s in json.load(open(out / "toolkit.json"))["setupSteps"] + json.load(open(out / "toolkit.json"))["contextFiles"]:
    if not (out / s).exists():
        bad.append(f"{s}: listed in toolkit.json but missing")
for b in bad:
    print("  - " + b, file=sys.stderr)
sys.exit(1 if bad else 0)
PYEOF
# The 3 jobs the app can ask for must each point at a skill that exists
python3 - "$OUT" <<'PYEOF' || fail "apps/content/claude-jobs.json must have exactly research-my-market, plan-my-content and write-posts, each with a skill"
import json, sys, pathlib
out = pathlib.Path(sys.argv[1])
jobs = json.load(open(out / "apps/content/claude-jobs.json"))["jobs"]
ok = sorted(jobs) == ["plan-my-content", "research-my-market", "write-posts"]
for name, j in jobs.items():
    ok = ok and (out / ".claude/skills" / name / "SKILL.md").exists() and j["prompt"].rstrip().endswith("Change nothing else.") and j.get("label")
sys.exit(0 if ok else 1)
PYEOF

# Syntax-check the app's scripts
for f in "$OUT"/apps/content/app/*.js "$OUT/apps/content/home-boxes.js"; do
  node --check "$f" || fail "$f has a syntax error"
done
# No stray backup or in-progress save files
if find "$OUT" -name '*.backup.json' -o -name '*.tmp-*' -o -name '__pycache__' | grep -q .; then
  fail "a backup, in-progress save file or __pycache__ was left in the kit: $(find "$OUT" -name '*.backup.json' -o -name '*.tmp-*' -o -name '__pycache__' | head -3)"
fi

# No em dash anywhere shipped, except the vendored shared fonts licence
HITS=$(found -rIl $'\xe2\x80\x94' "$OUT" --exclude='OFL.txt')
[ -z "$HITS" ] || fail "an em dash slipped in: $(printf '%s\n' "$HITS" | head -3)"
# No customer-banned words in README.md and START-HERE.md
BANNED='leverage|synergy|game-changer|seamless|cutting-edge|streamline|empower|unlock|robust|holistic|transformative|AI-powered|going forward|touch base|circle back|to be fair|at the end of the day|GAIP'
HITS=$(found -EinH "$BANNED" "$OUT/README.md" "$OUT/START-HERE.md")
[ -z "$HITS" ] || fail "a banned word is in README.md or START-HERE.md: $(printf '%s\n' "$HITS" | head -3)"
# The old tool's name must not linger in anything this tool owns. (ATTACHING.md and apps/shared,
# apps/home and apps/server are shared and may name other tools.) Every path is checked to exist first.
OLD='skill-map|skill map|skillmap|skill and folder map|skill-and-folder|Pipeline OS Licence'
OLD_PATHS=("$OUT/README.md" "$OUT/START-HERE.md" "$OUT/CLAUDE.md" "$OUT/LICENSE" "$OUT/toolkit.json" "$OUT/Open Content Machine.html" "$OUT/docs" "$OUT"/setup/*.md "$OUT/context" "$OUT/apps/content" "$OUT/apps/installed.json" "$OUT/skills-to-upload" "$OUT/.claude/settings.json" "$OUT/.claude/skills/README.md")
for skill in setup write-posts research-my-market build-my-content-skill plan-my-content turn-this-into-posts use-my-case-study content-check-in ive-posted-it sort-content-brain-dump; do
  OLD_PATHS+=("$OUT/.claude/skills/$skill")
done
for path in "${OLD_PATHS[@]}"; do
  [ -e "$path" ] || fail "the old-name check expects $path and it isn't there"
done
HITS=$(found -rEiIl "$OLD" "${OLD_PATHS[@]}")
[ -z "$HITS" ] || fail "an old tool name is still in a file this tool owns: $(printf '%s\n' "$HITS" | head -3)"
# Customer-facing words: the README, START-HERE, docs and setup steps never say these
HITS=$(found -rEinH "\b(delve|game-changer|elevate)\b" "$OUT/README.md" "$OUT/START-HERE.md" "$OUT/docs" "$OUT"/setup/*.md)
[ -z "$HITS" ] || fail "a banned word is in the README, START-HERE, docs or setup steps: $(printf '%s\n' "$HITS" | head -3)"
# Words that belong to builders, not customers, in what the app shows on screen: the text in the page and
# every quoted piece of text with a space in it (a quoted name with no space is code, not wording)
python3 - "$OUT" <<'SCREENEOF' || fail "a word customers shouldn't see is in what the app shows (listed above)"
import pathlib, re, sys
out = pathlib.Path(sys.argv[1])
WORDS = re.compile(r"\b(agent|repo|repository|artifact|JSON|schema|API|MCP)\b", re.I)
STRING = re.compile(r'"(?:[^"\\\n]|\\.)*"|\'(?:[^\'\\\n]|\\.)*\'')
problems = []

def strip_comments(text):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return re.sub(r"(^|\s)//[^\n]*", r"\1", text)

for f in sorted((out / "apps/content/app").glob("*.js")) + [out / "apps/content/home-boxes.js"]:
    for lit in STRING.findall(strip_comments(f.read_text())):
        m = WORDS.search(lit)
        if " " in lit and m:
            problems.append(f"{f.relative_to(out)}: '{m.group(0)}' in {lit[:70]}")

page = (out / "apps/content/index.html").read_text()
page = re.sub(r"<!--.*?-->|<script.*?</script>|<style.*?</style>", "", page, flags=re.S)
shown = re.findall(r">([^<>]+)<", page) + re.findall(r'(?:title|aria-label|placeholder|alt|content)="([^"]*)"', page)
for text in shown:
    m = WORDS.search(text)
    if m:
        problems.append(f"apps/content/index.html: '{m.group(0)}' in {text.strip()[:70]}")

for line in problems:
    print("  - " + line, file=sys.stderr)
sys.exit(1 if problems else 0)
SCREENEOF

SKILLS=$(find "$OUT/.claude/skills" -name SKILL.md | wc -l | tr -d ' ')

# ---------- 4. Zip (COPYFILE_DISABLE stops macOS adding hidden ._ files) ----------
rm -f "$DIST/content-machine-os.zip"
(cd "$STAGE" && COPYFILE_DISABLE=1 zip -rqX "$DIST/content-machine-os.zip" "$NAME")
echo "Built dist/content-machine-os.zip ($(du -h "$DIST/content-machine-os.zip" | cut -f1 | tr -d ' '), $SKILLS skills)"
