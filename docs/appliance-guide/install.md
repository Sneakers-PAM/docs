---
title: Install
description: Import the signed OVA on VMware, verify it first, or build your own image from a signed release.
---

# 🖥️ Install

## 📀 What ships today {#formats}

Each release publishes a VMware OVA, signed by the project's release key. ISO and Raspberry Pi
arm64 images are reserved file names in the release format, but neither writer is built yet, so
only the OVA installs today; this page updates once they do.

| File | Produced by a release | Installs on |
|---|---|---|
| `sneakers-appliance-<version>-amd64.ova` | Yes | VMware ESXi or vCenter |
| `sneakers-appliance-<version>-amd64.iso` | Not yet | — |
| `sneakers-appliance-<version>-arm64.img.xz` | Not yet | — |

## ✅ Verify before you import {#verify}

Every OVA ships with its `.sha256` and a `.sigstore.json` signature bundle from the release key.
Check both before you import it:

```bash
sha256sum -c sneakers-appliance-0.1.0-amd64.ova.sha256
cosign verify-blob \
  --key keys/production/cosign.pub \
  --bundle sneakers-appliance-0.1.0-amd64.ova.sigstore.json \
  --insecure-ignore-tlog=true \
  sneakers-appliance-0.1.0-amd64.ova
```

Use only `keys/production/cosign.pub` for a production download — never a lab key. The box itself
re-checks everything it boots from, but verifying the download first means you're not importing a
corrupted or tampered file in the first place.

## 🖧 Import on VMware {#vmware}

1. Download the OVA, its `.sha256` and its `.sigstore.json` from [the release on GitHub
   Releases](https://github.com/Sneakers-PAM/sneakers-appliance/releases), and verify it as above.
2. Deploy the OVA as a new VM. The vApp properties carry the host name and domain; fill them in if
   you already know what the box will be called (you can also set this later on the Network page).
3. **Before the first power-on**, clear the VM's Secure Boot keys (on ESXi/vCenter: the VM's Boot
   Options, Secure Boot, remove or reset the keys). The appliance enrols its own organisation keys
   on first boot and needs an empty key database to do it; a VM that already has a vendor's keys
   loaded can't enrol them.
4. Power the VM on. The console shows the start-up steps, then the `:8443` address, the
   certificate's fingerprint and a one-time setup code — continue with [First
   setup](./first-setup.md).

![The VM console while the appliance boots with Secure Boot.](/img/guides/first-boot-01-secure-boot.png)

## 🛠️ Build your own image {#build-your-own}

`sneakers-kit`, a small tool that verifies a signed release and writes install media from it (and
holds no private key of its own), can build the OVA yourself from a signed release instead of
downloading the published one:

```bash
sneakers-kit verify sneakers-os:0.1.0            # checks the whole signature chain, writes nothing
sneakers-kit build  sneakers-os:0.1.0 --format ova --out ./out
```

`verify` is the quickest way to confirm a release you already have access to (an internal mirror,
an offline copy) is genuine before building from it. `build` only ever moves its output into
`--out` once every check has passed; a refused or failed build leaves `--out` untouched. The kit
refuses a format it doesn't carry (ISO and arm64 images aren't built yet, as above) and refuses a
lab release on a production kit, or the reverse — see [Lab and production stay
separate](../security.md) for why that boundary exists.

## ☸️ Not using the appliance? {#helm}

Sneakers-PAM also runs as Helm charts on your own Kubernetes cluster — see [Kubernetes with
Helm](../kubernetes-helm.md) if you'd rather manage the cluster, TLS and backups yourself instead
of using the appliance.
