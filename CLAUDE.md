@AGENTS.md

## Claude Code notes

- **`gh` accounts:** this repo has multiple GitHub CLI accounts configured. `radiolabme` is the collaborator with write/ADMIN access; `stuffbucket` is READ-only and is often the active account. Run `gh auth switch --user radiolabme` before any PR create/edit/merge, or those calls fail with "must be a collaborator" / "does not have the correct permissions."
- **`pre-push` runs the full validation suite** (lint, type-check, content validation, unit tests, build — ~20s) via a Husky hook. Pushes are not instant; expect the hook to run and gate the push.
- **Deploy = publish.** Pushing or merging to `main` triggers `deploy.yml` and the change is live at [microhams.com](https://microhams.com) within a minute or two. There is no staging environment.
- **Public repository.** Never commit secrets, personal contact details, or anything you would not publish — git history is permanent and world-readable.
