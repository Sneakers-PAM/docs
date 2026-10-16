---
title: Troubleshooting
description: Read-only diagnostics — the support bundle, logs and known issues. No workarounds.
---

# 🛠️ Troubleshooting

This page is diagnostics, not fixes. If a real problem turns up, it gets a real fix shipped in a
build, not a workaround you repeat by hand on every box.

## 📦 The support bundle {#support-bundle}

`support-bundle` (closed shell) is meant to stream the box's status, logs and settings — with no
secrets — as an archive, for sending to whoever's debugging an issue. It isn't built yet in this
release; a product-neutral framework for it is planned before the v0.1.0 final release, with the
base owning a timeout per command, redaction and the download, and the product declaring its own
sections. Until then, use the commands and the root shell below directly.

## 📜 Logs {#logs}

`logs export` (streaming the box's own logs as an archive) is also not available yet. In the
meantime, `:8443`'s Logs page shows the OS audit log (every appliance-level action: sign-ins,
updates, resets, network changes), and a root shell gives you the product's own logs through
`kubectl -n sneakers logs deploy/<service> --tail 50` (or `--previous` for a container that
restarted).

![The Logs and audit page with the appliance audit trail.](/img/guides/logs-01-page.png)

## 🧰 Root-shell diagnostics {#busybox}

The root shell is busybox ash (v1.38), not a full Linux userland, so a few familiar flags and
tools aren't there. Use these instead:

| Instead of | Use |
|---|---|
| `ps -e` / `ps -o ...` | `ps \| grep <name>` or `ps \| awk '...'` |
| `stat -c ...` | `ls --full-time <file>` for size and time |
| `pgrep <name>` | `ps \| grep <name>` |
| `findmnt` | `cat /proc/mounts`, or `mount \| grep <path>` |

`df -hP` keeps each volume on one line (handy in a script); `watch -n 2 kubectl get pods -A`
re-runs a check every two seconds. Check what's actually in the build with `busybox --list` before
assuming a tool is missing rather than just named differently.

## 🔎 A few known issues {#known-issues}

These are real signatures from the project's own issue log, not hypotheticals. Each is already
fixed in a later build unless marked otherwise — check your installed version against the one
named.

- **Pods stuck `ContainerCreating` right after a reboot**, with events showing
  `FailedCreatePodSandBox ... plugin type="bridge" ... exec: already started`: a CNI installer
  race, fixed in a later Base OS build. `kubectl get events -A --field-selector
  reason=FailedCreatePodSandBox` confirms it; a plain `no IP ranges specified` on first start is a
  normal, harmless transient and not this issue.
- **Services restart a few times right after boot** (`kubectl -n sneakers get pods` shows a
  non-zero restart count on identity, vault, workflow or Kratos): an early one-shot connection
  attempt before dependencies were ready, fixed in later service builds. Check `kubectl -n
  sneakers logs deploy/<service> --previous --tail 20` for a `dial tcp` or "server misbehaving"
  error near boot time.
- **An update or reinstall looks stuck on "Rolling out" or "Starting k0s" for a long time**:
  `kubectl -n sneakers get deploy,sts -A -L k0s.k0sproject.io/stack` and the step the Updates page
  names will usually show which deployment never came up; this is one of the areas still being
  hardened before v0.1.0 final, so check the known-issues notes for your exact build before
  assuming it's new.
- **A fresh, empty database right after `sneakers reset`** is expected, not data loss: `sneakers
  reset` removes the product's data by design. Check `:8443`'s Logs (OS audit) for a
  `product.reset` entry at that time to confirm it was asked for.
- **The OAuth issuer still shows an old host name after a host-name change**: expected until you
  run **Updates > Reinstall the same version**, which re-places the running stacks with the new
  name; a plain host-name edit on the Network page alone doesn't do it.

## 🙅 No workarounds {#no-workarounds}

If something here doesn't match what you're seeing, or a "known issue" fix doesn't land it for
you, that's worth reporting rather than working around: a repeated manual fix on every box is
exactly the kind of cost this appliance is meant to remove.
