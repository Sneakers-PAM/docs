---
title: Check-out and check-in
description: Borrow a shared account for a set time, so nobody else changes it under you, and hand it back rotated.
---

# ⏱️ Check-out and check-in

**Check-out** gives you exclusive, time-limited use of a secret. It's for a shared account, such
as a domain admin or a local administrator, where two people changing the password at once would
lock each other out, and where the value you saw shouldn't keep working after you're done.

The types that check out are [Active Directory Account](../admin-guide/secret-types/active-directory.md),
[Windows Domain Account](../admin-guide/secret-types/windows-domain.md),
[Windows Account (Local)](../admin-guide/secret-types/windows-local.md) and
[SSH Key](../admin-guide/secret-types/ssh-key.md). On those, the value stays locked until you check
the secret out: the page says **Check out first, so others know it's in use**.

## 🔑 Check out {#check-out}

1. Open the secret. The **Checkout** card says **Available**.
2. Pick the lease: **1h**, **2h** or **4h**.
3. Choose **Check out for 2 hours** (or the length you picked).
4. Sneakers-PAM rotates the account on its target to a new value, verifies the new value works,
   and starts your lease. Only then do the fields unlock for you to reveal or copy.

You need read access to the secret. Checking out a secret whose type has a super-sensitive field
asks for a fresh second factor (an admin can turn that off).

While you hold it, the card says **Held by you** with the time left, and the **Checkouts** page
lists every lease you hold. Anyone else who opens the secret sees **Checked out** and until when.

## ↩️ Check in {#check-in}

Choose **Check in now** when you're done. Sneakers-PAM rotates the password again, to a value
nobody has seen, and ends your lease. The value you used stops working the moment check-in
completes, and the page tells you so.

Only the person holding the lease can check it in, so nobody else can force a rotation under you.

:::note[What rotates today]

Rotation on check-out and check-in works for Active Directory and Windows domain accounts, over
LDAPS or Kerberos. There's no SSH key rotation yet: checking out an SSH Key secret gives you the
lease, and check-in ends it without changing the key. A Windows local account's rotation needs the
WinRM adapter, which isn't built yet.

:::

## ⌛ When the lease runs out {#expiry}

A lease that passes its end without a check-in is closed for you, and the secret is available
again; whoever checks it out next starts from a fresh rotation, the same as any check-out.

## 🚨 When someone else has it and it can't wait {#urgent}

The card says **Someone else has it checked out until 14:30. Break glass only if it can't wait.**
[Break-glass](./break-glass.md) reveals the secret past the lease, notifies the folder's owners
and queues a rotation, and it's recorded at the highest audit level.

Every check-out, check-in and expired lease is in the [audit trail](../admin-guide/audit.md).
