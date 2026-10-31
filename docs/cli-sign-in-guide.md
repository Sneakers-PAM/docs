# Signing in from the command line

`sneakers-put` stores a secret from a file on your machine, and `sneakers-run` runs a command with
a secret it never shows you. Both act as you, with your personal token. `login` gets that token by
signing you in in your browser, the same way an MCP client signs in, and keeps it on your machine.
You never see or copy the token.

## Before you start

- You can sign in to the Sneakers-PAM staff app, with your second factor.
- You know your Sneakers-PAM address, such as `https://sneakers.example.org`. It must be `https://`.
- You have Go installed, to install the commands:

  ```sh
  go install github.com/Sneakers-PAM/sneakers-mcp/cmd/sneakers-put@v0.1.0-rc.5
  go install github.com/Sneakers-PAM/sneakers-mcp/cmd/sneakers-run@v0.1.0-rc.5
  ```

To sign in to a new appliance, you also need `openssl` on your machine and a sign-in to the box's
`:8443` admin page.

`login` signs in as the Sneakers CLI, not as an MCP client, so it works whether MCP is on or off on
your appliance. That takes the commands and the appliance from v0.1.0-rc.5 or later.

## Sign in

1. Tell the commands where your Sneakers-PAM is:

   ```sh
   export SNEAKERS_URL=https://sneakers.example.org
   ```

2. Start the sign-in:

   ```sh
   sneakers-put login
   ```

   Your browser opens the Sneakers-PAM sign-in page. `sneakers-run login` does exactly the same.

3. Sign in with your second factor, then approve the consent, which names `sneakers-put on` and
   your machine's name.

4. The browser ends on a Sneakers-PAM page that says the command is signed in and as whom. You can
   close the tab. If the sign-in failed, the page says why and what to run next.

5. Back in the terminal, `login` says it's signed in and where it put the token.

From then on, both commands find the token for the address in `SNEAKERS_URL` by themselves. The
token also shows under **My tokens** in the staff app.

## Sign in to a new appliance

A new appliance serves Sneakers-PAM with its own self-signed certificate until an owner uploads one
on the `:8443` **Certificates** page. No system trusts that certificate, so `login` fails with a
certificate error. Give the commands that one certificate. Certificate checking stays on: the host
name must still match, and a box that presents any other certificate is refused.

1. Fetch the certificate the box serves:

   ```sh
   mkdir -p ~/.config/sneakers
   openssl s_client -connect sneakers.example.org:443 -servername sneakers.example.org </dev/null 2>/dev/null \
     | openssl x509 -outform PEM > ~/.config/sneakers/box.pem
   ```

2. Print its fingerprint:

   ```sh
   openssl x509 -in ~/.config/sneakers/box.pem -noout -fingerprint -sha256
   ```

3. On the `:8443` **Certificates** page, compare it with the fingerprint shown for **Product (443)**.
   They must match exactly. If they don't, something else answered instead of your box, so don't
   use the file.

4. Point the commands at the file and sign in:

   ```sh
   export SNEAKERS_URL=https://sneakers.example.org
   export SNEAKERS_CA_FILE=~/.config/sneakers/box.pem
   sneakers-put login
   ```

`-ca-file <pem>` does the same for one run, and wins over `SNEAKERS_CA_FILE`. A file that can't be
read, holds no certificate or also holds a private key is refused before any request. Once the box
has a certificate your system already trusts, unset `SNEAKERS_CA_FILE`. If the box's own certificate
is renewed, fetch and check it again.

## Where the token is kept

| Your machine | Where the token goes |
|---|---|
| macOS | The login Keychain, as a password item named `Sneakers-PAM`, with your Sneakers-PAM host as the account. |
| Linux with a desktop keyring | The keyring your desktop runs (GNOME Keyring or KWallet), under the same names. |
| Linux with no keyring | A file only you can read: `~/.config/sneakers/token-<host>`, in a folder only you can open. |

- A token file that anyone else can read is refused until you `chmod 600` it or sign in again,
  the same way ssh treats a private key.
- If a keyring starts running later, the token from the file is still found, and the next `login`
  moves it into the keyring and removes the file.
- On Windows and other systems, `login` refuses for now. Set `SNEAKERS_TOKEN` to a personal token
  instead. The Windows version comes out right before v0.1.0.
- `SNEAKERS_TOKEN`, when it's set, is always used instead of the stored token.

## Sign in on a box with no browser

A server or build box with no browser can still sign in. The browser runs on your laptop, and an
SSH port forward carries the end of the sign-in back to the box.

1. On the box, start the sign-in without opening a browser:

   ```sh
   export SNEAKERS_URL=https://sneakers.example.org
   sneakers-put login -no-open
   ```

   It prints the sign-in link and an `ssh -L` command with the port it's waiting on, such as:

   ```text
   To finish from a browser on another machine, run this there first, then open the link:

     ssh -L 41023:127.0.0.1:41023 <this machine>
   ```

2. On your laptop, in a second terminal, run that command with the box's address in place of
   `<this machine>`, and leave it open:

   ```sh
   ssh -N -L 41023:127.0.0.1:41023 admin@build-01.example.org
   ```

3. Open the link in your laptop's browser, sign in and approve the consent. The browser ends on the
   Sneakers-PAM page that says the command is signed in.

4. On the box, `login` says it's signed in and where it put the token. Close the `ssh` from step 2.

The port changes on every sign-in, so use the one this run printed. The link works for about ten
minutes.

## Sign out

```sh
sneakers-put logout
```

It removes the token from this machine and says where it was. To end the token on the server too,
revoke it under **My tokens** in the staff app. A revoked token stays on that list until you select
**Delete** on its row and confirm. The audit trail keeps the record. Only a revoked token has
**Delete**.

## What to do next

Store a value from a file without it passing through your shell history or an assistant's chat,
for example a GitHub App's private key (see [Storing a GitHub App](./github-app-guide.md)):

```sh
sneakers-put -id <secret id> -field privateKey=@./app.pem
```

`sneakers-put -h` and `sneakers-run -h` print every option.
