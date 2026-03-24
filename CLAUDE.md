# CLAUDE.md

## Project goal

Recreating the fruit crush game so parents can play without being spammed by ads. Reference game: https://g.fromgame.com/game/539/

## Branch naming

- Features: `feature/short-description`
- Bugs: `fix/short-description`

## PR requirements

- Reference the issue number in the PR title e.g. "Fix login redirect (#42)"
- Include a brief summary of what changed and why
- Keep PRs small and focused — one issue per PR

## Code conventions

- Use named exports, not default exports
- Write tests for any new utility functions

## How to write a good issue

The agent is only as good as the instructions you give it. Follow this structure:

```
**Goal**
One sentence describing the desired end state.

**Requirements**
- Specific, testable requirement
- Another requirement
- Edge case to handle

**Acceptance criteria**
- [ ] Checkbox list of what "done" looks like

**Relevant files**
- src/path/to/relevant-file.ts
- src/path/to/another-file.ts

**Constraints**
- Do not change the public API shape
- Must be backward compatible
```

## What NOT to do

- Do not change package.json dependencies without flagging it
- Do not modify the database schema without a migration file

