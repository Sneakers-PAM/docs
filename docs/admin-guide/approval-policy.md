# Approvals and requests

Most of what you do with a secret you can read is self-service. An approval only comes in when a
secret is set to need one, and even then it's always someone other than the person asking who says
yes. The rules are the same in the web app and for an agent working through the
[MCP](./agents-and-mcp.md).

## Who approves a reveal

Each secret has an approval level, set on the secret's page by someone who can manage it:

- **Normal:** nobody approves anything.
- **Approval-required:** the secret's owners are exempt. Anyone else needs one owner to say yes.
- **Always-approve** (for something like a domain admin password): everyone needs a yes, owners
  included.

A secret's **owners** are the owners of its folder and of every folder above it, and a personal
folder's owner. A secret can have several. A **designated approver** is anyone the secret's access
rules give the approve permission (the "A" in its rules).

| You are… | Normal secret | Approval-required secret | Always-approve secret |
|---|---|---|---|
| An owner (one of possibly several) | Just works | Just works (owners are exempt) | Another owner or a designated approver approves. Never you. |
| Not an owner, but you can read it (shared with you, or through the folder) | Just works | Any one owner of the secret approves | An owner or a designated approver approves |
| No read access | Refused. Ask for access. | Refused. Ask for access. | Refused. Ask for access. |
| An emergency, with no one able to approve in time | [Break-the-glass](./break-glass.md) | [Break-the-glass](./break-glass.md) | [Break-the-glass](./break-glass.md) |
| A site admin in break-the-glass mode | [Break-the-glass mode](./break-glass.md#break-the-glass-mode-for-site-admins): web app only, a reason and your second factor, no approver. The owners are alerted on each reveal; the audit trail shows one entered and one left entry per session. | [Break-the-glass mode](./break-glass.md#break-the-glass-mode-for-site-admins): web app only, a reason and your second factor, no approver. The owners are alerted on each reveal; the audit trail shows one entered and one left entry per session. | [Break-the-glass mode](./break-glass.md#break-the-glass-mode-for-site-admins): web app only, a reason and your second factor, no approver. The owners are alerted on each reveal; the audit trail shows one entered and one left entry per session. |

Nobody ever approves their own request. In the approvals list you see two things: other people's
requests for secrets you own or approve, which you decide, and your own requests that are still
waiting, which you can withdraw. Using a secret in a command with `sneakers-run` follows the same
rules as a reveal.

## When nobody else can approve

| Situation | What happens |
|---|---|
| A one-user install (for example, a home lab box) | Nothing waits on another person. A secret that needs no approval just works. A secret that does shows one confirmation for the whole task: you confirm once with your second factor. |
| An always-approve secret where you're the only owner or approver | The same: one confirmation with your second factor for the whole task. It never goes through the approvals list, and it's never you approving your own request. |
| A secret that needs an approval but has no active owner or approver, in an install with other people | The request is refused straight away instead of waiting for nobody. An admin can give the secret's folder an owner. |

## Create, update and the other actions

| Action | Approval? |
|---|---|
| Create or generate a secret in a folder you can write to | Never |
| Update or rotate a secret you can write | Never |
| Approve someone else's request (as an owner or approver) | No extra approval. The web app asks for your second factor if your step-up window has run out. |
| Use a secret in a command (`sneakers-run`) | The same rules as a reveal, from the table above |

## Second factor (MFA)

| | Web app | MCP (agents) |
|---|---|---|
| Signing in | Password and a second factor | `/login` once, with a second factor |
| Approving or confirming a request | A step-up, then no more prompts for 30 minutes | Not on this path: approvals and confirmations happen in the web app |
| Revealing or copying, where an admin has turned on step-up for reveals | A step-up, then no more prompts for 30 minutes | None for anything you can read |
| Break-the-glass | Always a second factor | Not available through the MCP |

The 30-minute window is one setting for the whole install (`MFA_MAX_AGE`, from `0` for every time
up to 4 hours). Step-up on reveal is off by default; an admin can turn it on for the whole install
or for a folder and everything in it.

## One task, one prompt

The requests one task raises share one page. An agent passes the same run on every request of the
task, and every reveal you make on one visit to a secret's page does the same, so the requests are
decided or confirmed together, once. After you confirm a task, its later requests go through
without asking again for an hour. Requests someone else decides wait in their approvals list
together with the rest of the task, so they can decide them in one go.

## Requesting access

When you can't read a secret at all, you send an **access request**: a short reason, attached to the
specific secret you need. It waits until someone who can approve for that secret acts on it, never
you. You can cancel a pending request at any time, and a stale request eventually expires on its
own.

## What gets logged

Every request, decision and confirmation is recorded in the [audit trail](./audit.md), along with
the action it unlocked. Denials and withdrawals are recorded too. A request is evidence either way.
