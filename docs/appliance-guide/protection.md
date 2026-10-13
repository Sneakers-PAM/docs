---
title: Protection levels
description: Full vs reduced protection, the TPM and key-file custody modes, and Secure Boot.
---

# 🔐 Protection levels

A single random 256-bit **state key** unlocks the box's encrypted state and backup volumes. Where
that key is kept, decided on first boot, is what sets the box's protection level — and it can't
change without a reinstall and a restore from the escrow bundle.

## 🧮 The two custody modes {#modes}

| Mode | Where the key lives | When it's used |
|---|---|---|
| TPM (the default when there is one) | Sealed in the TPM to the Secure Boot measurements (PCR 7 and 11 with Secure Boot on, PCR 4 and 11 with it off) | A TPM or vTPM is present and you didn't opt out on first boot |
| Key file | The first 32 bytes of a dedicated partition | No TPM at all (common on lab hypervisors without a vTPM, and on arm64 boards today), or you chose it on first boot |

There's no boot passphrase, and no key derived from the machine's identity: the key is 256 random
bits, sealed or stored, never typed.

![The console shows the protection level the box booted with.](/img/guides/first-boot-02-protection.png)

## 🚦 Full vs reduced {#levels}

| What's true | Level |
|---|---|
| No Secure Boot firmware at all | Reduced |
| Secure Boot off by choice, or not enforcing organisation-only keys | Reduced |
| Key-file custody (no TPM) | Reduced |
| TPM custody, with Secure Boot enforcing organisation-only keys | Full |

At reduced protection, the `:8443` Status page shows a banner naming the exact reason and how to
raise it. Any signed-in admin can hide the banner with a plain confirmation (no code needed); the
box remembers that acknowledgement across reboots and updates, and audits it. A new reason, or
protection dropping again after being raised, brings the banner back. The Status page's Protection
card always shows the current level, the reason and how to raise it, whether or not the banner is
hidden.

## ⬆️ Raising protection later {#raising}

Turning Secure Boot on later (or off, if you need to): the box keeps the previous protection's key
copy until the new one is proven to unseal, so a box never loses access to its own data mid-change.
Full protection needs both a TPM and the firmware enforcing organisation-only Secure Boot keys —
getting there from reduced protection usually means addressing whichever of those two is missing on
the hardware first.

![Setup: the protection summary.](/img/guides/setup-04-protection.png)

## 🗝️ Why this matters for backups {#backups}

The state key is also what the **escrow bundle** protects: see [Backups and
restore](./backups-and-restore.md) for the recovery keys that can decrypt it, and why you can't get
the data back without them if a TPM or key file is ever lost.
