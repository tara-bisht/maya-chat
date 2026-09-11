# Agent skills

Project skills live once, under `.agents/skills/<name>/SKILL.md`.

Harness `skills/` directories are symlinks into this folder:

- `.grok/skills` → `.agents/skills`
- `.claude/skills` → `.agents/skills`
- `.cursor/skills` → `.agents/skills`
- `.codex/skills` → `.agents/skills`
- `.opencode/skills` → `.agents/skills`

Add a skill by creating `.agents/skills/<name>/SKILL.md`. Leave the harness `skills` paths as symlinks — a real directory there hides every skill from that harness.
