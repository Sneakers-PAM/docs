---
title: Requests and approvals
description: Ask for access to a secret, decide other people's requests, and confirm what your agents asked for.
---

# 🙋 Requests and approvals

Two kinds of asking happen in Sneakers-PAM, and each has its own page:

| | You ask for | Where it's decided |
|---|---|---|
| **Access request** | Read access to a secret you can't read at all | **Requests** |
| **Reveal approval** | A value of a secret that's set to need an approval, by you or by one of your agents | **Approvals** (the button in the header, with a badge) |

Either way, the person asking never decides. An owner of the secret or a designated approver does.

## 📨 Asking for access {#asking-for-access}

1. On the secret you can't read, choose **Request access**.
2. Under **Why do you need it?** say what you need it for. Approvers read this before they decide.
3. Send it. It waits until someone who can approve for that secret acts on it.

When it's approved you can read the secret for the time the approver chose (1 to 24 hours). Your
pending requests are under **Your open requests** on **Requests**, where you can cancel one. A
stale request expires on its own.

## ✅ Deciding access requests {#deciding-requests}

**Requests** shows, under **Awaiting your approval**, the requests for secrets you own or can
approve. Open one, read the reason, then approve it with the number of hours, or deny it. Requests
to move a secret into a personal folder are marked **Move request · needs a site admin**; only a
site admin decides those.

Resolved requests stay in the list for 90 days, then they're removed.

## 🤖 Approvals: reveals that need a yes {#approvals}

A secret can be set to need an approval for a reveal ([who decides](../admin-guide/approval-policy.md#who-approves-a-reveal)).
When you, or an agent working with your token, reveals one, the request lands in **Approvals**:

- **Requests for secrets you own or approve:** decide them. Each shows who asked and, for an agent,
  what it says it's doing (**Agent says**) and the command it wants to run with the value.
- **Your own requests still waiting:** you can't approve them, but you can withdraw them.

Approving asks for your second factor (an authenticator code, a passkey, or an emailed code) unless
you stepped up within your step-up window. Denying needs none.

### One task, one page

An agent groups the requests of one task into a run, and sends you a link to the run's page. You
see every request of the task together and decide them in one go, with one second factor. Once
you confirm a run, its later requests go through without asking again for an hour. After an
approval, the agent can collect each value once, within 60 seconds.

### When nobody else can decide

On an install with only you, or for an always-approve secret where you're the only owner or
approver, there's nobody else to ask. Instead of waiting, you confirm the task yourself once with
your second factor: **Confirm this task**. It never shows up as you approving your own request.

## 🎫 Use grants {#use-grants}

Open your account menu and choose **Use grants** to let one of your tokens use chosen secrets in
chosen programs without asking each time, for up to 24 hours. You pick the secrets (or one folder,
which includes its subfolders and secrets added later), the programs, and whether the agent may
see the value at all. Revoke a grant when you're done. Without a grant, every use waits for you in
**Approvals**.

A grant stands in only for your own confirmation; it never replaces another owner's or approver's
decision.

## 📝 What's recorded {#recorded}

Every request, decision, withdrawal and confirmation is in the [audit trail](../admin-guide/audit.md),
with the action it unlocked. A denied request is evidence too.
