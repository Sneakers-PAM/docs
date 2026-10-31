# Release notes

What each Sneakers-PAM release adds, for the people who run and use it. Every release is a
prerelease until v0.1.0. The full list of changes in each repository is on its GitHub Releases
page, such as the
[appliance releases](https://github.com/Sneakers-PAM/sneakers-appliance/releases).

## v0.1.0-rc.5

### New

- **Change a secret's type in the staff app.** Change one secret from its edit page, or several
  from the browse page, with a preview of what happens to each field before you confirm. See
  [Changing a secret's type](./change-type-guide.md).
  ([sneakers-web#353](https://github.com/Sneakers-PAM/sneakers-web/pull/353),
  [sneakers-gateway#156](https://github.com/Sneakers-PAM/sneakers-gateway/pull/156),
  [sneakers-vault#187](https://github.com/Sneakers-PAM/sneakers-vault/pull/187))
- **Stage and commit network changes.** The `:8443` **Network** page and SSH now stage a change,
  show what it will do and test a new gateway before anything moves. A committed change is kept for
  good, with no timed revert. The console confirms a change the same way, and the page can now set
  a static address. See [Changing the appliance's network](./appliance-network-guide.md).
  ([sneakers-appliance#511](https://github.com/Sneakers-PAM/sneakers-appliance/pull/511),
  [sneakers-web#357](https://github.com/Sneakers-PAM/sneakers-web/pull/357))
- **Top-level folders for everyone.** Anyone signed in, and any personal token, can create a
  top-level folder and owns it, and **Restrict top-level folders to admins** limits that. Agents
  can do it with `sneakers_create_folder` and no parent. See
  [Top-level folders](./concepts/secrets-and-folders.md#top-level-folders).
  ([sneakers-vault#186](https://github.com/Sneakers-PAM/sneakers-vault/pull/186),
  [#189](https://github.com/Sneakers-PAM/sneakers-vault/pull/189),
  [sneakers-gateway#153](https://github.com/Sneakers-PAM/sneakers-gateway/pull/153),
  [sneakers-web#352](https://github.com/Sneakers-PAM/sneakers-web/pull/352),
  [sneakers-mcp#85](https://github.com/Sneakers-PAM/sneakers-mcp/pull/85))
- **A support bundle.** `support-bundle` over SSH and **Download support bundle** on the `:8443`
  **Logs** page give you one redacted text file for diagnosing a box. See
  [Getting a support bundle](./support-bundle-guide.md).
  ([sneakers-appliance#504](https://github.com/Sneakers-PAM/sneakers-appliance/pull/504),
  [sneakers-web#356](https://github.com/Sneakers-PAM/sneakers-web/pull/356))
- **Generate an SSH key through the MCP.** `sneakers_generate_ssh_key` makes the pair on the
  Sneakers side and stores it, so the private key never reaches the agent.
  ([sneakers-mcp#80](https://github.com/Sneakers-PAM/sneakers-mcp/pull/80))
- **Trust a new appliance's own certificate.** `SNEAKERS_CA_FILE` or `-ca-file` points
  `sneakers-put` and `sneakers-run` at the box's certificate, with checking left on. See
  [Sign in to a new appliance](./cli-sign-in-guide.md#sign-in-to-a-new-appliance).
  ([sneakers-mcp#79](https://github.com/Sneakers-PAM/sneakers-mcp/pull/79))
- **Delete a revoked token.** A revoked personal token now has **Delete** on **My tokens**.
  ([sneakers-web#351](https://github.com/Sneakers-PAM/sneakers-web/pull/351),
  [sneakers-gateway#155](https://github.com/Sneakers-PAM/sneakers-gateway/pull/155),
  [sneakers-identity#75](https://github.com/Sneakers-PAM/sneakers-identity/pull/75))
- **Appliance admin link for root.** Root gets **Appliance admin** in the admin console's account
  menu.
  ([sneakers-web#346](https://github.com/Sneakers-PAM/sneakers-web/pull/346))

### Changed

- **The audit trail stays on the old appliance.** `sneakers-migrate` bundles move to format 2.0: the
  export leaves the trail behind, and the import adds one "imported from" record, named with
  `--source-name`. A bundle in format 1.x is refused, so export it again. See
  [Moving between appliances](./getting-started.md#moving-between-appliances).
  ([sneakers-release#158](https://github.com/Sneakers-PAM/sneakers-release/pull/158),
  [sneakers-appliance#507](https://github.com/Sneakers-PAM/sneakers-appliance/pull/507),
  [sneakers-web#356](https://github.com/Sneakers-PAM/sneakers-web/pull/356))
- **Console codes drop more look-alikes.** Codes use 28 characters and no longer use `Q`, `G`, `0`
  or `1`, and at Proxmox's usual 800x600 the console picks a larger font. A code already out when a
  box updates still works, except a root-shell challenge, which you ask for again.
  ([sneakers-appliance#496](https://github.com/Sneakers-PAM/sneakers-appliance/pull/496))
- **Upgrades add new built-ins.** Each start of a set-up vault adds the built-in types, extension
  packs, connections and password policies it's missing, and leaves everything else alone.
  ([sneakers-vault#181](https://github.com/Sneakers-PAM/sneakers-vault/pull/181))

### Fixed

- **`login` works with the MCP off.** `sneakers-put login` and `sneakers-run login` now sign in as
  the Sneakers CLI, and their tokens are no longer tied to the MCP switch.
  ([sneakers-gateway#150](https://github.com/Sneakers-PAM/sneakers-gateway/pull/150),
  [sneakers-mcp#81](https://github.com/Sneakers-PAM/sneakers-mcp/pull/81),
  [sneakers-appliance#506](https://github.com/Sneakers-PAM/sneakers-appliance/pull/506))
- **Network changes no longer hang.** A deadlock that could stop netd during an address change is
  gone, and the console's network editor no longer freezes when netd is slow.
  ([sneakers-appliance#495](https://github.com/Sneakers-PAM/sneakers-appliance/pull/495),
  [#494](https://github.com/Sneakers-PAM/sneakers-appliance/pull/494))
- **A clear hint for `network set`.** An address in `ipv4=` or `ipv6=` is refused with a hint that
  points to `ipv4-address=` or `ipv6-address=`.
  ([sneakers-appliance#493](https://github.com/Sneakers-PAM/sneakers-appliance/pull/493))
- **The Updates page skips a release still being published.** The box takes the newest finished
  release and a note says what it skipped and why.
  ([sneakers-appliance#508](https://github.com/Sneakers-PAM/sneakers-appliance/pull/508),
  [sneakers-web#356](https://github.com/Sneakers-PAM/sneakers-web/pull/356))
- **Recovery keys say what they are.** Setup says a recovery key isn't a login key and points to
  the **Access** page, and the download is named `sneakers-recovery-key-<UTC time>`.
  ([sneakers-web#349](https://github.com/Sneakers-PAM/sneakers-web/pull/349),
  [sneakers-appliance#497](https://github.com/Sneakers-PAM/sneakers-appliance/pull/497))
- **Restart time is stated.** The `:8443` **Power** page, the restart page, `reboot` and `poweroff`
  say the box can take more than 5 minutes to come back.
  ([sneakers-web#350](https://github.com/Sneakers-PAM/sneakers-web/pull/350),
  [sneakers-appliance#499](https://github.com/Sneakers-PAM/sneakers-appliance/pull/499))
- **An untrusted LDAPS certificate is named.** The heartbeat detail says why the certificate failed,
  though the result still reads as unreachable. The connector can also check TLS pins, which nothing
  sets yet.
  ([sneakers-connector#82](https://github.com/Sneakers-PAM/sneakers-connector/pull/82),
  [#83](https://github.com/Sneakers-PAM/sneakers-connector/pull/83))
- **Open terminal stays visible.** When a secret can't connect yet, **Open terminal** shows disabled
  with its reason, instead of disappearing.
  ([sneakers-web#344](https://github.com/Sneakers-PAM/sneakers-web/pull/344))
- **No autofill on `:8443` fields.** Browsers and password managers no longer fill your sign-in into
  the email settings and the other admin fields.
  ([sneakers-web#345](https://github.com/Sneakers-PAM/sneakers-web/pull/345))
- **The personal folder's top isn't offered for a secret.** The pickers leave it out, because it
  can't hold one.
  ([sneakers-web#355](https://github.com/Sneakers-PAM/sneakers-web/pull/355))
- **The box's own pages show the full mark.** The appliance's fallback pages show the whole
  Sneakers mark instead of a one-colour outline.
  ([sneakers-appliance#505](https://github.com/Sneakers-PAM/sneakers-appliance/pull/505))

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

## v0.1.0-rc.3

### New

- **Service images for arm64.** Every service image now publishes for both `linux/amd64` and
  `linux/arm64`, and the charts take one image tag and CPU architecture for every workload.
  ([sneakers-appliance#470](https://github.com/Sneakers-PAM/sneakers-appliance/pull/470),
  [sneakers-release#137](https://github.com/Sneakers-PAM/sneakers-release/pull/137))
- **The console's network editor is always there.** The console offers **N** whenever the network
  service is installed, not only when the box has no address, and `network set` takes
  `ipv4-address=`, `ipv4-gateway=` and their IPv6 equivalents.
  ([sneakers-appliance#461](https://github.com/Sneakers-PAM/sneakers-appliance/pull/461))
- **Help for a failed test email.** The docs now cover troubleshooting a test email that fails.
  ([sneakers-appliance#441](https://github.com/Sneakers-PAM/sneakers-appliance/pull/441))

### Fixed

- **The update check skips an unfinished release.** A release still being published, or one whose
  index doesn't verify, is skipped for the next one down.
  ([sneakers-appliance#461](https://github.com/Sneakers-PAM/sneakers-appliance/pull/461))
- **The box's fallback pages show the mark.** The Sneakers mark is built into the fallback page and
  the box-state overlay.
  ([sneakers-appliance#461](https://github.com/Sneakers-PAM/sneakers-appliance/pull/461))
- **The disk guard reads one-time steps correctly.** A one-time step is no longer forecast as a
  steady rate of growth.
  ([sneakers-appliance#440](https://github.com/Sneakers-PAM/sneakers-appliance/pull/440))
- **Long failure details wrap.** A failure detail that runs long and unbroken now wraps on the
  box-state pages.
  ([sneakers-appliance#436](https://github.com/Sneakers-PAM/sneakers-appliance/pull/436))
- **Imports into newer vaults.** `sneakers-migrate` imports into a vault at migrations 4 to 6, and
  the mapping check refuses a type change that's missing a required field.
  ([sneakers-release#142](https://github.com/Sneakers-PAM/sneakers-release/pull/142),
  [#131](https://github.com/Sneakers-PAM/sneakers-release/pull/131))
- **Go 1.26.10.** The builds moved to Go 1.26.10 for GO-2026-6809.
  ([sneakers-appliance#471](https://github.com/Sneakers-PAM/sneakers-appliance/pull/471),
  [sneakers-release#139](https://github.com/Sneakers-PAM/sneakers-release/pull/139))

## v0.1.0-rc.2

### Fixed

- **Large imports finish or say why they didn't.** The import's step Jobs are sized for the data, a
  failed step ends with a reason, and a 727k-record import is part of the release gate. The import
  page says why a step failed and can be closed while one runs.
  ([sneakers-appliance#421](https://github.com/Sneakers-PAM/sneakers-appliance/pull/421),
  [sneakers-web#312](https://github.com/Sneakers-PAM/sneakers-web/pull/312))
- **Audit chain checks stay in constant memory.** The chain is verified as it's read.
  ([sneakers-audit#59](https://github.com/Sneakers-PAM/sneakers-audit/pull/59))
- **The terminal connects from the page's own origin.** The terminal opens on the page's origin and
  says why it can't connect, and the SSH broker accepts that origin and refuses an unpinned target
  up front.
  ([sneakers-web#309](https://github.com/Sneakers-PAM/sneakers-web/pull/309),
  [sneakers-sshbroker#71](https://github.com/Sneakers-PAM/sneakers-sshbroker/pull/71))
- **An SSH key's public key stays in its box.** The key now wraps inside its box on the page.
  ([sneakers-web#315](https://github.com/Sneakers-PAM/sneakers-web/pull/315))
- **Sealing a release with a patch.** Sealing now looks for the kit in the release folder.
  ([sneakers-appliance#429](https://github.com/Sneakers-PAM/sneakers-appliance/pull/429))

## v0.1.0-rc.1

The first release candidate, so everything in it was new. These are the main parts; each repository's
GitHub Releases page has the full list.

### New

- **The appliance.** An OVA for VMware with a first-boot wizard, an information-only console, a
  closed SSH shell and one-time elevation to a root shell.
  ([sneakers-appliance#53](https://github.com/Sneakers-PAM/sneakers-appliance/pull/53),
  [#124](https://github.com/Sneakers-PAM/sneakers-appliance/pull/124),
  [#136](https://github.com/Sneakers-PAM/sneakers-appliance/pull/136),
  [#78](https://github.com/Sneakers-PAM/sneakers-appliance/pull/78),
  [#82](https://github.com/Sneakers-PAM/sneakers-appliance/pull/82))
- **The `:8443` appliance admin.** Setup, sign-in, access, certificates, the Status page with its
  Disk card, and a factory reset by quorum.
  ([sneakers-appliance#73](https://github.com/Sneakers-PAM/sneakers-appliance/pull/73),
  [#74](https://github.com/Sneakers-PAM/sneakers-appliance/pull/74),
  [#281](https://github.com/Sneakers-PAM/sneakers-appliance/pull/281),
  [sneakers-web#204](https://github.com/Sneakers-PAM/sneakers-web/pull/204),
  [#205](https://github.com/Sneakers-PAM/sneakers-web/pull/205),
  [#277](https://github.com/Sneakers-PAM/sneakers-web/pull/277))
- **Signed updates.** Base OS, Base Web and Product update on their own from GitHub Releases or an
  internal mirror, each phase of the product is gated on Ready, and a product can be reinstalled or
  removed.
  ([sneakers-appliance#245](https://github.com/Sneakers-PAM/sneakers-appliance/pull/245),
  [#282](https://github.com/Sneakers-PAM/sneakers-appliance/pull/282),
  [#206](https://github.com/Sneakers-PAM/sneakers-appliance/pull/206),
  [#346](https://github.com/Sneakers-PAM/sneakers-appliance/pull/346),
  [#378](https://github.com/Sneakers-PAM/sneakers-appliance/pull/378),
  [#373](https://github.com/Sneakers-PAM/sneakers-appliance/pull/373))
- **The staff and admin apps.** Browsing, secret detail, requests and checkouts for staff; users,
  groups, types, targets, shared folders, service accounts and the audit trail for admins.
  ([sneakers-web#86](https://github.com/Sneakers-PAM/sneakers-web/pull/86),
  [#72](https://github.com/Sneakers-PAM/sneakers-web/pull/72),
  [#75](https://github.com/Sneakers-PAM/sneakers-web/pull/75),
  [#84](https://github.com/Sneakers-PAM/sneakers-web/pull/84),
  [#85](https://github.com/Sneakers-PAM/sneakers-web/pull/85),
  [#87](https://github.com/Sneakers-PAM/sneakers-web/pull/87),
  [#94](https://github.com/Sneakers-PAM/sneakers-web/pull/94))
- **Approvals.** Approval levels with no self-approval, an approver queue, one step-up window, and
  one approval page for everything an agent run asks for.
  ([sneakers-vault#127](https://github.com/Sneakers-PAM/sneakers-vault/pull/127),
  [sneakers-gateway#101](https://github.com/Sneakers-PAM/sneakers-gateway/pull/101),
  [sneakers-web#123](https://github.com/Sneakers-PAM/sneakers-web/pull/123),
  [#116](https://github.com/Sneakers-PAM/sneakers-web/pull/116),
  [sneakers-mcp#42](https://github.com/Sneakers-PAM/sneakers-mcp/pull/42),
  [#46](https://github.com/Sneakers-PAM/sneakers-mcp/pull/46))
- **Recovery and emergency access.** A site admin can browse all secrets in break-the-glass mode,
  and a recovery role can read version history and restore a version.
  ([sneakers-vault#130](https://github.com/Sneakers-PAM/sneakers-vault/pull/130),
  [#92](https://github.com/Sneakers-PAM/sneakers-vault/pull/92),
  [sneakers-gateway#110](https://github.com/Sneakers-PAM/sneakers-gateway/pull/110),
  [sneakers-web#150](https://github.com/Sneakers-PAM/sneakers-web/pull/150))
- **Read-only maintenance mode.** Writes are refused, and heartbeats and rotations pause.
  ([sneakers-vault#125](https://github.com/Sneakers-PAM/sneakers-vault/pull/125),
  [sneakers-gateway#92](https://github.com/Sneakers-PAM/sneakers-gateway/pull/92))
- **Moving onto the appliance.** `sneakers-migrate` exports, imports and verifies, and the `:8443`
  **Import** page runs the import.
  ([sneakers-release#35](https://github.com/Sneakers-PAM/sneakers-release/pull/35),
  [#86](https://github.com/Sneakers-PAM/sneakers-release/pull/86),
  [sneakers-appliance#260](https://github.com/Sneakers-PAM/sneakers-appliance/pull/260),
  [sneakers-web#254](https://github.com/Sneakers-PAM/sneakers-web/pull/254))
- **Helm charts.** The services and web apps as charts, with small-box and large-box sizing
  examples.
  ([sneakers-release#10](https://github.com/Sneakers-PAM/sneakers-release/pull/10),
  [#36](https://github.com/Sneakers-PAM/sneakers-release/pull/36),
  [#45](https://github.com/Sneakers-PAM/sneakers-release/pull/45))
- **Services check each other.** Every service call carries a workload identity.
  ([sneakers-vault#78](https://github.com/Sneakers-PAM/sneakers-vault/pull/78),
  [sneakers-gateway#57](https://github.com/Sneakers-PAM/sneakers-gateway/pull/57),
  [sneakers-identity#33](https://github.com/Sneakers-PAM/sneakers-identity/pull/33),
  [sneakers-audit#24](https://github.com/Sneakers-PAM/sneakers-audit/pull/24),
  [sneakers-notify#30](https://github.com/Sneakers-PAM/sneakers-notify/pull/30),
  [sneakers-connector#37](https://github.com/Sneakers-PAM/sneakers-connector/pull/37))
