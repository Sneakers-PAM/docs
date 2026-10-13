---
title: Targets and connections
description: Linking a secret to the system it actually protects, so Sneakers-PAM can check and change it there.
---

# 🔌 Targets and connections

A **target** is the system a secret actually protects — a server, a directory account, a
database. Attaching a secret to a target is what makes [heartbeat and
rotation](./rotation-and-heartbeat.md) possible: without one, a secret is just stored, with
nothing to check it against.

## 🏗️ Setting one up {#setup}

A site admin creates the target (its host, port and, where the protocol needs it, its domain or
Kerberos realm) and a **connection**, which names the protocol and, through
`privileged_secret_id`, the credential the connector uses to reach the target. Saving a connection
or changing its privileged secret is a site-admin action, and it's audited.

## 🔑 Pinning SSH host keys {#host-keys}

A target's `ssh_host_keys` list holds the OpenSSH public keys (authorized_keys form, one per line)
the SSH broker and the SSH connector accept for that target — public keys, never secrets. Only a
human site admin can add, change or clear the list (anyone who can already edit the target can
keep the pins it already has); the change is audited with the fingerprints added and removed,
never the keys themselves.

An **unpinned target refuses every connection** — a web SSH session and the connector's own
heartbeat and rotation checks alike — until someone pins it: open the target's page in the admin
app and choose **Scan and pin…**, compare the fingerprint shown against the one you expect from
the box itself, and confirm. This protects the target too: without a pin, a repeated probe from
the connector could otherwise trip the target's own rate limiting.

## 🧮 What each protocol can do {#protocols}

The connection's protocol decides which adapter runs, and what it can actually do against the
target:

| Protocol | Heartbeat | Rotation |
|---|---|---|
| LDAP, LDAPS | Binds as the account | Changes the account's own password (use LDAPS against Active Directory: a plain LDAP bind can't change a password there) |
| Kerberos | Requests a ticket for the account | Changes the password over kpasswd (port 464 of the same host) |
| SSH | A public-key handshake as the account, only against a host presenting a pinned key; no command is run | Not supported — reports unreachable |
| WinRM, SAMR | Registered, but a placeholder today: reports unreachable | Registered, but a placeholder today: reports unreachable |
| Everything else (databases included) | No adapter yet: a secret can be attached to a target, but there's nothing to check it against | No adapter yet |

An SSH target with no usable pin, or whose host presents a key matching none of the pins, is
reported as a drift, never as a successful check — the connector never offers the account's key to
an unpinned or mismatched host.

## 🧭 Which secret types use this {#types}

The [secret types](./secret-types/index.md) that take a target are SSH Key, Database Account,
Password Account (SSH), Windows Account (Local), Windows Domain Account and Active Directory
Account — each type's own page says exactly what heartbeat and rotation it supports once a
connection is in place.
