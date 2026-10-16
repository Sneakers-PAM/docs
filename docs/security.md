# Security

## 🚨 Reporting a vulnerability

Please report security issues privately, through GitHub's private vulnerability reporting, on the
specific repository where you found the problem: open the repository's **Security** tab and choose
**Report a vulnerability**. Don't open a public issue for a suspected vulnerability.

You can expect an acknowledgement within a few business days. We'll work with you on a fix and
agree a disclosure timeline before anything is made public.

## 📅 Supported versions

Security fixes target the latest release of each Sneakers-PAM repository. Until v0.1.0 final, that's
the newest release candidate: v0.1.0-rc.2 at the time of writing. Once v0.1.0 ships, this page lists
the supported release line.

## 🧱 How the project is built to limit blast radius

A few design choices exist specifically to keep a problem contained if one occurs:

- **The appliance only trusts the Sneakers-PAM org's release key.** An upgrade that isn't signed by
  that key, or an image that's been modified, is refused outright.
- **Backups are encrypted to a separate key from the one you log in with**, so a compromised login
  credential alone can't be used to read a backup.
- **Every reveal, check-out and break-glass action is logged** in a hash-chained [audit
  trail](./admin-guide/audit.md) (see [Break-glass](./admin-guide/break-glass.md)) that
  detects a changed, deleted or reordered record.
- **Lab and production never mix.** A key, image or artifact marked as lab, test or ephemeral is
  refused for production use.

## 🍴 Forks and your own builds

Sneakers-PAM is Apache-2.0, so you're free to fork it and build your own appliance. If you do:

- **Make your own signing keys.** That means the release key, the update key and the Secure Boot
  keys (PK, KEK and db). Keep their private halves in your own custody, for example a hardware
  token or an environment-protected secret. The project's private keys live only in the project's
  release environment, and a fork never has them.
- **You own their life cycle.** Creating, storing, rotating, revoking and recovering those keys is
  yours. A box trusts only the keys built into its image, so a box built from your fork takes only
  your releases, and a box built from the project's releases takes only the project's.
- **Run your own mirror.** Point boxes built from a fork at a mirror you run, not at the project's
  mirrors, and don't re-host the project's signed files next to yours. A box would refuse the
  other side's files anyway, and mixing them makes it unclear which release a box is running.
- **Follow the advisories yourself.** The project's security advisories cover the project's signed
  releases. For a fork, watch them and rebuild with your own keys when a fix lands.
