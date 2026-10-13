# Use case: a vault for AI agents

This page describes one way to use Sneakers-PAM: as the vault behind a set of AI agents.

AI agents do real work now: they deploy code, run migrations, call APIs and sign in to servers.
All of that needs credentials. Used this way, Sneakers-PAM gives agents one safe place to get
them. The vault holds the passwords, keys and tokens, and the agents query, store and manage them
through the Sneakers-PAM MCP server, so your development secrets don't leak into everything the
agents touch.

## The problem: agents leak credentials

An agent that needs a password usually gets it the quick way, and every quick way leaves a copy
behind:

- **Dotfiles and config files.** A token in a CLI config or an MCP client config sits in plain
  text in a home directory, readable by every tool and agent that runs as that user.
- **Env files.** A `.env` gets copied between projects, picked up by a build, or committed by
  mistake.
- **Prompts.** A value pasted into a chat goes to the model and stays in the conversation.
- **Logs and tool output.** A command that echoes its arguments, or an error that quotes its
  input, writes the value into a log.
- **Transcripts.** Agent sessions are saved, synced, shared and searched. Anything that passed
  through one is now in the transcript too.

Each copy is one more place the secret can leak from, and one more copy you can't rotate, revoke
or audit.

## The answer: the vault holds them, the MCP serves them

Secrets live in Sneakers-PAM, in [folders](../admin-guide/folders-and-permissions.md) with their own access
rules. Agents connect to the [MCP server](../user-guide/agents-and-the-mcp.md) and use its tools to work
with them:

- **Query:** find the secrets an agent may read, by name, folder or type, with metadata only, never
  values. List folders, secret types, targets and connection profiles.
- **Use:** run a command with a secret supplied to it, or read a single field when the task really
  needs the value.
- **Store:** create a secret, or generate one with a password that meets the policy, so a new
  credential goes straight into the vault instead of into a file. A value that already exists on
  disk goes in with `sneakers-put`, which reads it from the file, so it never passes through the
  agent session or the shell history.
- **Manage:** rename, move and retype secrets, organise folders, attach a secret to its target,
  check that the stored credential still works against that target, and turn
  [rotation and heartbeat](../admin-guide/rotation-and-heartbeat.md) on or off. The vault does the
  rotating, on its schedule.

The MCP server is a thin bridge. It holds no credentials of its own and no access logic: every
tool call goes to the vault as the agent that made it, and the vault decides.

## How it keeps them safe

### Every agent has its own identity

An agent signs in with its own token, never with a person's password or browser session:

- **A service account** for an agent that runs on its own. An admin mints its API token, which is
  shown once, and the token's scope is fixed when it's minted. With Ory Hydra, a client is linked
  to a service account and can only ever hold the groups a site admin allowed it.
- **A personal token** from `/login` for an agent you work alongside. It acts as you, with your
  live group membership, so it can never see more than you can.

The gateway checks the token again on every tool call, so revoking one agent's token stops that
agent at once, and every other agent keeps working.

### Values are used, not shown

The safest secret is one the agent never sees. `sneakers-run` runs one command with a secret
supplied on stdin or in a private temp file, without the value passing through the model:

- the use is bound to that exact command, and the value is released once;
- the command's output has the value masked, including its base64, hex and URL encodings;
- the temp file is removed when the command exits, and the agent's own token isn't passed to the
  command.

When a value does have to be revealed, it's audited as a reveal and flagged as one made to an
agent. Generating a secret returns the new value only when the agent asks for it. By default the
most sensitive fields aren't available to service accounts or personal tokens at all; an admin has
to turn on API access for them.

### Every action is audited, per agent and per task

The vault writes each tool call to the hash-chained [audit trail](../admin-guide/audit.md) as the
caller that made it, so the trail shows which agent read, revealed, created or changed what. The
MCP server's own logs name each caller by an opaque token id, never the token itself, and never
log arguments or values.

An agent groups the requests of one task into a run, with a one-line description of what it's
doing. The owner sees that description with the requests, and decides the whole task on one page.

### A human decides what's beyond the agent

An agent can't go past its scope by itself:

- A secret the agent can't read is refused. Access is asked for with an access request, and
  someone who can approve for that secret decides, never the one asking.
- For a secret with an [approval level](../admin-guide/approval-policy.md#who-approves-a-reveal), a reveal
  through a personal token waits for an owner or a designated approver. The agent opens the
  approval page in the browser, and a person approves with a second factor. On a one-user install
  you confirm the task once yourself.
- Break-glass isn't reachable through the MCP, and only a human site admin can change the SSH host
  keys pinned to a target.

A service account's reveals are never held for approval: its access rules are the limit. Give each
unattended agent its own service account, with access only to the folders it needs.

## Two ways to run it

### Self-hosted appliance

Run Sneakers-PAM yourself as a single-node appliance, built from a release the Sneakers-PAM org
has signed. Your vault, your keys and your audit trail stay on hardware you control. See
[Getting started](../getting-started.md).

:::info[Coming in v0.1.0]

The appliance images and the build kit that makes them.

:::

### Hosted (SaaS)

The same concept, run for you: the same vault rules, the same audit trail and the same MCP tools.
Your agents point at a hosted MCP URL instead of your own, and nothing else changes for them.

:::info[Planned]

A hosted option isn't offered yet.

:::

## Example: a Jarvis-style agent hub

Picture one person running a hub of agents: an operator agent that plans the work and hands it out,
a few coding agents, each in its own workspace, and an infrastructure agent that looks after the
network.

1. **One vault, many identities.** The person works alongside the operator and coding agents, so
   each of those signs in with its own personal token from `/login`, acting as that person. The
   nightly infrastructure agent runs on its own, so it gets a service account with access to the
   network folder only.
2. **No secrets in the workspaces.** None of the agents has a `.env`, a token in a dotfile, or a
   password in its prompt. Each MCP client config reads its token from the environment, and that's
   the only credential on the box.
3. **Use without seeing.** A coding agent runs a database migration with `sneakers-run`. The
   password goes to the migration tool on stdin and never shows up in the agent's transcript.
4. **Store as you go.** When the infrastructure agent needs a new device credential, it generates
   it with the MCP straight into the vault and attaches it to the device as its target, so the
   vault can check and rotate it from then on.
5. **One approval per task.** A deploy needs two secrets that are set to need approval. The agent
   asks for both under one run, and the owner approves the task once on one page.
6. **Clean up fast.** If the infrastructure agent misbehaves, an admin revokes its service account
   token. The other agents carry on, and the audit trail shows exactly what that one agent did.

See [Using the MCP](../user-guide/agents-and-the-mcp.md) for what to type to your assistant, and
[Agents and the MCP](../user-guide/agents-and-the-mcp.md) for how it fits together.
