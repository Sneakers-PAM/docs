---
title: Updates and channels
description: The three update units, the rc and stable channels, patches vs full downloads, and how a revert works.
---

# 🔄 Updates and channels

## 🧱 Three units, updated on their own {#units}

| Unit | Holds | Patch support |
|---|---|---|
| Base OS | The root image, the signed boot loader and the Secure Boot files | Yes — a small delta from the previous release |
| Base Web | The `:8443` admin pages | Not yet |
| Product | The installed product bundle (Sneakers-PAM) | Not yet |

A Base OS release always ships with a paired Base Web; the two travel together. Each unit keeps
whatever version it last shipped until a release updates it.

## 📡 Where updates come from {#source}

`:8443`'s Updates page has three source choices, set once by an owner:

- **Built-in** (the default): the project's GitHub Releases, filtered to the box's channel.
- **Manual mirror**: an internal web server of your own, for an air-gapped or firewalled site —
  plain HTTP works too, since every `.bin` is checked against the release key regardless of how it
  arrived; HTTPS adds transport privacy and, with a private CA added on the Certificates page, can
  trust an internal mirror's own certificate.
- **None**: the box never makes a network fetch for updates; every `.bin` is uploaded by hand
  through `:8443` or the console.

## 🚦 Channels {#channels}

| Channel | Tag shape | Who gets it |
|---|---|---|
| stable | `v<major>.<minor>.<patch>` | Boxes on the stable channel |
| rc | `v<major>.<minor>.<patch>-rc.<n>` | Boxes on the rc channel only — a stable-channel box never takes an rc |

![The Updates page: the running base and product versions and the mirror check.](/img/guides/updates-01-page.png)

## 📦 Patch vs full {#patch-vs-full}

When a box runs the exact previous Base OS release, Updates offers a **patch**: a much smaller
download that rebuilds the target release's root image from the one already on the box. The full
Base OS build is always available too, for a box that's more than one release behind, or that
skipped the patch.

## ✅ Applying an update {#applying}

Check now (or wait for the box's own schedule), review what's staged, then Apply:

1. **Verifying** — signature, channel and SHA-256 against the release key.
2. **Staging** into the inactive slot (Base OS) or the free product slot — the box keeps running
   the whole time.
3. **Switching slots** and, for Base OS, **rebooting** into the new slot.
4. **Checking health.** A Base OS update that doesn't come up healthy reverts to the previous slot
   by itself; the console's maintenance screen shows each step and what it's waiting on.
5. **Marking good.**

A product update instead restarts the product in order and brings it back up phase by phase
(cluster, data, identity, services, front), staying on the maintenance screen until it answers on
443 again. There's no automatic revert for a product update — see **Reverting** below.

Only one apply or revert runs at a time. Starting a second one while one is already under way —
another admin's apply, or the box's own automatic-update window landing while yours is still
going — is refused with **UPGRADE_BUSY**; wait for the first to finish, then retry.

## 🔁 Reinstalling the installed version {#reinstall}

A reinstall re-applies the version already running, keeping its data — useful when a product slot
is broken and there's no newer release to fix it with (Updates otherwise only offers newer
versions to apply). An owner gets **Reinstall \<version\>** on the Product card once Check now
reports the installed version as current; staging it works like staging any other bundle, and
applying it is the usual product apply (quiesce, slot switch, k0s restart, phases, health) — the
data stays, and the replaced copy is kept for **Revert**, same as any other product update.

Over SSH, an owner runs the same thing with `sneakers reinstall`, which stages the installed
version's bundle (fetching it from the update source first if it isn't already staged) and applies
it in one step. The box's own update window never starts a reinstall by itself; it always waits for
an owner to ask for one.

## ⏪ Reverting {#reverting}

- **Base OS** reverts to the other slot — the release that was running before the update — either
  automatically (boot counting, if the new release never comes up healthy) or from an admin's
  explicit Revert on the Updates page.
- **Base Web** reverts in place.
- **Product** reverts to the previous version, from the Updates page; there's no automatic
  fallback, so check the product's health after applying an update before you move on.

![The Status page after a revert.](/img/guides/updates-07-reverted.png)

## 🚪 Air-gapped sites {#air-gapped}

With the update source set to **None**, download the signed `.bin` files for your channel from
GitHub Releases on a connected machine, and upload them through `:8443`'s Updates page or the
console on the box itself. Verification is identical either way: the box never trusts a file
because of how it arrived, only because of its signature.
