---
title: Audit trail
description: The hash-chained record of every sensitive action, searched, filtered, verified and exported from the admin app.
---

# 📜 Audit trail

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

The trail records metadata about actions, never secret material itself — see
[Secrets and folders](./folders-and-permissions.md) for where the values themselves live, and
[Break-glass](./break-glass.md) for why that path in particular always lands at the audit tier.

## 🔎 Reading the trail {#page}

A site admin opens the admin app's **Audit** page to search it:

- **Actor** and **Subject or resource** narrow to a name, username or id you type.
- **Hide actions** opens a checklist of every action seen in the trail; check one to drop it from
  the list (useful for filtering out routine noise, like sign-ins, while you look for something
  else).
- **When** narrows to the last 24 hours, 7 days, 30 days, a custom date range, or All. Outside
  "All time", the page reads up to the newest 2,000 records and keeps only the ones inside your
  window — on an install with a very long history, a custom range far enough back may come up
  empty even though matching records exist; narrow by actor or subject first to reach further
  back.
- **Show** sets how many records the page (and an export, below) returns: 25, 50, 100 or All.

Opening a record shows which fields changed (the old and new value for a plain field, or just
"changed, value hidden" for a sensitive one), its free-form attributes, and its place in the hash
chain: the previous record's hash and this record's own.

## ✅ Verifying the chain {#verify}

The page verifies the whole chain as soon as it loads: **Chain verified · N records**, with
**Verify again** to recheck on demand, or, if a record's hash or sequence doesn't match,
**Chain broken at #N** with a link straight to that first bad record. Records after a break can't
be trusted until it's explained.

## ⬇️ Exporting {#export}

**Export** downloads exactly the records your current filters and **Show** size return — as CSV
(for a spreadsheet) or JSON lines (one record per line, with its hashes, so the chain can be
checked outside Sneakers-PAM too). Raise **Show** to All first if you want the export to cover
more than one page.

## 🚨 Break-glass sessions {#break-glass-card}

The Audit page's own break-glass card lists recent break-glass sessions directly, without having
to filter for them by hand — see [Break-glass](./break-glass.md) for what a session covers and how
it's audited.
