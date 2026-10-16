---
title: Getting started
description: From nothing to a running Sneakers-PAM with its first admin, on the appliance or on your own Kubernetes.
---

# 🚀 Getting started

Sneakers-PAM runs one of two ways. Pick one, follow its steps, then hand people the
[User guide](./user-guide/index.md).

| | The appliance (recommended) | Helm on your own Kubernetes |
|---|---|---|
| What you get | A signed, single-node operating system that runs Sneakers-PAM on k0s, with the `:8443` admin page, the console and the closed shell | The same services from the same pinned release, as Helm charts |
| Updates | Signed update packages, staged and applied from `:8443`, with an automatic fallback to the previous release | `helm upgrade`, when you run it |
| You look after | The box's network, certificates, updates and recovery keys | The cluster, the ingress, TLS, PostgreSQL and the backups |
| Guide | [Appliance admin guide](./appliance-guide/index.md) | [Kubernetes with Helm](./kubernetes-helm.md) |

:::warning[Pre-1.0]

Sneakers-PAM is before its first stable release. Any release can still change how it installs,
updates or stores data, and there is no upgrade path promised between pre-releases. Try it in a
lab first.

:::

## 📦 On the appliance {#appliance}

1. **Get the image.** Each appliance release on
   [GitHub Releases](https://github.com/Sneakers-PAM/sneakers-appliance/releases) carries the OVA
   for VMware, `sneakers-appliance-<version>-amd64.ova`, with its SHA-256 and its signature by the
   project's release key. You can also build your own image from the signed release with
   `sneakers-kit` ([Install](./appliance-guide/install.md#build-your-own)).
2. **Check it.** Verify the checksum and the signature before you import it
   ([how](./appliance-guide/install.md#verify)).
3. **Import and boot it.** On VMware, clear the VM's Secure Boot keys before the first power-on so
   the box can enrol its own ([Install](./appliance-guide/install.md#vmware)).
4. **Set up the box.** The console shows the `:8443` address, the certificate's fingerprint and a
   one-time setup code. Open the address, type the code and create the first appliance admin
   ([First setup](./appliance-guide/first-setup.md)).
5. **Install the product.** On `:8443`, open **Updates** and install the Sneakers-PAM product
   bundle ([First setup](./appliance-guide/first-setup.md#install-the-product)).
6. **Set up Sneakers-PAM itself.** Read the one-time setup token from the closed shell with
   `sneakers setup-token`, open the link it prints and create the first Sneakers-PAM admin
   ([First setup](./appliance-guide/first-setup.md#product-setup)).

## ☸️ On your own Kubernetes {#helm}

1. Make the vault's root key and keep a copy: without it no stored secret can be opened.
2. Install the `sneakers` umbrella chart from a checkout of `sneakers-release`, with your public
   host name.
3. Give the gateway a setup token, run the first-run setup, then remove the token.

[Kubernetes with Helm](./kubernetes-helm.md) has the commands, the requirements and what you're
responsible for.

## 👣 Next steps {#next}

- Create folders, groups and the first shared secrets: [Admin guide](./admin-guide/index.md).
- Connect an AI assistant: [Agents and the MCP](./user-guide/agents-and-the-mcp.md).
- Read how the box protects its data: [Protection levels](./appliance-guide/protection.md).
