const express = require('ultimate-express');
const { spawn } = require('child_process');
const app = express();
require('dotenv').config()

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.use(express.json());

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', prompt, '--print'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, TERM: 'dumb', NO_COLOR: '1' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Process exited with code ${code}: ${stderr}`));
      }
    });
  });
}

async function postGitHubComment(repo, issueNumber, body) {
  const response = await fetch(`https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

app.post('/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const { action, issue, repository } = req.body;

  if (event === 'issues' && action === 'opened') {
    console.log(`Issue #${issue.number} opened: "${issue.title}"`);
    console.log(`Body: ${issue.body}`);

    try {
      const joke = await runClaude(issue.body || 'Write a short joke');
      console.log('Claude says:', joke);

      await postGitHubComment(repository.full_name, issue.number, joke);
      console.log('Posted comment to issue');

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Error');
    }
    return;
  }

  res.status(200).send('OK');
});

app.listen(8000, () => {
  console.log('Webhook server listening on http://localhost:8000');
});
