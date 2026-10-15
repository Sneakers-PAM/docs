---
title: Admin guide
description: For site admins and folder owners — folders, permissions, secret types, targets, rotation, approvals, break-glass, audit and agent tokens.
---

# 🛠️ Admin guide

This guide is for people who manage a Sneakers-PAM site: folder owners who decide who sees what,
and site admins who run the whole install. It assumes you're already signed in — see the [user
guide](../user-guide/index.md) if you need the basics of signing in and using a secret first.

## 🗂️ Running the site {#running}

- 📁 **[Folders and permissions](./folders-and-permissions.md):** how secrets and folders fit
  together, and who can see, reveal, approve or just hear about each one.
- 👥 **[Users, groups and service accounts](./users-groups-and-service-accounts.md):** adding a
  person, grouping people for sharing, and giving an automated job its own account and tokens.
- 🧩 **[Secret types](./secret-types/index.md):** every built-in type, its fields, and which of
  them support a heartbeat, rotation or check-out.
- 🔌 **[Targets and connections](./targets-and-connections.md):** linking a secret to the system
  it actually protects, so Sneakers-PAM can check and change it there.
- 🔄 **[Heartbeat and rotation](./rotation-and-heartbeat.md):** keeping a secret's value in sync
  with its target, on a schedule or on demand.
- ✅ **[Approvals and requests](./approval-policy.md):** who approves a reveal, when nobody else
  can, and how one task gets one prompt.
- 🔐 **[Security settings](./security-settings.md):** the site-wide switches for super-sensitive
  fields, MFA on checkout and MFA on reveal.
- 🚨 **[Break-glass](./break-glass.md):** the emergency path outside the planned approvals, for
  people only — agents and tokens can't use it.
- 📜 **[Audit trail](./audit.md):** the hash-chained log every sensitive action lands in.
- 🤖 **[MCP and agent tokens](./mcp-and-agent-tokens.md):** turning on the MCP server and issuing
  tokens for agents and automation.

## 🧭 Who does what {#roles}

| Role | What it adds |
|---|---|
| Anyone with access | Read, reveal and use whatever a folder's rules give them |
| A folder owner | Also approves requests for that folder's secrets, and authors (creates, edits) in it |
| A designated approver | Approves requests for the specific secrets a folder's rules name them on, without owning the folder |
| A site admin | Reads everything, manages secret types, targets, connections and security settings; is never an automatic approver or author |

A site admin's broad read access is for running the site, not for everyday use: see
[break-glass](./break-glass.md#break-the-glass-mode-for-site-admins) for the one path that lets an
admin reveal someone else's personal secrets, and why it's recorded the way it is.

## 📦 Looking after the box {#appliance}

If you also run the appliance itself — the signed operating system Sneakers-PAM ships on — see the
[appliance admin guide](../appliance-guide/index.md) for install, updates, backups and
troubleshooting. That's a separate job from running the site above: an appliance admin manages the
box, never the secrets in it.
