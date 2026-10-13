---
title: First setup
description: The console's setup code, the :8443 admin page, the first appliance admin, the recovery keys, and installing and setting up Sneakers-PAM itself.
---

# 🔧 First setup

First boot asks for nothing while DHCP gives the box an address. The console walks through the
same steps whether you watch it on a VMware console window or a serial line.

## 🌐 Network {#network}

As soon as the box has an address (DHCP or SLAAC on its first linked network card), this step is
done. If nothing comes within 30 seconds, the console shows the available network ports and lets
you type an address, prefix, gateway and DNS server by hand.

## 🔑 Protection {#protection}

Chosen automatically from the hardware (a TPM or vTPM, and whether Secure Boot is enforced) — see
[Protection levels](./protection.md) for what "full" and "reduced" mean and how to raise it later.

## 📺 Ready to set up {#ready}

Once the network and protection steps are done, the console shows:

- the `https://<address>:8443` address to open, on every management address;
- the certificate's SHA-256 fingerprint, grouped in fours so it can be read aloud and checked
  against what the browser shows on the first visit;
- a one-time setup code (16 Crockford base32 characters, `XXXX-XXXX-XXXX-XXXX`), good for 60
  minutes; a new one replaces it if it lapses.

```
   Open this address in your browser:
      https://192.0.2.10:8443

   Certificate fingerprint
      7C2E 91AB 4F06 D3E8 B15A 6C90 2E7F 0A4D
      E38B 5C21 9FD0 76A4 C1E9 0B3F 8D62 A7C5

   Setup code  7PQK-NMS9-XD2A-4KJW   expires in 59 min

   Protection  REDUCED  no TPM, no Secure Boot
```

Open the address, check the fingerprint matches, and type the setup code.

![The console shows the address to open and the one-time setup code.](/img/guides/first-boot-03-setup-code.png)

## 👤 Create the first appliance admin {#first-admin}

On `:8443`, typing the setup code starts setup:

1. **Admin.** Create the first appliance admin: a name, a password (12 characters or more, no
   composition rules, nothing on the breached-password list), and an authenticator app for TOTP —
   there's no skipping the second factor.

   ![Setup: create the first appliance admin.](/img/guides/setup-01-first-admin.png)

2. **Authenticator.** Scan the QR code (or type the key by hand) into your authenticator app and
   confirm with a 6-digit code — this step can't be skipped.

   ![Setup: add the authenticator app.](/img/guides/setup-02-authenticator.png)

3. **Recovery keys.** Add one to three SSH public keys as **recovery keys**: the way back in if no
   admin can sign in, and the only way to decrypt the **escrow bundle** if this box's TPM or key
   file is ever lost. Download the escrow file now; see [Backups and
   restore](./backups-and-restore.md) for what it contains and when to download it again.
4. **Network** (optional at this point): confirm or adjust the address, host name and DNS from
   here instead of the console, if you'd rather.

   ![The Network page with the address, gateway and DNS settings.](/img/guides/network-01-page.png)

Once the first admin exists, SSH (port 22) opens for admin logins. Once every step above is
acknowledged, the box moves from `firstboot` to normal operation.

## 📦 Install the product {#install-the-product}

With the appliance itself set up, install Sneakers-PAM:

1. On `:8443`, open **Updates**.
2. Find the **Product** card and choose **Apply** on the bundle you want (it's staged with the
   release you installed, or fetched from the update source first).

   ![Installing the verified product release.](/img/guides/updates-03-product-install.png)

3. The box stages the bundle, switches to it, starts k0s and brings the product up phase by phase
   (cluster, data, identity, services, front). The maintenance screen on the console, and the
   Updates page, both show which phase is running.

   ![The console's maintenance screen during a real production first install, phase by phase.](/img/guides/first-boot-05-installing-product.png)

4. Once the product reports healthy, port 443 opens with it, and the console's status screen
   shows the base and product both healthy.

   ![The console status screen on a real box once the product is running.](/img/guides/first-boot-06-status-real.png)

## 🚪 Set up Sneakers-PAM itself {#product-setup}

The product's own first-run setup is separate from the appliance's, and it needs a one-time setup
token read over SSH, not from `:8443`:

```text
ssh admin@box1.sneakers.example.org sneakers setup-token
```

This prints the token once (it's removed once the product's own setup consumes it) with the link
to use it:

```text
Sneakers setup token:

    stp_...

Use it at https://box1.sneakers.example.org/admin/setup
It works once; after that it's removed.
```

Open that link, create the first Sneakers-PAM admin, and you're done — hand people the [user
guide](../user-guide/index.md) and start building out [folders and
permissions](../admin-guide/folders-and-permissions.md).

:::info[Migrating from an earlier Sneakers install?]

Don't run the product's own setup at all. Open **Import** on `:8443` before anyone visits `/admin/setup`
— see the [migration guide](../migration-guide.md).

:::
