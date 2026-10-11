# Break-glass

Normal access in Sneakers-PAM goes through the owner's rules and, often, an [approval](./approvals.md).
**Break-glass** is the deliberately narrower emergency path for when that normal route isn't fast
enough or isn't available — a production incident, for instance.

Using it requires a reason and a six-digit code, not just a click. Once in, every field of the
secret is shown at once, with a copy action and a clear "hide and end" to close out the session.

Break-glass access is treated as a high-severity event everywhere in the product:

- the secret's page shows an active, hard-to-miss "break glass active" marker;
- the action is recorded at the highest audit tier, not folded in with routine reveals;
- the secret is automatically queued for rotation afterward, so the value that was exposed during
  the emergency doesn't stay valid once things are calm.

Because it trades a normal approval step for speed, break-glass use is exactly the kind of record
a post-incident review should look at first.

## Break-the-glass mode for site admins

A site admin can't see other people's personal folders in the normal app. When an emergency needs
a secret in one of them, break-the-glass mode opens everything up for a short, recorded window:

- It's in the web app only, for site admins. Agents, personal tokens and service accounts can't use
  it.
- Starting it takes a reason and a second factor. Nobody approves it; it's recorded instead.
- While it's on, the admin sees every folder and secret, personal ones included, and a banner on
  every page says so, with an Exit. It grants no edit rights.
- Each secret revealed is a break-glass reveal: a fresh second factor, the secret's owners are
  alerted, and a rotation is queued.
- It ends on Exit or by itself after 15 minutes.
- The audit trail shows each session as one entered and one left entry, expandable to every secret
  revealed in it, so who saw what is always on record.
