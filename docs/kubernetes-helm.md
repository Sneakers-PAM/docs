---
title: Kubernetes with Helm
description: Install Sneakers-PAM on your own Kubernetes cluster with the sneakers umbrella chart.
---

# ☸️ Kubernetes with Helm

The appliance is the recommended way to run Sneakers-PAM. Helm on your own Kubernetes is the
supported alternative: it installs the same services from the same pinned release
(`sneakers-release`), and the things the appliance does for you become yours.

| | Appliance | Helm |
|---|---|---|
| Upgrades | Signed packages from `:8443`, with automatic fallback | `helm upgrade`, when you run it |
| Kubernetes | k0s, pinned in the release | Your cluster |
| TLS and the public edge | Built in | Your ingress controller and certificates |
| Backups | The recovery keys and the escrow | Yours: PostgreSQL and the Secrets below |

## ✅ Requirements {#requirements}

- Kubernetes 1.36 or newer, and Helm 3.14 or newer (or Helm 4).
- An ingress controller (or another edge) that terminates TLS for your public host and passes
  `X-Forwarded-Proto: https` through.
- A CNI that enforces NetworkPolicies; without one, the policies the chart creates do nothing.
- A default StorageClass for the bundled PostgreSQL and Valkey, or the class set in the values.
- For ACME certificates, cert-manager of your own. The chart never installs cert-manager, an
  ingress controller or any CRD.

## 🛠️ Install {#install}

The charts aren't published to a registry yet, so install from a checkout of
[sneakers-release](https://github.com/Sneakers-PAM/sneakers-release). Add the Valkey and Ory chart
repositories its `docs/install.md` names, then build the umbrella chart's dependencies:

```bash
helm dependency build charts/sneakers
```

Make the vault's root key first. It's 32 random bytes, and it is permanent for the database:
without it no stored secret can be opened. Keep a copy somewhere safe.

```bash
kubectl create namespace sneakers
kubectl -n sneakers create secret generic sneakers-vault-root-key \
  --from-literal=VAULT_ROOT_KEK="$(openssl rand -base64 32)"
```

Install with your public host, then run the chart's tests:

```bash
helm install sneakers charts/sneakers -n sneakers \
  --set global.host=sneakers.example.org \
  --set vault.secretEnv.VAULT_ROOT_KEK.secretName=sneakers-vault-root-key
helm test sneakers -n sneakers
```

Install one release per namespace. On the first start the services can restart once or twice
while PostgreSQL initialises; each applies its own migrations under a lock.

:::tip[k0s clusters]

On k0s the service-account token issuer is `https://kubernetes.default.svc`, not the kubeadm
default. Set `global.workloadIdentityIssuer: https://kubernetes.default.svc`, or every
service-to-service call is refused. `kubectl get --raw /.well-known/openid-configuration` shows
your cluster's issuer.

:::

## 🔑 First-run setup {#setup}

The gateway's first-run setup is off until you give it a setup token. Put one in a Secret, point
`gateway.secretEnv.SETUP_TOKEN.secretName` at it, open `https://sneakers.example.org/admin/setup`
to create the first admin, then remove the value again.

## 🌐 The public edge {#edge}

The two web apps, the gateway, the MCP server and the SSH broker are the only services reached
from outside, all on `global.host`: the web app at `/`, the admin app at `/admin`, the gateway at
`/graphql`, `/machine`, `/auth`, `/setup` and `/oauth2`, the MCP server at `/mcp`, and the SSH
broker at `/ssh` (a WebSocket). Each chart can render an Ingress, off by default. TLS comes either
from a Secret you provide (the default) or from your own cert-manager Issuer.

## 🧩 Bring your own pieces {#byo}

PostgreSQL, Valkey and Ory Kratos come bundled and on by default; Ory Hydra is bundled and off.
Turn any of them off and point the services at your own. Single sign-on (SAML) goes through Ory
Polis, which isn't bundled. The release's `docs/install.md` has the values for each.

## ⬆️ Upgrades and backups {#upgrades}

- **Upgrade** with `helm upgrade` and the new release's chart. Generated passwords and keys are read
  back from their Secrets, so an upgrade never changes them.
- **Back up first:** the services migrate their schemas when the new pods start, and
  `helm rollback` doesn't roll a schema back.
- **Back up together:** the PostgreSQL databases, the vault root key Secret, `sneakers-bundled`,
  `sneakers-kratos` and `sneakers-hydra` when the bundled pieces are used, and any
  `sneakers-<service>-generated` Secret.

`helm uninstall sneakers -n sneakers` keeps the PostgreSQL volume and those Secrets, so a reinstall
under the same name finds the same data.
