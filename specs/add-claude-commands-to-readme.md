# Chore: Add Claude Commands to README

## Chore Description
Add documentation for the Claude CLI commands used by the webhook server to the README.md file. This will help users understand how Claude is invoked programmatically and what CLI flags are being used, improving developer experience and making the project more maintainable.

## Relevant Files
Use these files to resolve the chore:

- `README.md` - The main documentation file that needs to be updated with Claude CLI command documentation. Currently references Claude CLI but doesn't explain the specific commands used.
- `scripts/webhook-server.js` - Contains the actual Claude CLI invocation with flags `-p`, `--print`, and `--dangerously-skip-permissions`. This is the source of truth for what commands need to be documented.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Claude Commands Section to README.md
- Open `README.md` for editing
- Add a new section titled "## Claude CLI Commands" after the "How It Works" section (line 72) and before "Testing" section
- Document the following Claude CLI command used in the project:
  ```bash
  claude -p "<prompt>" --print --dangerously-skip-permissions
  ```
- Explain each flag:
  - `-p "<prompt>"` - Passes the prompt directly as a command line argument
  - `--print` - Outputs the response to stdout (instead of interactive mode)
  - `--dangerously-skip-permissions` - Skips permission prompts for automated/non-interactive use
- Add a note that environment variables `TERM=dumb` and `NO_COLOR=1` are set to ensure clean output without ANSI codes

### Step 2: Run Validation Commands
- Execute the validation commands below to ensure the changes are correct and the README is properly formatted

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `cat README.md | grep -A 20 "Claude CLI Commands"` - Verify the new Claude CLI Commands section exists and contains the expected content
- `node -c scripts/webhook-server.js` - Verify the webhook server script is still valid JavaScript (no accidental changes)

## Notes
- The Claude CLI command in webhook-server.js (line 12) uses `spawn('claude', ['-p', prompt, '--print', '--dangerously-skip-permissions'], ...)` which translates to the command documented above
- The `--dangerously-skip-permissions` flag is important for automated workflows as it allows Claude to run without interactive permission prompts
- Consider linking to the official Claude CLI documentation at https://github.com/anthropics/claude-code for users who want more details on available flags
