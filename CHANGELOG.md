(0.3.2) - 2026-03-30
- Fix: Use `App-Key` and `User-Token` headers for Runrun.it credentials
- Feature: Add full `Task` resource operations (get, getAll, create, update, delete, deliver, reopen, move, add manual work, change time worked, comments)
- Feature: Add `user` getAll with pagination
- Chore: Remove `company` resource

## Unreleased

- refactor: centralize HTTP requests and unify pagination UI for `getAll` across resources (added `makeRequest`, unified `returnAll` handling, updated pagination displayOptions)

