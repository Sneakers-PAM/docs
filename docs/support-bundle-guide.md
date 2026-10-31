# Getting a support bundle

A support bundle is one plain text file with what it takes to diagnose an appliance: its status, the
cluster, the logs, the mounts and the update records, followed by one timeline of every log in UTC.
The box makes it by running a fixed set of read-only commands.

## Before you start

- You're an admin on the appliance. Any admin can take a bundle.
- For the SSH commands, you have a login key from the **Access** page.

## Download it from the Logs page

1. Sign in at `https://<address>:8443/` and open **Logs**.
2. Open **Advanced: support bundle**.
3. Select **Download support bundle**. The box writes the file as you wait, which can take up to 10
   minutes. It's named `support-bundle-<host>-<UTC time>.txt`.

If the page says the Base OS can't make a bundle yet, update the Base OS on **Updates** and try
again.

## Get it over SSH

Sign in to the closed shell and run one of these:

```text
support-bundle
support-bundle full
support-bundle --no-color
```

- `support-bundle` prints the key sections, with about the last 50 lines of each log, for you to
  copy out of the terminal.
- `support-bundle full` prints every section, the same content as the file from the Logs page.
- On a terminal the headings, errors and warnings are in colour, and copying leaves the colour
  behind. `--no-color` turns it off.

To save the full bundle to a file from your own machine:

```sh
ssh admin@box1.example.org support-bundle full > support-bundle.txt
```

## What it leaves out

Secrets, tokens and keys are removed from every line before it's written, and a removed value reads
`[redacted]`. Secrets and environment variables show as names only. A line too long to check is left
out whole.

Read a bundle before you send it to anyone. It still holds host names, addresses and account names.

One bundle runs at a time, so a second is refused until the first ends, and each one is recorded in
the appliance's audit log.
