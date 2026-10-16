# Heartbeat and rotation

A secret that's linked to a target (see [Secrets and folders](./secrets-and-folders.md)) can
be kept in sync with that target automatically.

## Heartbeat

The **heartbeat** periodically checks the secret's current value against its target and reports
one of a small set of states:

- **Verified** — the value on file still works against the target.
- **Drift** — the target no longer accepts the value on file.
- **Unreachable** — the target couldn't be reached to check.
- **Unknown** — no check has run yet, or the target isn't set up to be checked.

A drifting or unreachable secret is a signal something changed outside Sneakers-PAM — worth
looking into even before the next scheduled rotation.

A new secret of a heartbeat-capable type starts with its heartbeat **off** until it's actually
ready to check: it needs a target with a connection, and — for an SSH key — a host key pinned on
that target (see [Secrets and folders](./secrets-and-folders.md#ssh-host-keys)). Once that's in
place, switch heartbeat on from the secret's page; asking before then is refused, naming what's
still missing, rather than leaving it failing a check every few minutes against a target that was
never reachable in the first place.

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
