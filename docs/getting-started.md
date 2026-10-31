# Getting started

Sneakers-PAM doesn't ship install media. Instead, each user builds their own appliance image
from a release the Sneakers-PAM org has signed — the build kit checks that signature and refuses
anything unsigned or modified. This keeps the chain of trust in the open: you can see exactly what
you're running, and you're never trusting a binary someone else built for you.

## What you'll end up with

A single-node appliance running the vault, identity, workflow, audit and related services, on a
pinned, signed release.

:::info[Coming in v0.1.0]

The ISO, OVA and AMI image formats, the closed admin shell and `:8443` OS admin
page for setup, backups and upgrades, and scheduled automatic updates applied in a maintenance
window you control.

:::

## Before you start

- A signed release from `sneakers-release` (the pinned manifest and chart set).
- The `sneakers-appliance` build kit, which turns that release into a bootable image.
- A target to run it on: a hypervisor for an OVA, a USB drive or virtual media for an ISO, or an
  AWS account for an AMI.

## Build your image

:::info[Coming in v0.1.0]

The build kit and its exact command-line flow aren't published yet — this
section will walk through choosing an image format, pointing the kit at a signed release, and
verifying the signature before the image is built.

:::

## Install

On Proxmox VE, the appliance ships as a `qcow2` disk image from v0.1.0-rc.4: see
[Install on Proxmox VE](./install-proxmox.md).

:::info[Coming in v0.1.0]

First boot enforces key-only SSH setup before anything else, then opens the
`:8443` OS admin for the rest of setup (vault root key, networking, the first admin account).

:::

## The appliance admin pages

After setup, the box keeps its own admin pages at `https://<address>:8443/`, with a sign-in of
their own, separate from your Sneakers-PAM account.

- **Getting there as root.** Signed in to the admin console as root, open the account menu and
  choose **Appliance admin**. It opens `https://<host name>:8443/` in a new tab, using the host
  name the box reports for itself. No other account gets the item, and it isn't there on a plain
  Kubernetes install or when the box doesn't know its host name. The link doesn't sign you in:
  the appliance admin asks for its own sign-in.
- **No autofill.** The browser and password managers (1Password, LastPass, Bitwarden) don't fill
  in the fields on these pages, so your own sign-in never lands in the email settings' relay
  username and password. The same goes for the network, backups, certificates, update mirror and
  access fields and the typed confirmations. Only the sign-in, the last sign-in step of setup, the
  current password when you change yours, and the authenticator code boxes leave autofill on.
- **Recovery keys aren't login keys.** The recovery key from setup is one you keep offline, and any
  one of them opens your backups if the box is lost. SSH and PuTTY won't accept it. To sign in over
  SSH, get a login key from the **Access** page, which also gives you a `.ppk` file for PuTTY.
- **Restarts take a while.** The box can take more than 5 minutes to come back after a reboot, and
  more than 5 minutes to come back when it starts after a shutdown. That's expected. The **Power**
  page and the `reboot` and `poweroff` commands say so before you confirm.
- **Updates.** A newer release that's still being published is skipped, with a note above the
  update cards naming it and why. The box offers the newest finished release instead, and picks up
  the newer one on a later check, once it's finished.
- **Network.** A network change is staged, reviewed and then committed. See
  [Changing the appliance's network](./appliance-network-guide.md).
- **Support.** The **Logs** page and the `support-bundle` command give you one text file for
  diagnosing the box. See [Getting a support bundle](./support-bundle-guide.md).

## Upgrades and backups

:::info[Coming in v0.1.0]

Upgrades are whole, signed releases applied in a scheduled window with
automatic rollback on failure; see [Heartbeat and rotation](./concepts/heartbeat-and-rotation.md) and
the concepts pages for how the running system behaves once it's up. Backup and restore use a
separate key from the one you log in with, and are covered here once the appliance build lands.

:::

An upgrade brings new built-ins with it, and you don't run setup again. Each time the vault starts
on a set-up install, it adds any built-in secret types, extension packs, connections and password
policies the release ships that the install doesn't have yet. It only adds: a built-in you already
have stays exactly as it is, even if you edited it, and one an admin deleted stays deleted.

## Moving between appliances

`sneakers-migrate` exports an encrypted bundle from a running Sneakers-PAM install: secrets,
folders, ACLs, users and groups, targets and schedules. The **Import** page on the new appliance's
`:8443` brings it in before the product's own first-run setup, and every secret is sealed again
under the new root key.

The bundle is in format 2.0:

- **The audit trail stays on the old appliance.** An audit trail belongs to the install that
  recorded it, so the export leaves it out. Keep the old appliance's history with that appliance,
  or offline, if you need it after you retire the box.
- **The new trail starts with one record.** Before anything else, the import adds one "imported
  from" record: the old appliance's name and version, the bundle's id, who ran the import and when,
  and how many folders, secrets and users came across. The new appliance's own events follow it.
- **`--source-name` sets the name in that record.** Without it, the export uses the host name of
  the machine it runs on.
- **A bundle in format 1.x is refused.** It carries the old trail, so the import stops before it
  writes anything. Export it again with a current `sneakers-migrate`.

```sh
sneakers-migrate export --current-only --reset-sign-in --source-name old-box.example.org \
  --recipient age1... --out real.age
```

The `--recipient` value comes from the new appliance's **Import** page. The whole move, step by
step, is in
[Moving onto the appliance](https://github.com/Sneakers-PAM/sneakers-release/blob/main/docs/migrate-appliance.md).
