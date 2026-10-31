# Heartbeat and rotation

A secret that's linked to a target (see [Secrets and folders](./secrets-and-folders.md)) can
be kept in sync with that target automatically.

## Heartbeat

The **heartbeat** periodically checks the secret's current value against its target and reports
one of a small set of states:

- **Verified** — the value on file still works against the target.
- **Drift** — the target no longer accepts the value on file.
- **Unreachable** — the target couldn't be reached to check: its name didn't resolve, the
  connection was refused or it timed out.
- **Failed: untrusted certificate** — the target answered, but its TLS certificate failed the
  check, so the value couldn't be tested.
- **Unknown** — no check has run yet, or the target isn't set up to be checked.

A drifting or unreachable secret is a signal something changed outside Sneakers-PAM — worth
looking into even before the next scheduled rotation.

An LDAPS target whose certificate fails its check reads as **Failed: untrusted certificate**, with
the reason in the heartbeat's detail, and the credential is never sent to it (see
[Untrusted certificate or unreachable](#untrusted-certificate-or-unreachable)). An LDAPS certificate
still has to chain to the system's roots. Pinning a target's TLS certificate, as you can pin an SSH
host key, isn't available yet: the connector can check pins, but nothing sets them.

A new secret of a heartbeat-capable type starts with its heartbeat **off** until it's actually
ready to check: it needs a target with a connection, and — for an SSH key — a host key pinned on
that target (see [Secrets and folders](./secrets-and-folders.md#ssh-host-keys)). Once that's in
place, switch heartbeat on from the secret's page; asking before then is refused, naming what's
still missing, rather than leaving it failing a check every few minutes against a target that was
never reachable in the first place.

### Untrusted certificate or unreachable

**Failed: untrusted certificate** means the network and the port are fine and the target answered
with a certificate the connector won't trust: it has expired, isn't valid yet, was issued for another
host name, or comes from an issuer that isn't trusted. The check stops there and the credential is
never sent. The result's detail gives the reason, for example "signed by Example Intermediate CA G1,
which isn't in the trusted CA list". So look at the certificate or the trusted CAs, not the network.

It's recorded as a failed check, counted with drift and notified like drift, and it's audited as
`secret.heartbeat.tls_certificate` with the reason. Through the MCP, `sneakers_test_secret` returns
`untrusted_certificate` with the same reason. Nothing is known about the value, though, so
it doesn't pause the schedule the way a rejected password does: the heartbeat keeps running at its
normal interval, and it clears by itself once the certificate is fixed.

**Unreachable** is kept for a real reachability failure. Nothing answered, so the heartbeat backs
off and tries again later, and it notifies only after several misses in a row.

A rotation that meets an untrusted certificate reports failed, and the password isn't changed.

## Rotation

**Rotation** changes a secret's value on the target and records the new value, either on a
schedule or on demand (as part of check-out and check-in, for example). A rotation reports as
rotated, in progress, degraded (it finished but something about the target looks off) or failed,
and a secret with no target attached is marked as not rotating, with a prompt to attach one.

Rotation and heartbeat work together: after a rotation, the next heartbeat confirms the new value
actually took.

For a secret attached to more than one target, both checks run per target and report per target:
rotation isn't "done" until every target has the new value, and a page showing the secret lists
which targets are still behind. Rolling a value already stored back to an earlier one never
rewrites history; it's recorded as a new version, like any other change.
