# Secrets and folders

A **secret** is a credential Sneakers-PAM stores on your behalf: a password, a key, a token, or
another sensitive value. Every secret keeps its full history — each past value stays available,
not just the current one — so you can see what changed and when. Changing a secret's type reads
in that history as the change it actually was (old type to new, fields added, renamed or carried
over), not just a list of fields that happen to differ.

A secret's type decides which fields it has, and some of them are required: a credential saved
with a required field left empty is refused, naming the field, the same way an invalid choice on
a drop-down field is. A secret that already had one empty from before this was enforced still
opens and works; the next edit that saves that field is what completes it.

Secrets live in **folders**, and folders can be nested. A folder is where access control actually
happens: who can see that a secret exists, who can reveal its value, who can approve a request for
it, and who is just kept informed. A secret inherits its folder's rules unless it has its own.

A secret can also be linked to one or more **targets** — the systems it actually protects, such as
a server account or a service's own config. One SSH key can open a session on every host it's
attached to, with no copies to keep in sync; attaching or detaching one target never disturbs the
others. That link is what makes [heartbeat and rotation](./heartbeat-and-rotation.md) possible:
Sneakers-PAM can check the secret against each of its targets, and change them together.

A secret's own page lists its attached targets, with an **Attach** picker for adding another and a
**Detach** button next to each one already there. Opening a terminal on an SSH Key or Password
Account (SSH) secret goes straight to the only target when it has just one; with more than one
attached, a short picker asks which to open the session on before it connects. A target's own page,
in turn, lists every secret attached to it — useful for seeing at a glance what else shares a
host's credential before changing or deleting the target.

### SSH host keys

A target reached over SSH carries its own pinned host keys — the public keys that identify the
real server, so a credential is never sent to an impostor. Pinning them is always a person's
decision, made from the admin app (Targets → Scan and pin): no token, agent or automated
request — not even a site admin's — can add, change or clear a target's pins. A secret whose
target has none of its host keys pinned yet can't heartbeat until a person pins one. Each attached
target keeps its own pins.

Values are never shown by default. Revealing one is a deliberate action, and it's logged every
time — see [Approvals and requests](./approvals.md) for how a reveal gets approved and the
[security page](../security.md) for how the project treats sensitive data generally.

Most access grants are either a plain yes or a plain no. One level is narrower: a service account
can be allowed to create and update secrets in a folder, but reveal only the ones it created
itself — never the folder's other secrets. That's meant for a machine that manages its own
credentials (a host storing its own local-admin password, say) without being handed read access to
everything else nearby.
