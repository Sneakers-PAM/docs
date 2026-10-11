---
title: Documentation
description: The Sneakers-PAM guides for people who use it, the admins who run it, and the admins who look after the appliance.
slug: /
---

# 📚 Documentation

Sneakers-PAM is an open-source privileged access manager: a vault for the passwords, keys and
tokens that matter, with check-out, approvals, rotation, break-glass and an audit trail nobody can
quietly edit, and an MCP server so AI agents use the same vault under the same rules. These guides
are written for the three people who meet it.

## 🧭 Pick your guide {#guides}

- 🙋 **[User guide](./user-guide/index.md):** for everyone who signs in to Sneakers-PAM. Find a
  secret, use it, check it out, ask for access, approve someone else's request, break the glass in
  an emergency, and let an AI assistant work with your secrets safely.
- 🛠️ **[Admin guide](./admin-guide/index.md):** for site admins and folder owners. Folders and
  permissions, the secret types, targets, rotation and heartbeat, the approval policy,
  break-glass, the audit trail, and tokens for agents and the MCP.
- 📦 **[Appliance admin guide](./appliance-guide/index.md):** for whoever installs and looks after
  the box. Install it, set it up, use the `:8443` admin page, the console and the closed shell,
  update it, keep its recovery keys and read its protection level.

New here? Start with [Getting started](./getting-started.md), which takes you from nothing to a
signed-in first admin.

## 🧩 How the pieces fit {#pieces}

| Piece | What it is | Who uses it |
|---|---|---|
| The web app | Where people find, use, share and approve secrets | Everyone |
| The admin app | Users, groups, folders, types, targets, policies and settings, at `/admin` | Site admins |
| The MCP server and `sneakers-run` | How AI agents and scripts use the vault with their own tokens | Agents, and the people they work for |
| The appliance | The signed single-node operating system Sneakers-PAM runs on, with its `:8443` admin page and console | Appliance admins |

The same vault, rules and audit trail sit behind all of them: an agent can't do anything its
person couldn't, and the appliance admin page manages the box, never the secrets in it.

## 🗺️ The rest of the docs {#more}

- [Use cases](./use-cases/index.md): how teams put Sneakers-PAM to work.
- [Kubernetes with Helm](./kubernetes-helm.md): the supported alternative to the appliance.
- [Security](./security.md), [Contributing](./contributing.md), [Governance](./governance.md)
  and [License](./license.md): the project itself.
