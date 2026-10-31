# Updating the appliance

This guide covers the **Updates** page in the `:8443` appliance admin: what it shows, how to install
an update, and what the note means when a check skips a release.

## Before you start

- You can sign in to the appliance admin at `https://<address>:8443`.
- To install, apply or revert an update, you need the owner role. Other admins see the page, but
  not those actions.
- To apply or revert, you need your authenticator app. The box asks for a fresh code every time.

## What the page shows

The page has a card for each part of the appliance you can update:

| Card | What it updates | What happens when you apply it |
|---|---|---|
| Base OS | The appliance's operating system, in two slots | The box reboots |
| Base Web | The `:8443` pages | No reboot |
| Product | k0s and Sneakers-PAM | The product restarts |

Each card shows the running version, the previous version and what the update source offers. Below
them, the **Update mirror** card shows the source, its status and the last check, with **Check now**.
**Install an update** takes an uploaded file, and it's the only way to update an air-gapped box.

## When a check skips a release

The box takes the newest release on its channel that's finished and verifies. A release can be
listed before all its files are uploaded, so for a while the newest one may not be usable. The box
skips it with no error and offers the release below it instead.

When that happens, a note titled **A newer release isn't ready** appears above the cards, naming
what was skipped and why:

| The note says | What it means |
|---|---|
| `v0.1.0-rc.3 is being published; showing v0.1.0-rc.2` | Its files aren't all there yet |
| `v0.1.0-rc.3's index doesn't verify; showing v0.1.0-rc.2` | Its release index isn't signed by the box's release key |
| `v0.1.0-rc.3's SHA256SUMS doesn't verify; showing v0.1.0-rc.2` | Its checksum file isn't signed by the box's release key |
| `v0.1.0-rc.3's index can't be read; showing v0.1.0-rc.2` | The release is finished, but its index failed to download |

If the box skipped more than one release, the note lists each of them, separated by semicolons.

A release that's still being published needs no action from you. Once its files are signed and
uploaded, the next check picks it up, either on its own or when you select **Check now**. The note
then goes away. A release that doesn't verify is never used.

Skipping a release never steps the box down. Nothing at or below the version the box runs is
offered, even though the note still shows. If nothing on the channel is usable, the check fails
with an error naming the release it stopped at.

These notes come from releases on GitHub. A box using an internal mirror reads the mirror's index
as usual, and an air-gapped box is unchanged.

## Install an update

1. On the card for the part you're updating, pick an offer and select **Fetch**. On an air-gapped
   box, upload the file under **Install an update** instead.
2. Select **Verify and stage**. The box checks the file's signature, channel and checksum before it
   unpacks anything. A refused file shows the box's reason, and nothing is staged.
3. Select **Apply update** on the card. In the dialog, type the version and enter a fresh
   authenticator code.

A Base OS update then shows the restart page, which lists the update's steps. It keeps asking until
the box answers again, then takes you to sign in. The box can take more than 5 minutes to come back.

## Revert an update

Select the revert button on the card, such as **Revert to 0.0.9** on the Base OS card. In the
dialog, type the version and enter a fresh authenticator code. For a Base OS revert, the version to
type is the one that's running. It reboots into the previous release.

Staging a release replaces the one kept for a revert, so **Revert** isn't offered while a release is
staged.
