---
title: User guide
description: Everything you do in Sneakers-PAM day to day, from signing in to approving a colleague's request.
---

# 🙋 User guide

This guide is for everyone who signs in to Sneakers-PAM: the people who look up a password, borrow
a shared admin account, ask for access, approve a request, or let an AI assistant use a secret.
You don't need to know how the vault works inside; each page says what to click and what happens.

## 🧭 What you'll do here {#pages}

1. 🔐 **[Sign in](./sign-in.md)** with your password and a second factor, and look after your
   authenticator and passkeys.
2. 🔎 **[Find secrets](./find-secrets.md)** on the dashboard, in folders, or by name.
3. 👀 **[Use a secret](./use-secrets.md):** reveal or copy a value, open an SSH terminal in the
   browser, and look back through a secret's history.
4. ✍️ **[Add and share secrets](./add-and-share.md)** in your personal folder or a shared one.
5. ⏱️ **[Check out](./check-out.md)** a shared account so you're the only one using it.
6. 🙋 **[Requests and approvals](./requests-and-approvals.md):** ask for access, and decide other
   people's requests.
7. 🚨 **[Break glass](./break-glass.md)** when there's an emergency and the normal path is too slow.
8. 🤖 **[Agents and the MCP](./agents-and-the-mcp.md):** let an AI assistant or a script use your
   secrets without ever pasting them.

## 💡 Three rules that hold everywhere {#rules}

- 🙈 **Values stay hidden until you ask.** Every secret field is masked. Revealing or copying one
  is a deliberate act, and it's written to the audit trail with your name.
- 🚫 **Nobody approves their own request.** When a secret needs an approval, someone else decides:
  an owner of the secret or a designated approver.
- 🤖 **An agent can't do more than you.** A token you give an assistant acts as you, with your
  current access, and everything it does is audited as that token.

Running the place rather than using it? See the [Admin guide](../admin-guide/index.md).
