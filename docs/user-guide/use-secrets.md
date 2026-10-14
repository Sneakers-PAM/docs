---
title: Use a secret
description: Reveal, copy and read out a value, open an SSH terminal in the browser, and look back through a secret's history.
---

# 👀 Use a secret

A secret's page shows its fields with every secret value masked. What you can do from there
depends on what the folder's rules give you and on the secret's type.

## 🔓 Reveal and copy {#reveal}

1. Open the secret.
2. Choose **Reveal** next to a field to show it, or **Copy** to put it on your clipboard without
   showing it.
3. Revealing says so: "Password revealed. This is logged." Every reveal and copy is written to the
   [audit trail](../admin-guide/audit.md) with your name.

In a folder's list, the copy button next to a secret copies its main secret value in one step,
under the same rules and the same audit entry.

:::tip[Reading a value out over the phone]

Under a revealed value, **Phonetic** spells it out on a numbered keypad (each character with its
word, capitals, digits and symbols in their own colours), and **Speak** reads it aloud in the
browser.

:::

### Super-sensitive fields

Card numbers, PINs, a Social Security Number, bank numbers and a certificate's private key are
super-sensitive. Revealing one shows a partial mask first; choose **Show all** for the whole value.

### When it asks for your second factor

If an admin turned on step-up for reveals, for the whole install or for this folder, the first
reveal after your step-up window has passed asks for your second factor. You aren't asked again
until the window ends ([step-up](./sign-in.md#step-up)).

## ✋ When a reveal needs an approval {#approval}

A secret can be set to need an approval. When it is, choosing **Reveal** doesn't show the value at
once: it asks the right person, and the field shows who it's waiting for.

- **Waiting for an owner or approver of this secret.** Someone else decides; nobody approves their
  own request. Once they approve, come back to the secret and the value is there to reveal.
- **Nobody else can approve this.** On an install with only you, or on an always-approve secret
  where you're the only owner or approver, you confirm it yourself once with your second factor,
  under **Confirm this task**.

Every reveal you make on one visit to the page belongs to one task, so they're decided together.
[Approval policy](../admin-guide/approval-policy.md) has the full rules.

## 🚫 When the value is locked {#locked}

- **Request access to reveal:** you can see the secret but can't read it. Ask for access
  ([Requests and approvals](./requests-and-approvals.md#asking-for-access)).
- **Check out first, so others know it's in use:** the secret is a check-out type. Check it out,
  then reveal it ([Check-out](./check-out.md)).
- **Checked out by someone else:** another person holds the lease. Wait for it to end, ask them,
  or, if it really can't wait, [break the glass](./break-glass.md).
- **Retired, restore to reveal:** the secret was retired. Someone who manages it can restore it.

## 💻 Open an SSH terminal in the browser {#terminal}

For an [SSH Key](../admin-guide/secret-types/ssh-key.md) secret with a target, the secret's
**Actions** menu offers **Open terminal**. You get an SSH session to the target in the browser,
signed in with the stored key. The key never reaches your browser, and the session's start and
end are audited.

The terminal works whichever way you opened Sneakers-PAM — a host name, an IPv4 address or an
IPv6 address — it connects back on that same address, so there's nothing extra to set up for a
box reached by IP.

A target with no pinned SSH host key is refused up front, before anything connects: a site admin
sees **Pin the host key** right there, and anyone else sees where an admin pins it
([Targets and connections](../admin-guide/targets-and-connections.md#host-keys)). Once a target is
pinned, the session connects only to a host presenting one of its pins. A connect that can't reach
the target, or stalls partway through, says why — such as "couldn't reach the box's terminal
service" or which step it got stuck on — instead of sitting on **Connecting** with no explanation.
Sessions end on their own after 8 hours.

## 🕰️ History and earlier versions {#history}

Every change to a secret makes a new version, and the secret's **History** shows them: who changed
it, when, and which fields changed, never the values. Everyone who can read the secret sees it.

Revealing an earlier value, or bringing one back with **Restore this version**, needs the
**recovery** role, which a site admin grants, and a fresh second factor. A restore changes only the
vault's copy; for a secret with a target, the next heartbeat then shows whether the target still
matches. A restore waits while the secret is checked out or a rotation is running.

## 📜 Certificates {#certificates}

An [SSL/PKI Certificate](../admin-guide/secret-types/ssl-cert.md) secret shows its subject,
issuer, names, key and how long it has left. **Export certificate** downloads it as PEM, with or
without the private key (a key can be re-encrypted with a passphrase). People who manage the secret
can replace the certificate and key from the same page when it's renewed.
