# ai-workflows-test

A webhook server that uses Claude CLI to respond to GitHub issues.

## Prerequisites

- Node.js 18+
- [Claude CLI](https://github.com/anthropics/claude-code) installed and authenticated
- A GitHub account with a repository

## Installation

```bash
npm install
```

## Configuration

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Webhook Bot")
4. Select the `repo` scope (for full repository access including issues)
5. Click "Generate token"
6. Copy the token

### 2. Set up environment variables

Create a `.env` file in the project root:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Set up a GitHub Webhook

1. Go to your GitHub repository → Settings → Webhooks
2. Click "Add webhook"
3. Configure:
   - **Payload URL**: Your server URL (e.g., `https://your-domain.com/webhook` or use ngrok for local development)
   - **Content type**: `application/json`
   - **Secret**: (optional) Add a secret for security
   - **Which events?**: Select "Let me select individual events" → check "Issues"
4. Click "Add webhook"

### 4. Expose your local server (for development)

If running locally, use [ngrok](https://ngrok.com/) to expose your server:

```bash
ngrok http 8000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it as your webhook Payload URL.

## Running the Server

```bash
node scripts/webhook-server.js
```

The server will start on `http://localhost:8000`.

## How It Works

1. When a new issue is opened in your GitHub repository, GitHub sends a webhook to your server
2. The server receives the webhook and extracts the issue body
3. Claude CLI is invoked with the issue body as a prompt
4. Claude's response is posted as a comment on the issue

## Testing

Create a new issue in your GitHub repository. Claude will automatically respond with a comment based on the issue body.