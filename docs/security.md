# Security

## Reporting a vulnerability

Please report security issues privately, through GitHub's private vulnerability reporting, on the
specific repository where you found the problem: open the repository's **Security** tab and choose
**Report a vulnerability**. Don't open a public issue for a suspected vulnerability.

You can expect an acknowledgement within a few business days. We'll work with you on a fix and
agree a disclosure timeline before anything is made public.

## Supported versions

Security fixes target the latest released minor version of each Sneakers-PAM repository. Once
v0.1.0 ships, this page will list the supported release line.

## How the project is built to limit blast radius

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
