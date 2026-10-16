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

A secret can also be linked to a **target** — the system it actually protects, such as a server
account or a service's own config. That link is what makes [heartbeat and
rotation](./heartbeat-and-rotation.md) possible: Sneakers-PAM can check the secret against the
target, and change both together.

### SSH host keys

A target reached over SSH carries its own pinned host keys — the public keys that identify the
real server, so a credential is never sent to an impostor. Pinning them is always a person's
decision, made from the admin app (Targets → Scan and pin): no token, agent or automated
request — not even a site admin's — can add, change or clear a target's pins. A secret whose
target has none of its host keys pinned yet can't heartbeat until a person pins one.

Values are never shown by default. Revealing one is a deliberate action, and it's logged every
time — see [Approvals and requests](./approvals.md) for how a reveal gets approved and the
[security page](../security.md) for how the project treats sensitive data generally.
