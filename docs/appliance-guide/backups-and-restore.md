---
title: Backups and restore
description: The recovery keys and the escrow bundle, and restoring onto replacement hardware.
---

# 💾 Backups and restore

There's no dedicated `backup`/`restore` command in this release — the way back from lost hardware
is the **escrow bundle**, downloaded from `:8443` and decrypted with one of your recovery keys.

![The Backups page.](/img/guides/backups-01-page.png)

## 🔑 Recovery keys {#recovery-keys}

A box keeps up to three recovery keys: SSH public keys (`ssh-ed25519` or `ssh-rsa` — not a
hardware security key, because a restore mustn't need the physical key it was made on) added on
first setup and, after that, on `:8443`'s Access page. They're the only thing that can decrypt the
escrow bundle, and they're also the way back into the box if every admin is locked out.

## 📥 The escrow bundle {#escrow}

`:8443` can encrypt the box's state key and every other key the appliance seals (starting with the
Sneakers-PAM vault's root key and its TOTP encryption key) to your current recovery keys, as a
single downloadable file. **Download it right after the product is installed, and again after
anything that changes its keys** — an import, a reset, or adding a new recovery key — because each
download re-seals whatever has changed since the last one.

Keep the downloaded file somewhere other than the box itself: on disk right after downloading it is
a starting point, not the resting place. Move it to encrypted offline storage as soon as you can.

## 🏚️ Restoring onto replacement hardware {#restore}

If the box's TPM or key file is lost — failed hardware, a replacement VM — the data on its state
volume is unrecoverable without the escrow bundle. To move onto new hardware:

1. Decrypt the escrow bundle with one recovery key: `age -d -i <private key> escrow-*.age`. The
   result is JSON: an `items` map of each sealed item's name to its value.
2. On the **new** box's first boot, **before installing the product**, bring the decrypted bundle
   in through the key-custody import step. This only works during first boot, and only before
   anything is sealed on the new box yet.
3. Install the product as usual. When it makes its own keys for the first time, it finds the
   imported ones already there instead of generating new ones — so the vault's root key and the
   TOTP key are the old box's, and the restored data (brought back separately, through
   [migration](../migration-guide.md) or your own PostgreSQL restore) opens with them.

Without the vault's root key, no stored secret on that data will ever open again. Without the TOTP
key, everyone has to re-enrol their second factor. There is no way around either one — this is
exactly why the escrow bundle has to leave the box.

## 🗃️ What this doesn't cover {#scope}

The escrow bundle restores the appliance's own keys, not the Sneakers-PAM database itself. Back up
PostgreSQL the way you would any other database you run; the box's encrypted state and backup
volumes hold it, but a volume-level backup is outside what `:8443` does today.
