---
title: Email
description: The mail relay Sneakers-PAM sends password resets, one-time codes and notices through.
---

# 📧 Email

Sneakers-PAM sends mail — password resets, one-time codes and notices — through a relay you set
on the box, on `:8443`'s **Email** page, under the product's section. No bundle ships its own
relay: the box keeps the settings on its own encrypted state volume and hands them to the product.

:::warning

With TLS set to **None**, or with **Verify the certificate** off, mail and the relay password
go out unencrypted, or to a relay whose identity isn't checked. Anyone on the path between the
box and the relay can read them, or pose as the relay. Use STARTTLS or TLS with verification on
wherever the relay supports it — the Email page shows this same warning whenever either is off.

:::

## Before you start

Have ready whatever your relay provider gives you for a submission account:

- the relay's host name or address, and its port (587 for STARTTLS submission, 465 for implicit
  TLS, or 25 for plain relaying);
- a username and password, if the relay needs AUTH;
- the From address your relay account is allowed to send as;
- the relay's CA certificate (PEM), only if it's signed by a private CA your relay doesn't share
  with the public roots.

## 🔌 The relay settings {#settings}

| Setting | Default | What it does |
|---|---|---|
| Relay host | (none) | The relay's host name or address. Left empty, there's no relay and Sneakers-PAM sends no mail. |
| Port | 587 | The relay's port. |
| From address | (none) | The address mail is sent from. Required once a relay host is set. |
| TLS | STARTTLS | **None** (plain), **STARTTLS** (the connection is upgraded before anything else is sent; a relay that doesn't offer it is refused) or **TLS** (TLS from the first byte, the usual choice for port 465). |
| Verify the certificate | On | Checks the relay's certificate against the system roots and the relay CA below. |
| Relay CA | (none) | A PEM certificate for a relay signed by a private CA, trusted on top of the system roots. |
| Username, password | (none) | AUTH (PLAIN, or LOGIN if that's all the relay offers). The password field is write-only: you can only tell whether one is saved, and replace or clear it. |

Saving needs a step-up (your second factor again), and is audited with every setting but the
password itself — the audit entry only says whether the password was set, kept or cleared.
Saving applies the product again under the same maintenance gate as a product update: an open
elevated shell blocks it, and an owner can override that.

## ✉️ Sending a test email {#test}

**Send test email** sends a short message through the settings on the page — with the saved
password, unless you type a new one — the same way Sneakers-PAM's own mail goes out. It needs a
step-up, and it changes nothing: a failed test doesn't touch your saved settings.

1. On the Email page, fill in and save the relay settings above.
2. Choose **Send test email**.
3. Type the address to send the test to, and confirm.
4. Read the result: either the relay's own answer that it took the message, or one of the
   failures below.

## 🛠️ If the test fails {#troubleshooting}

Each row is one of the exact failures the test can return, what it means, and what to check.

| Message | What it means | What to check |
|---|---|---|
| no relay is set | The Relay host field is empty. | Fill in a relay host (and the rest of the settings) and save before testing. |
| the test address "…" isn't a plain email address | The address you typed for the test isn't one plain address. | Retype it as a single address, like `name@example.org`, with no display name. |
| the relay `host:port` can't be reached | The box couldn't open a TCP connection to the relay. | Check the host and port are right, and that the box can reach that address and port on the network. |
| TLS with the relay failed | The TLS handshake failed — this is the implicit-TLS path, so it only happens when TLS is set to **TLS**. | Confirm the relay actually speaks TLS on that port. If it's a private CA, add it as the Relay CA; otherwise, turning off Verify accepts the risk the warning above describes. |
| the relay didn't greet | The box connected, but didn't get a valid SMTP greeting back. | Confirm the port is actually the relay's SMTP port, and nothing else (a web proxy, say) is listening there. |
| the relay doesn't offer STARTTLS; nothing was sent | TLS is set to **STARTTLS**, but the relay doesn't advertise it. | Pick the TLS mode that matches this relay and port — a submission relay on 587 normally offers STARTTLS; one that doesn't may need **TLS** on 465 or **None** on 25 instead. |
| STARTTLS with the relay failed | The relay offered STARTTLS, but the upgrade itself failed. | Same as "TLS with the relay failed" above: check the certificate and the Relay CA, or Verify. |
| the relay offers no AUTH, and a username is set | A username is filled in, but the relay doesn't support authentication at all. | Clear the username and password if this relay needs none, or confirm you have the right relay and port for an authenticated account. |
| the relay refused the username and password | The relay didn't accept the AUTH attempt. | Re-check the username, and re-type and save the password — a relay never confirms which of the two was wrong. |
| the relay refused the from address | The relay doesn't allow mail from the From address on the page. | Set From to an address your relay account is actually allowed to send as. |
| the relay refused the test address | The relay rejected the address you typed the test to. | Try a different recipient, or check the relay's own rules on who it will relay to. |
| the relay refused the message | The relay refused the message itself (policy, size or content filtering), after accepting the sender and recipient. | Check the relay provider's own logs or rules for why it blocked the message. |
| the message didn't go out | The connection dropped while the message was being sent. | Check the network path between the box and the relay is stable, then try again. |
| the relay didn't take the message | The relay accepted the content but rejected it at the last step. | Check the relay provider's own delivery logs for the rejection reason. |

## 🧭 What the product reads {#product}

The settings reach Sneakers-PAM as box settings and box secrets the product's own `product.yaml`
declares, not as a bundled relay: the non-secret settings go into a ConfigMap, the password (and
anything built from it, such as the relay as one URI) into a Secret. Sneakers-PAM's identity
service uses them for its own mail; Kratos's courier never runs. An unset setting always has its
default, so nothing is ever left with a placeholder value.
