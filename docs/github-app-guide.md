# Storing a GitHub App

This guide shows how to keep a GitHub App's credentials in Sneakers-PAM: its private key, its ids
and its secrets, in one secret of the **GitHub App** type. A release bot, a deploy bot or any
automation that signs in as an App can then get them from the vault instead of from a file on
someone's laptop.

## Before you start

- You can sign in to the Sneakers-PAM staff app and create secrets in the folder you want to use.
- You can open the App's settings on GitHub (the organization's Settings, Developer settings,
  GitHub Apps, then the App).
- You have the App's private key as the `.pem` file GitHub downloaded, or you can generate a new
  one. GitHub shows a key only once, when it's generated.

## Where each detail comes from

| Field | Where to find it on GitHub | Required |
|---|---|---|
| App ID | The App's settings page, under About. Digits only. | Yes |
| Client ID | The same page, under About. | No |
| Installation ID | The number at the end of the installation's settings address. Digits only. | No |
| Owner Org | The organization or account the App belongs to. | Yes |
| Private Key (PEM) | The `.pem` file from Private keys, Generate a private key. | Yes |
| Client Secret | Client secrets, Generate a new client secret. | No |
| Webhook Secret | The secret you set under Webhook. | No |

## Store the App

1. In the staff app, open the folder and choose **New secret**.
2. Give the secret a name, such as `Release bot`, and pick **GitHub App** as its type.
3. Fill in the **GitHub App** card: App ID, Client ID, Installation ID and Owner Org. An id that
   isn't all digits is flagged as soon as you type it.
4. In the **Credentials** card, drop the App's `.pem` file on the private key box, or click the box
   to choose it. The box turns green and says what it found, for example "RSA 2048-bit private
   key", with the file name. The key itself is never shown on screen.
5. If you only have the key as text, choose **Paste the key instead** and paste the whole key,
   the `BEGIN` and `END` lines included.
6. Add the Client Secret and Webhook Secret if the App uses them.
7. Choose **Create secret**. Anything still missing is listed at the top of the form, and each
   field says what it needs.

### Keys it refuses

The key is checked before it's stored, so a wrong file is caught in the editor, not when the bot
first tries to sign in. It must be an unencrypted RSA private key, which is what GitHub hands out.
The editor says which of these it got instead:

- an SSH key, such as `id_ed25519`;
- a certificate or a public key;
- an encrypted key;
- a private key that isn't RSA;
- a file that's damaged or cut off.

## Use the stored App

The secret's page shows the App ID, Installation ID, Owner Org and Client ID at a glance, each with
a copy button. The private key, Client Secret and Webhook Secret stay masked: revealing one is the
normal recorded reveal, the same as for any other secret (see
[Approvals and requests](./concepts/approvals.md)).

An agent connected through the [MCP](./mcp-guide.md) reads the same secret the same way, under its
own access rules.

## Replace the private key

When you rotate the App's key on GitHub:

1. On GitHub, generate a new private key for the App. Keep the old one for now.
2. On the secret's page, choose **Replace private key…** in the GitHub App card or the **Actions**
   menu. It needs manage access to the secret: its owners and authors.
3. Drop or choose the new `.pem` file. **Replace key** turns on once the key checks out.
4. Choose **Replace key**. Only the private key changes; the App's other fields stay as they were.
5. Once everything that uses the App has picked up the new key, delete the old key on GitHub.

The old key isn't lost: it stays in the secret's version history, like every past value (see
[Secrets and folders](./concepts/secrets-and-folders.md)).
