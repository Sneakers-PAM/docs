---
title: Why Sneakers-PAM
description: A privileged access manager you own outright, built so AI agents can use a credential without ever holding a copy.
slug: /why
---

# 🤔 Why Sneakers-PAM

A privileged access manager you own outright: a signed appliance you can roll back, built so AI
agents can use a credential without ever holding a copy.

## 🤖 Agents first {#agents-first}

- An agent signs in with its own token, never a person's password.
- It can use a secret without ever seeing it: [`sneakers-run`](./user-guide/agents-and-the-mcp.md#sneakers-run)
  hands the value straight to a command and masks it out of anything the command prints back.
- Every tool call is audited to the token that made it.
- Revoke one token — from **My tokens** — and every other agent keeps working.
- There's no break-glass for agents. The server refuses it to every API token, so the emergency
  path outside the normal approvals stays a people-only path.

## 🏠 You own it {#you-own-it}

- One signed appliance, on your own hypervisor — no cloud account to open.
- Fully offline if you want it: set the update source to **None** and carry the signed update
  file in by hand, the same signature check either way.
- Every unit has its own way back: a Base OS release that doesn't come up healthy reverts to the
  previous one by itself, and the product has an explicit Revert on the Updates page.

## 🔐 Security that tells the truth {#security-that-tells-the-truth}

- Secure Boot enrols its own organisation's keys, and the disk's state key seals into the TPM
  when the box has one. When either is missing, the admin page says so in plain words — "reduced,
  no TPM" or "reduced, Secure Boot off" — not a quiet downgrade.
- There's no standing root shell left open: SSH takes only the keys the box itself issued, plus a
  fresh TOTP code, into a closed command set. The root shell itself needs its own challenge and
  code from the admin page, is time-boxed, and every session is recorded.
- A reveal, a check-out, a break-glass session — every sensitive action lands in a hash-chained
  audit trail. A changed, deleted or reordered record is detectable, not just logged.

## 📟 Built by people who've carried the pager {#carried-the-pager}

- No stacked prompts during an outage: a password, then a second factor, then the second factor
  again. Owners decide and nobody approves their own request, so one task gets one prompt.
- Certificate and SSH-key fingerprints print in groups of four so they can be read aloud across a
  desk or down a phone line, not squinted at from a photo.
- A reboot shows a reboot page — on the console and in the browser — not a bare connection error.

## 🆓 Free and open source {#free-and-open-source}

- Apache-2.0, with no per-seat licence.

## 🚧 Where it's not there yet {#not-there-yet}

Sneakers-PAM is pre-1.0, built by a small team, with no 24/7 support contract behind it. Read this
before you bet production on it:

- **No high availability yet.** It's a single node.
- **No certifications yet.** An SSDF self-assessment, an SP 800-53 control mapping and a FIPS
  140-3 mode are planned for v0.2.0.
- **No session recording, and no Windows remote-desktop brokering.**
- **Rotation reaches directory accounts today** — Active Directory and Windows domain accounts,
  over LDAPS or Kerberos. There's no SSH key rotation yet, and a Windows local account's rotation
  needs the WinRM adapter, which isn't built yet. This isn't the connector catalogue of an
  established commercial PAM product yet.

See [Getting started](./getting-started.md) to try it, or the [security
page](./security.md) for how the project is built to limit blast radius in the meantime.
