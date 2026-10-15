---
title: Users, groups and service accounts
description: Adding a person, grouping people for sharing, and giving an automated job its own account and tokens.
---

# 👥 Users, groups and service accounts

The admin app's **Access** section is where a site admin manages who Sneakers-PAM knows about —
people, the groups they're put in, and the accounts for automated jobs — separately from what
they're allowed to do, which is set on [folders](./folders-and-permissions.md).

## 🧑 Users {#users}

**Users** lists everyone who can sign in. A site admin can:

- **Create a local user:** name, username, email and a password (generated for you, shown once;
  copy it before you create the account). For an install with single sign-on, people usually
  arrive through that instead and never need a local account.
- **Make someone a site admin, or give the recovery role,** each with its own confirmation naming
  the person and the role.
- **Disable an account.** Their sign-in and every token they hold stop working at once. The root
  admin — created at first setup — can't be disabled or demoted, and you can't disable your own
  account.

## 👪 Groups {#groups}

**Groups** are a site admin's own way to bundle people for sharing and for scoping a service
account's tokens (below) — create one with a name, then add members by searching for them. A
folder's sharing rules (see [Folders and permissions](./folders-and-permissions.md#rules)) can
name a group the same way they'd name a person, so adding someone to a group gives them whatever
that group already has everywhere, without a separate rule on each folder.

## 🤖 Service accounts {#service-accounts}

A **service account** is an identity for a job that isn't a person — a pipeline, a scheduled
script, an integration — so it has its own access and its own audit trail instead of running on
someone's personal token.

1. **Service accounts > New service account:** give it a name and a description (what it's for
   and who owns it, so the next admin knows).
2. **Mint an API token** for it, and choose its **Token scope**: one or more groups. The token can
   reach only what those groups' folder rules give — there's no broader access to grant.
3. The token's value is shown once, to copy; nobody, admins included, can show it again. If it's
   lost, revoke it and mint a new one.
4. **Revoke** a token the moment it's no longer needed, rather than waiting for a cleanup pass; a
   service account can hold more than one, so you can roll one over without a gap.
5. **Disable** the whole service account to stop every token (and any linked OIDC client) it
   holds at once, without revoking each one by hand.

A service account can also be linked to an OIDC client for machine-to-machine sign-in; unlinking
the client doesn't touch its minted API tokens.

Security settings' **Allow API access to sensitive secrets** switch applies to a service
account's tokens the same way it applies to a personal token — see [Security
settings](./security-settings.md).
