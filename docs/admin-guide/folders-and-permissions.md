# Secrets and folders

A **secret** is a credential Sneakers-PAM stores on your behalf: a password, a key, a token, or
another sensitive value. Every secret keeps its full history — each past value stays available,
not just the current one — so you can see what changed and when.

Secrets live in **folders**, and folders can be nested. A folder is where access control actually
happens: who can see that a secret exists, who can reveal its value, who can approve a request for
it, and who is just kept informed. A secret inherits its folder's rules unless it has its own.

A secret can also be linked to a **target** — the system it actually protects, such as a server
account or a service's own config. That link is what makes [heartbeat and
rotation](./heartbeat-and-rotation.md) possible: Sneakers-PAM can check the secret against the
target, and change both together.

Values are never shown by default. Revealing one is a deliberate action, and it's logged every
time — see [Approvals and requests](./approvals.md) for how a reveal gets approved and the
[security page](../security.md) for how the project treats sensitive data generally.
