---
title: Security settings
description: The site-wide switches for super-sensitive fields, MFA on checkout and MFA on reveal.
---

# 🔐 Security settings

A site admin sets these on the admin app's **Security settings** page. They take effect at once,
for the whole site unless the setting says otherwise. "Super-sensitive" means a field its [secret
type](./secret-types/index.md) marks that way: a card number, a PIN, an SSN or a certificate's
private key.

| Setting | Default | What it does |
|---|---|---|
| **Allow API access to sensitive secrets** | Off | Off: service accounts and personal tokens (agents, scripts, `sneakers-run`) can't reveal, prepare or redeem a super-sensitive field. They still reach ordinary password and sensitive fields under their usual access. On: they get super-sensitive fields too, under the same access rules. People signed in to the web app are never affected either way. |
| **Require MFA for sensitive checkout** | On | On: checking out a secret whose type has any super-sensitive field needs a second factor from within the step-up window; otherwise the checkout is refused and asks for one. Other types aren't affected. Off: no extra MFA check at checkout. |
| **Require MFA before a reveal** | Off | On: before a person reveals or copies a sensitive field, a second factor older than the step-up window is refused and the web app asks again. A folder can override this for itself and everything under it (inherit, require, or off); the nearest folder that sets one wins, and only a site admin sets a folder's override. Agents and service accounts are exempt — the [MCP guide](../user-guide/agents-and-the-mcp.md#limits) covers what they can and can't do instead. |

## 🧮 How the switches interact {#interactions}

- Turning off **Allow API access to sensitive secrets** doesn't touch ordinary fields: a service
  account can still read a plain password field on a super-sensitive type, just not the
  super-sensitive field itself.
- **Require MFA before a reveal** and the per-folder override only ever apply to a person in the
  web app. There's no agent-facing equivalent, because an agent's token already can't reach
  super-sensitive fields unless the API switch above is on.
- The step-up window itself — how long a second factor stays "fresh" before the site asks again —
  is one setting for the whole install; see [Approvals and
  requests](./approval-policy.md#second-factor-mfa).

## 📝 What gets logged {#audit}

Changing any of these settings is written to the [audit trail](./audit.md), with the admin who
changed it and the setting's old and new value. A reveal or checkout that a setting refused is
logged too, so a run of refusals right after a setting changes is easy to trace back to the
change.
