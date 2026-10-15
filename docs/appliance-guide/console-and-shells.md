---
title: Console and shells
description: The physical or serial console, SSH with box-issued keys, the closed shell, the root shell, and the MCP switch.
---

# 🖧 Console and shells

## 🖥️ The console {#console}

The box's console is whichever it has of the screen (VGA) and the serial line — both show the same
thing, and either can answer. It only ever shows information and a small menu; setup and everyday
admin work happen on `:8443`, never at the console. Outside first boot, it shows a status screen
(health, the base and product versions, the admin and SSH addresses, certificate and host-key
fingerprints) that refreshes every five seconds, plus **R** for **Recover access** — the way back
in with no admin able to sign in, from the console alone.

## 🔑 Getting an SSH key {#ssh-key}

There are no admin-supplied login keys and no SSH passwords: every key is issued by the box
itself.

1. Sign in to `:8443`, open **Access**, choose **Get an SSH key** (it asks for a fresh TOTP code).

   ![The Access page, where admins get SSH keys for the closed shell.](/img/guides/ssh-access-01-page.png)

2. Download the key in whichever form your client needs — OpenSSH, a PuTTY `.ppk`, or PEM — the
   box keeps none of them.
3. Log in with your own name and that key:

   ```bash
   ssh -i <key> -o CertificateFile=<key>-cert.pub <name>@192.0.2.10
   ```

4. The closed shell asks for a TOTP code next — there's no way to skip it, and no password login.

## 🐚 The closed shell {#closed-shell}

Every admin's login shell, `sneakers-shell`, offers only the appliance's own commands —
interactively (with `help`, line editing and tab completion) or one per SSH command line. A few of
the more useful ones:

| Command | What it does |
|---|---|
| `status` | The box's own status, the same facts the console's status screen shows |
| `admins list` | Every admin and how many login keys each has |
| `network show` / `network set` | Read or change network settings (owners only for `set`) |
| `disk cleanup` | Free disk space right now, the same cleanup that runs hourly |
| `<product> mcp [on\|off]` | Show or set the MCP switch |
| `<product> setup-token` | Read a one-time value the product exposes, such as Sneakers' setup token |
| `support-bundle` | Not available in this release yet — see [Troubleshooting](./troubleshooting.md) |

`help <command>` shows any command's purpose, flags and an example; `-o json` prints machine-
readable output. Only what your role may run is ever offered — an admin who isn't an owner doesn't
see the owner-only commands (`network set`, `network confirm`, `<product> reset`) in `help` or Tab
completion, though accessd checks the role again either way.

## 🔓 The root shell {#root-shell}

A root operator can open a one-off root shell for troubleshooting, through a two-step challenge:

1. From the closed shell, `shell` asks for a challenge (16 characters, good for 10 minutes by
   default).
2. On `:8443`, with a fresh step-up, type that challenge to get an 8-character code.

   ![The Root shell page, which explains the challenge and response for break-glass access.](/img/guides/root-shell-01-page.png)

3. Type the code back into the SSH session (not echoed). It's bound to that login and works once,
   and gives a one-minute ticket to actually start the shell. Three wrong codes close the
   challenge, and count toward your account's lockout the same as a wrong sign-in.

The root shell is busybox ash, and is fully audited. It ends at whichever comes first: the
policy's time limit, 10 minutes idle, your SSH client going away, or an owner ending it from the
Sessions page. With a product installed, `kubectl`, `helm` and `k0s` work against it with no
setup — busybox's limited tool set is covered in [Troubleshooting](./troubleshooting.md#busybox).

## 🤖 The MCP switch {#mcp}

`<product> mcp` (closed shell or console) and the MCP card on `:8443` are the same switch: turning
MCP on or off for agents. Switching it on reports how far the product has come up with it —
starting, ready, or failed — within about 90 seconds. See the [admin guide's MCP and agent
tokens](../admin-guide/mcp-and-agent-tokens.md) page for issuing tokens once it's on.
