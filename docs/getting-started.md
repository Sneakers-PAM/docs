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
[Install on Proxmox VE](./install-proxmox.md). It hasn't been tried on a real Proxmox VE host yet.

:::info[Coming in v0.1.0]

First boot enforces key-only SSH setup before anything else, then opens the
`:8443` OS admin for the rest of setup (vault root key, networking, the first admin account).

:::

## Upgrades and backups

:::info[Coming in v0.1.0]

Upgrades are whole, signed releases applied in a scheduled window with
automatic rollback on failure; see [Heartbeat and rotation](./concepts/heartbeat-and-rotation.md) and
the concepts pages for how the running system behaves once it's up. Backup and restore use a
separate key from the one you log in with, and are covered here once the appliance build lands.

:::

## Moving between appliances

:::info[Coming in v0.1.0]

`sneakers-migrate` will export a full encrypted bundle from a running
Sneakers-PAM appliance — secrets with every version, folders, ACLs, users and groups, targets
and schedules — and import it into a fresh one, re-wrapping every secret under the new root key.
The audit trail stays on the old appliance; the new one's chain starts with one record of the
import, naming the old appliance.

:::
