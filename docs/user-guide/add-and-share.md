---
title: Add and share secrets
description: Create a secret, generate a password or key, edit and move it, and share a folder or a secret.
---

# ✍️ Add and share secrets

Anyone can keep secrets in their own personal folder. To add one to a shared folder you need the
**Manage** permission there, which a folder's owners have.

## ➕ Create a secret {#create}

1. Choose **New secret** (from a folder you can manage, or from your personal folder).
2. Pick its **type**. The type decides the fields and what Sneakers-PAM can do with it; see
   [Secret types](../admin-guide/secret-types/index.md) for the list.
3. Fill in the fields. For the types below, the editor can make the value for you:
   - **A password field:** generate one that meets the folder's password policy.
   - **An SSH key:** generate a key pair in the vault (Ed25519, RSA 4096, RSA 2048 or ECDSA
     P-256), or import one you have. The private key is stored and never shown in the editor again.
   - **A certificate:** upload a PKCS#12 / PFX, PEM, DER, PKCS#7 or JKS file; its details are
     read from the certificate.
4. Save. The first version of the secret is recorded.

:::note[Known limits in v0.1.0-rc.2]

A field its type marks required can still be saved empty — a Web Password with no URL, say, or a
Password with no username. Nothing stops the save yet, but a secret like that can show as
incomplete and some of its type's own features (the heartbeat, a URL launch) may not work until
the field's filled in. Fill in every field the editor marks, even where it doesn't yet insist.

:::

:::tip[Values that are already in a file]

To store a value that's already on disk, such as a key file, without pasting it, use
`sneakers-put`, which reads it from the file ([Agents and the MCP](./agents-and-the-mcp.md#sneakers-put)).

:::

## ✏️ Edit, move and retire {#edit}

- **Edit** changes fields; every save that changes something makes a new version, and the
  [history](./use-secrets.md#history) shows which fields changed.
- **Move** a secret to another folder you can manage. From your personal folder to a shared one
  is free. From a shared folder into a personal one needs a site admin: for anyone else it becomes
  a move request that a site admin decides.
- **Retire** takes a secret out of use without deleting it; it's hidden from lists unless you show
  retired secrets, and it can be restored.

## 🤝 Share a folder or a secret {#share}

Open a folder's or a secret's **Manage access** (the **Actions** menu on a secret) to choose who
can do what. Folder changes apply to everything in the folder and its subfolders once saved;
secret changes apply to that secret.

| Permission | What it lets someone do |
|---|---|
| Reveal | Read the secret's fields and reveal or copy its values |
| Manage | Add, edit, move and retire secrets, and change sharing |
| Approve | Decide other people's access requests and reveals for it |
| Informed | Get notifications about it, such as a move or a rotation |

- **Share with** a person, a group, or everyone who can sign in (only a site admin can change a rule
  for everyone).
- **Owners** of a folder have Reveal, Approve and Manage on everything in it.
- **Rules inherited** from a folder above are shown as inherited and locked here; change them on
  that folder.
- **Advanced (RACI grid)** shows the rules in order, each allowing or denying, the way a firewall
  reads them: the first rule that matches decides. A deny there wins over the simple view.
- **What would this user get?** The simulator shows what a person would be allowed, with your
  unsaved changes, before you save.

Site admins can see every shared folder but aren't approvers or managers by themselves; they get
those only through a rule, like anyone else ([Folders and permissions](../admin-guide/folders-and-permissions.md)).
