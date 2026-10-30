# Release notes

What each Sneakers-PAM release adds, for the people who run and use it. Every release is a
prerelease until v0.1.0. The full list of changes in each repository is on its GitHub Releases
page, such as the
[appliance releases](https://github.com/Sneakers-PAM/sneakers-appliance/releases).

## v0.1.0-rc.4

### New

- **Sign in from the command line.** `sneakers-put login` and `sneakers-run login` sign you in in
  your browser and keep your personal token on your machine, so you never copy a token by hand.
  The token goes into the macOS Keychain, a Linux desktop keyring (GNOME Keyring or KWallet), or,
  on a Linux box with no keyring, a file only you can read. A box with no browser can sign in
  through an SSH port forward. See [Signing in from the command line](./cli-sign-in-guide.md).
  ([sneakers-mcp#73](https://github.com/Sneakers-PAM/sneakers-mcp/pull/73),
  [#77](https://github.com/Sneakers-PAM/sneakers-mcp/pull/77))
- **A sign-in confirmation page.** After `login`, the browser ends on a Sneakers page that says which
  command is signed in and as whom, or why the sign-in failed and what to run next.
  ([sneakers-web#338](https://github.com/Sneakers-PAM/sneakers-web/pull/338),
  [sneakers-mcp#75](https://github.com/Sneakers-PAM/sneakers-mcp/pull/75))
- **A GitHub App editor.** A GitHub App is created and used fully in the staff app: a card for its
  ids, a private key dropped in as the `.pem` file GitHub downloads and checked before it's stored,
  a secret page with the ids at a glance, and **Replace private key** for when the key is rotated.
  See [Storing a GitHub App](./github-app-guide.md).
  ([sneakers-web#339](https://github.com/Sneakers-PAM/sneakers-web/pull/339),
  [sneakers-vault#179](https://github.com/Sneakers-PAM/sneakers-vault/pull/179))
- **A Proxmox VE image.** The appliance now also ships as a `qcow2` disk image for Proxmox VE, with
  a QEMU guest agent that answers Proxmox's shutdown, reboot and status requests and refuses
  anything that would reach inside the appliance. It hasn't been tried on a real Proxmox VE host
  yet. See [Install on Proxmox VE](./install-proxmox.md).
  ([sneakers-appliance#476](https://github.com/Sneakers-PAM/sneakers-appliance/pull/476))

### Fixed

- **Authenticator apps work on a plain chart install.** The identity chart now generates its TOTP
  encryption key by default, so enrolling an authenticator app no longer fails with "We couldn't
  start the setup". Naming your own Secret still wins.
  ([sneakers-release#148](https://github.com/Sneakers-PAM/sneakers-release/pull/148))
- **A clear message when authenticator apps aren't set up.** The enrol page now says so in a plain
  sentence and points to a passkey, instead of asking you to refresh.
  ([sneakers-web#335](https://github.com/Sneakers-PAM/sneakers-web/pull/335))
- **The MFA window shows its value.** The admin Settings page shows the real MFA window, such as
  "30 minutes", instead of the name of the setting behind it.
  ([sneakers-gateway#142](https://github.com/Sneakers-PAM/sneakers-gateway/pull/142),
  [sneakers-web#333](https://github.com/Sneakers-PAM/sneakers-web/pull/333))
