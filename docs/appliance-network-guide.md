# Changing the appliance's network

You can change the appliance's address, gateway, DNS and the rest after setup, on the `:8443`
**Network** page, over SSH, or on the console. A change can cut off the session that made it, so
you see what it will do before anything moves. Once you commit a change it's kept for good, with no
timed revert.

## Before you start

- You're an owner on the appliance. Staging and committing are for owners only.
- You can reach the appliance's console, such as the VM's console in your hypervisor. You need it
  if a change shuts you out, or to find an address that DHCP or SLAAC hands out.
- For a static address, you know the address with its prefix length, such as `192.0.2.10/24`, and
  the gateway if the network has one.

## On the Network page

1. Sign in at `https://<address>:8443/` and open **Network**.

2. Under **Settings**, make your changes.

   - **IPv4** is **DHCP**, **Static** or **Off**. **IPv6** is **SLAAC**, **DHCPv6**, **Static** or
     **Off**. At least one of them must stay on.
   - For **Static**, give the address with its prefix: `192.0.2.10/24` or `2001:db8::10/64`.
   - The gateway is optional. An IPv4 gateway must be inside the address's network. An IPv6 gateway
     can be inside it or a link-local address.
   - To go back to an automatic address, pick **DHCP** or **SLAAC**.

3. Select **Stage change**. Nothing on the box changes yet. The fields show the staged values, even
   after a reload, and a banner says **A network change is staged**. To add to it, edit the fields
   and stage again.

4. Read the banner. It says whether the page will drop, the address to reconnect to, and whether
   the box will make a new certificate or the allow-list will change.

5. Select **Commit** and confirm your sign-in when it asks. To drop the change instead, select
   **Discard**.

A staged change lives in the box's memory, so a restart of the box drops it.

### What Commit checks

If the change sets a static address with a gateway, Commit tests that gateway first. The box adds
the new address alongside the one in use, checks that the gateway answers from it, and removes it
again.

If the gateway doesn't answer, the commit is refused with `NET_GATEWAY` and a red alert on the
page. Nothing on the box has changed and the change stays staged, so you can fix it and commit
again. A commit is refused the same way if the live settings changed after you staged.

Automatic addresses (DHCP and SLAAC) and a static address with no gateway have nothing to test, and
neither does a part of the settings the change leaves alone. A gateway that was already down
doesn't hold up a DNS change.

### When the page drops

If the change moves the management address, the page stops answering when you commit. That's
expected, not an error.

- **A static address:** the page links the new address. Open it and sign in there.
- **DHCP or SLAAC:** the box gets its new address after the commit, so find it on the box's console.
- **A new certificate:** a new host name or address gives the box a new certificate, unless an owner
  assigned one, so your browser asks you to accept it again.

## Over SSH

`network set` stages, `network show` reviews, and `network commit` applies. Nothing changes until
the commit.

1. Stage the change:

   ```text
   network set ipv4=static ipv4-address=192.0.2.10/24 ipv4-gateway=192.0.2.1
   ```

   The address goes in `ipv4-address=`, and `ipv4=` takes only `dhcp`, `static` or `off`. An address
   in `ipv4=` is refused, with a hint that shows the right form. IPv6 works the same way, with
   `ipv6=`, `ipv6-address=` and `ipv6-gateway=`. A second `network set` adds to what's staged.

2. Review it:

   ```text
   network show
   ```

   It lists the current settings, what's staged and what the change would do.

3. Apply it:

   ```text
   network commit
   ```

   It says whether your session will drop and which address to reconnect to, tests a new gateway
   the same way the page does, then applies and saves the change. A dropped session is expected.

To drop a staged change without applying it:

```text
network discard
```

## On the console

Press **N** to open the network editor and make your changes. The editor shows the change and asks.
Press Enter to apply it and keep it, or **E** to go back with nothing applied.

## If the allow-list shuts you out

The allow-list decides which networks can reach SSH and `:8443`. A commit has no revert, so a wrong
list can lock you out. The page and `network commit` warn you when a change touches the list.

To get back in, go to the box's console:

1. Press **R** for **Recover access**.
2. Pick **Let this network reach the admin page again**.
3. Check that the admin page opens, then press **K** to keep the change. If you don't, the box puts
   the old list back by itself.

## On an older base

Stage and commit need the Base OS that came with them. On an older one, the Network page says it
can't change the network and points you to **Updates**. Update the Base OS first, or use the console
or SSH until you can.
