---
title: Migration guide
description: Moving an existing Sneakers install's users, secrets and folders onto a fresh appliance or Kubernetes install, with the Import page.
---

# 🚚 Migration guide

This guide is for moving an **existing** Sneakers-PAM (or legacy Sneakers) install's data — users,
groups, secrets, folders and the audit chain — onto a fresh box or cluster, through the `:8443`
Import page. It assumes you already have [a box set up](./appliance-guide/first-setup.md) but
haven't run the product's own first-run setup yet.

## 🧭 Before you start {#before}

- **Don't run `/admin/setup`.** An import brings the data in before the product's own setup, and
  setup refuses once it's done. If the box already has a product installed and set up (you ran
  setup by mistake, or you're re-using a box), remove it first with `sneakers reset` over SSH —
  an owner's action that empties the product and its data but keeps the box's own admins, keys,
  certificates and network. Apply the product again from Updates, then open Import before setup.
- **Open the Import page first, before anyone visits the new box's sign-in page.** Once the import
  switch is on, the box goes into maintenance: PostgreSQL, the identity service, the vault and the
  audit service keep running (so the import has something to write to), but sign-in and the MCP
  are held at zero until the import closes.

## 📋 The steps {#steps}

The Import page runs one step at a time, each against the bundle and mapping you upload:

1. **Open.** Turns the import switch on and shows the box's **import key** — an encryption
   identity made on the box itself, which never leaves it. Your export has to be encrypted to this
   key.
2. **Upload.** The export bundle, and, if you're not using a straight Sneakers-to-Sneakers export,
   a mapping file or a proposal sheet for converting from another product's export shape.
3. **Review.** A dry run: counts and a mapping template, with nothing written yet.
4. **Convert** (if you started from a proposal sheet rather than a ready mapping file).
5. **Check.** Validates the mapping against the bundle before anything is imported.
6. **Import.** Brings the data in. With a named first admin, this step also makes that admin a
   one-time password, shown once on the page and removed as soon as it's read; everyone else sets
   a password with "Forgot password" and enrols their second factor at first sign-in.
7. **Verify.** Waits for the product to be fully ready again (every workload rolled out and
   healthy) before it reports done.
8. **Close.** Turns the import switch off, removes the import key and the export from the box, and
   lets the held services scale back up. Download anything you want to keep from the step reports
   before you close — they go with the import directory.

There's no rollback: if an import turns out wrong, fix whatever caused it and import again with
**Re-import**, which empties the product's data first. A re-import replaces an earlier import; a
box whose data didn't come from an import at all refuses it.

## 🧪 Rehearsing first {#rehearsal}

If your tooling supports a rehearsal mode, run it before the real cutover: a rehearsal import, a
check of what landed, then a close, all before anyone depends on the new box. Two lessons worth
carrying into any rehearsal or cutover plan:

- **Nobody can sign in while an import is open, by design** — the close is what lets anyone in,
  and it also removes the one-time password, so show it to whoever needs it before you close, not
  after.
- **A box only answers its own name once DNS (or your hosts file) points at it.** If you need to
  reach the new box by its real name before the production cutover — to test sign-in, or a web
  terminal session, which needs the served name — a short-lived, local override (a hosts-file
  entry on the machine you're testing from) is the usual way, provided you remove it again right
  after. While it's in place, *everything* on that machine resolves the name to the new box, so
  keep the window short and specific.

## 🔐 Keys, after the import {#keys}

Once the import lands on a box whose protection relies on an escrow bundle (see [Backups and
restore](./appliance-guide/backups-and-restore.md)), download a fresh escrow right away: an import
changes the keys the box has sealed, and an escrow taken before the import won't contain them.

## 🏷️ Naming things during a migration {#naming}

If the new box's host name is wrong — set after the import, or changed as part of the cutover —
fixing it needs **Updates > Reinstall the same version** afterward, not just a Network page edit:
a host-name change alone doesn't re-place the running services with the new name, and a few
internals (notably the OAuth issuer) still show the old one until you reinstall.
