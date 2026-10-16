# Audit trail

Every sensitive action in Sneakers-PAM — a reveal, a check-out, an approval, a break-glass session
— is written to an append-only, hash-chained audit trail. Each record's hash covers the record
itself and the hash of the one before it, so an insert, edit, delete or reorder anywhere in the
trail is detectable: verifying the chain walks it end to end and names the first record that
doesn't fit.

Records come in two tiers:

- **Audit** — actions that touch or could touch a secret's value: reveals, check-outs,
  break-glass, rotation. These carry a solid marker, and a record involving a revealed value is
  flagged separately as sensitive.
- **Activity** — everything else worth keeping a history of, such as a request being opened or
  denied, shown with a lighter, dashed marker.

A routine, unchanged-result machine check (a heartbeat that still comes back fine) isn't written
one record at a time: it folds into a running daily summary for that secret, flushed as one record
at the first state change or when the day closes. A failure, a host-key refusal and every
person or agent action still get their own record, exactly as before — only the noise of a
healthy check running every few minutes is rolled up.

The trail records metadata about actions, never secret material itself — see
[Secrets and folders](./secrets-and-folders.md) for where the values themselves live, and
[Break-glass](./break-glass.md) for why that path in particular always lands at the audit
tier.
