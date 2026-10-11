---
title: Agents and the MCP
description: Connect an AI assistant to Sneakers-PAM, what you can ask it, and how sneakers-run and sneakers-put keep values out of transcripts.
---

# 🤖 Agents and the MCP

AI assistants and scripts need passwords and keys too. Instead of pasting a value into a chat or
an `.env` file, connect the assistant to Sneakers-PAM's MCP server. It then asks the vault for what
it needs, with its own token, under your rules, and everything it does is audited.

MCP stands for Model Context Protocol: the way AI assistants talk to tools. You don't need to know
how it works to use it; this page is what to set up and what to type.

## 🔌 Connect an assistant {#connect}

Your administrator turns the MCP server on and gives you its address. Then, in Sneakers-PAM, open
your account menu, choose **My tokens**, and follow **Connect an agent**:

1. **Add this server to your MCP client.** The page has the setup for Claude's CLI, Claude Desktop,
   VS Code, and a generic JSON shape for other clients, with the address filled in. For example,
   for Claude's CLI:

   ```bash
   claude mcp add --transport http sneakers https://sneakers.example.org/mcp
   ```

2. **Allow it in the browser.** The first time the assistant connects it opens a consent page. Name
   the token and allow it. You're asked for your second factor only if you signed in longer ago
   than your step-up window.
3. **Use your secrets.** Ask in plain words (below).

The token acts as you, with your current access: if you lose access to a folder, so does the
token. Tokens don't expire on their own; **My tokens** lists them, and you can revoke one at any
time, which stops that assistant at once without touching the others.

## 💬 Things you can ask {#asking}

### Find a secret

> "Find the database password for the billing service."

The assistant searches the secrets you can read, by name, folder or type, and sees names and
metadata only, never values.

### Look around

> "What secrets are in the staging folder?"

This lists names, not values. It's a safe way to explore.

### Run something with a secret, without seeing it

> "Run the migration with the billing database password, but don't show me the password."

This is the safest way to use a secret with an assistant: it uses
[`sneakers-run`](#sneakers-run), and the value goes straight to the command.

### Reveal a value

> "Reveal the API key for the weather service so I can test it."

The one that needs the most care. A reveal to an agent is audited and flagged as one made to an
agent. For a secret you can read it just works. If the secret is set to need an approval, the
assistant opens the approval page in your browser, and an owner or approver decides (never you),
or, when nobody else can, you confirm the task once ([Approvals](./requests-and-approvals.md#approvals)).

### Store and organise

> "Generate a new password for the build user and store it in the CI folder."

The assistant can create and generate secrets, rename, move and retype them, make folders, attach
a secret to its target, check a stored credential against its target, and turn rotation and
heartbeat on or off for a secret, all within your access. A secret that names you goes into your
personal folder unless you ask for another.

## 🏃 sneakers-run {#sneakers-run}

`sneakers-run` runs one command with one secret field handed to it, so the value never passes
through the assistant or your shell history:

```bash
export SNEAKERS_URL=https://sneakers.example.org SNEAKERS_TOKEN=snk_u_...
sneakers-run -secret <id> -- ssh admin@router-01                     # value on stdin
sneakers-run -secret <id> -inject file -- tool --key {secret_file}   # value in a private temp file
```

- The use is bound to that exact command, and the value is released once.
- The command's output has the value masked, including its base64, hex and URL encodings.
- A temp file is readable only by you and removed when the command exits. Your token is never
  passed to the command.
- When the use needs an approval, the approval link opens in your browser (`-no-open` only prints
  it). Several commands with the same `-run-id` share one approval page.

## 📥 sneakers-put {#sneakers-put}

`sneakers-put` stores a value that's already in a file, so it never goes through an agent session:

```bash
sneakers-put -folder <folder id> -type <type id> -name "router-01 admin" \
  -field username=admin -field password=@./router-01.pw
sneakers-put -id <secret id> -field password=@./new.pw
```

A secret field only takes a value from a file (`key=@path`) or stdin (`key=-`), never from the
command line. It prints the secret's id, name and what changed, never a value.

Both commands need a personal token (`snk_u_...`, from **My tokens**) and an `https://` address.
Install them with Go:

```bash
go install github.com/Sneakers-PAM/sneakers-mcp/cmd/sneakers-run@latest
go install github.com/Sneakers-PAM/sneakers-mcp/cmd/sneakers-put@latest
```

## 🛑 What an agent can't do {#limits}

- 🚫 **No break-glass.** Agents, the MCP server and every API token are refused by the server.
- 💻 **No SSH sessions.** Brokered SSH sessions are started by a person in the web app only; no
  MCP tool reaches the SSH broker.
- 🔒 **No super-sensitive fields** (card numbers, PINs, private keys and the like) unless an admin
  allows API access to them.
- 🙅 **No approving.** An agent can ask, never decide; approvals happen in the browser with a
  person's second factor.
- 📌 **No changing pinned SSH host keys.** Only a human site admin does that.

## 💡 Good habits {#habits}

- Prefer running a command with the secret over revealing it.
- Keep each assistant's token in an environment variable or your MCP client's secure store, never
  in a committed file.
- Give an assistant that runs on its own (a nightly job) a service account from your admin rather
  than your personal token ([MCP and agent tokens](../admin-guide/mcp-and-agent-tokens.md)).

For a whole set-up built around agents, see the [agent vault use case](../use-cases/agent-vault.md).
