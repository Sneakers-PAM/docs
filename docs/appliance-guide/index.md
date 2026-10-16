---
title: Appliance admin guide
description: For whoever installs and looks after the box — install, first setup, updates, backups, protection levels and troubleshooting.
---

# 📦 Appliance admin guide

This guide is for whoever installs and looks after the appliance: the signed, single-node
operating system Sneakers-PAM runs on. It's a separate job from running the Sneakers-PAM site
itself — the [admin guide](../admin-guide/index.md) covers folders, permissions and the rest; the
appliance admin page never shows a secret.

![The appliance admin menu with every page listed.](/img/guides/status-02-menu.png)

## 🧭 In this guide {#guide}

- 🖥️ **[Install](./install.md):** import the OVA on VMware, verify the signature, or build your
  own image from a signed release with `sneakers-kit`.
- 🔧 **[First setup](./first-setup.md):** the console's setup code, the `:8443` admin page, the
  first appliance admin, the recovery keys, and installing and setting up the product itself.
- 📧 **[Email](./email.md):** the mail relay Sneakers-PAM sends through, its TLS and
  authentication settings, sending a test, and what to do when the test fails.
- 🔐 **[Protection levels](./protection.md):** full vs reduced protection, the TPM and key-file
  custody modes, and Secure Boot.
- 🔄 **[Updates and channels](./updates.md):** the three update units, the rc and stable channels,
  patches vs full downloads, and how a revert works.
- 💾 **[Backups and restore](./backups-and-restore.md):** the recovery keys and the escrow bundle,
  and restoring onto replacement hardware.
- 🖧 **[Console and shells](./console-and-shells.md):** the physical/serial console, SSH with
  box-issued keys, the closed shell, the root shell, and the MCP switch.
- 🛠️ **[Troubleshooting](./troubleshooting.md):** read-only diagnostics — the support bundle,
  logs and known issues. No workarounds: a real problem gets a real fix in a build.

## 🧩 One box, two admin surfaces {#surfaces}

| Surface | What it's for | Who uses it |
|---|---|---|
| `:8443` | The box itself: network, certificates, updates, admins, recovery keys, protection | An appliance admin |
| The product's own sign-in (443) | Sneakers-PAM: folders, secrets, users, policies | Everyone, per their role |

An appliance admin can look after the box without ever seeing a secret, and a Sneakers-PAM site
admin can run folders and policies without ever touching `:8443`. The same person often does both
on a small install, but the two jobs — and the two audit trails — stay separate.
