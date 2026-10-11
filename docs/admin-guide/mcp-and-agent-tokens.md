# Agents and the MCP

Coding agents and other automated tools often need a credential just as much as a person does —
to reach a database, call an API, or sign in to a target on someone's behalf. Sneakers-PAM's MCP
server lets an agent do that through the same vault, the same [approvals](./approvals.md),
and the same audit trail a person would use, rather than a credential being copied into a config
file or an environment variable somewhere it can't be tracked.

## How it fits together

An agent talks to the MCP server using the Model Context Protocol. The server exposes a small set
of tools — finding secrets, listing folders, revealing or generating a value, running something
against a target with a secret injected rather than exposed — backed by the same gateway the
staff and admin apps use. Nothing the agent does skips the vault's normal rules.

## Why it's treated carefully

Handing a value to an automated agent is riskier than showing it to a person on a screen: it can't
double-check context, and a mistake can run at machine speed. Requests that would reveal a secret's
value directly to an agent are flagged distinctly from an ordinary reveal, and approving one of
these carries its own extra warning. An agent follows the same
[approval rules](./approvals.md#who-approves-a-reveal) as you: no approval for a secret you can
read, unless the secret is set to need one, and then an owner or approver decides, never you.
After `/login` there's no further second-factor prompt for the agent. Where possible, prefer
a tool that runs a command with a secret injected over one that hands back the raw value.

See [Using the MCP](../mcp-guide.md) for a plain, prompt-by-prompt guide to working with it,
[Use case: a vault for AI agents](../use-cases/agent-vault.md) for how a hub of agents keeps its
credentials out of its workspaces, and [Security](../security.md) for how to report a problem with
the MCP server itself.
