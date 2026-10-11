---
title: Break glass
description: The audited emergency path to a secret you can read, when a check-out or an approval can't wait.
---

# 🚨 Break glass

Break-glass is for an emergency: a system is down, and the secret you need is checked out by
someone else, or waiting on an approval nobody can give in time. It skips those steps, and in
exchange it's loud: the owners are told at once, the value is rotated afterwards, and the record is
kept at the highest audit level.

It isn't a way around permissions. You can only break the glass on a secret you can already read.

## 🔨 Break the glass on a secret {#how}

1. Open the secret and, in its **Actions** menu, choose **Break glass…**.
2. Read what will happen:
   - **Every field is revealed**, skipping check-out and pending approvals.
   - **The folder's owners are notified** straight away.
   - **The secret is queued for rotation** once you're done.
3. Under **Reason**, say what the emergency is. Keep it specific: the owners and any later review
   read it.
4. Type a fresh **Authenticator code**. Break-glass always asks for one, whatever your step-up
   window says.
5. Choose **Break glass**. Every field of the secret is shown, with copy buttons, and the page shows
   a hard-to-miss **Break glass active** marker.

If the code is wrong the page says **That code didn't work. Try again.** and nothing is revealed.

## 🔒 Who can and can't {#who}

- Only a person, signed in to the web app. Agents, the MCP server, personal tokens, service
  accounts and any other API token can't break the glass: the server refuses them, whatever the
  client sends.
- Only on a secret you can read. For a secret you can't read, ask for access instead
  ([Requests and approvals](./requests-and-approvals.md)).

## 🧾 Afterwards {#afterwards}

- A rotatable secret is rotated, so the value that was exposed during the emergency stops working.
- The break-glass reveal is in the [audit trail](../admin-guide/audit.md) at the audit tier, with
  your reason, apart from routine reveals. It's the first thing a post-incident review looks at.

Site admins have a wider version for secrets in other people's personal folders; see
[Break-glass](../admin-guide/break-glass.md#break-the-glass-mode-for-site-admins) in the Admin guide.
