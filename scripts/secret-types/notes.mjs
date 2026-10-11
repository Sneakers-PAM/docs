// The prose for each built-in secret type: what it's for, and what its target
// and automation mean in practice. Everything else on a type's page (fields,
// what's secret, the heartbeat, rotation and check-out flags) comes from
// catalog.json. generate.mjs fails when a type in the catalogue has no entry
// here, or an entry names a type the catalogue doesn't have.
//
// `automation` adds to the flags; it never contradicts them. `targets` says
// what a target does for the type, or why it takes none.

export const TYPE_NOTES = {
  'type-password': {
    slug: 'password',
    emoji: '🔑',
    summary: 'A username and a password, for any account that doesn\'t need a more specific type.',
    use: [
      'Use it for an account Sneakers-PAM only stores: nothing checks it or changes it on a system.',
      'The password field can be generated from the folder\'s password policy when you create or edit the secret.',
    ],
    targets: 'A Password secret takes no target. To have Sneakers-PAM check and rotate an account, use the type made for that system, such as [Active Directory Account](./active-directory.md).',
  },
  'type-secure-note': {
    slug: 'secure-note',
    emoji: '📝',
    summary: 'A block of free text that is kept secret: setup steps, a list of answers, anything that isn\'t a credential with fields of its own.',
    use: ['The note is masked like a password and revealed, copied and audited the same way.'],
    targets: 'A Secure Note takes no target.',
  },
  'type-web-password': {
    slug: 'web-password',
    emoji: '🌐',
    summary: 'A sign-in for a website or web app: its URL, the username and the password.',
    use: ['The URL is stored as plain text, so people can find the right secret by the site it belongs to.'],
    targets: 'A Web Password takes no target: nothing signs in to the website for you.',
  },
  'type-ssh-key': {
    slug: 'ssh-key',
    emoji: '🗝️',
    summary: 'An SSH account that signs in with a key pair: the username, the key\'s format, the public key, the private key and its passphrase.',
    use: [
      'Generate the key pair in the vault (Ed25519, RSA 4096, RSA 2048 or ECDSA P-256), or import one you already have. The private key is stored and never shown in the editor again.',
      'With a target, a person can choose **Open terminal** on the secret\'s page and get an SSH session in the browser; the key is used for them and never shown.',
    ],
    automation: [
      'The heartbeat signs in to the target with the key (an SSH public-key handshake) and runs no command. It connects only to a host that presents one of the target\'s pinned SSH host keys.',
      'There is no SSH key rotation yet, so checking the secret in closes the lease without changing the key.',
    ],
    targets: 'A target with an SSH connection (port 22 by default) and its pinned host keys. Only a site admin pins or changes a target\'s host keys. The target serves both the heartbeat and brokered sessions.',
  },
  'type-api-token': {
    slug: 'api-token',
    emoji: '🎟️',
    summary: 'A token for an API: how it\'s sent (Bearer, OAuth or a custom header), the token itself and the API\'s URL.',
    use: [
      'The token is a fixed value: it can be revealed and copied, never generated or rotated.',
      'For an agent, prefer `sneakers-run`, which hands the token to one command without it passing through the agent\'s transcript.',
    ],
    targets: 'An API Token takes no target.',
  },
  'type-oauth': {
    slug: 'oauth',
    emoji: '🪪',
    summary: 'An OAuth 2.0 application: its client ID and client secret, its redirect URL, and the access and refresh tokens it has obtained.',
    use: ['The client secret and both tokens are fixed secret values: Sneakers-PAM stores them but never generates or refreshes them.'],
    targets: 'An OAuth Application takes no target.',
  },
  'type-recovery-codes': {
    slug: 'recovery-codes',
    emoji: '🛟',
    summary: 'The one-time recovery or backup codes a site gives you for when your authenticator is lost, with the site and account they belong to.',
    use: ['Keep the codes here rather than in a file or a printout, so every look at them is audited.'],
    targets: 'Recovery / Backup Codes take no target.',
  },
  'type-database-account': {
    slug: 'database-account',
    emoji: '🗄️',
    summary: 'A database login: the engine, the server, port and database, the username and the password.',
    use: [
      'The engine is PostgreSQL, MySQL / MariaDB, SQL Server, Oracle, MongoDB or Other.',
      'The secret\'s page shows ready-made connection examples for the engine, with a placeholder where the password goes, never the password itself.',
    ],
    automation: [
      'The type is marked for heartbeat and rotation, but the connector has no database adapter yet: a database target can\'t be checked or rotated today.',
    ],
    targets: 'A Database Account can carry a target, but no connector adapter acts on a database yet, so the target does nothing for it today.',
  },
  'type-unix-ssh': {
    slug: 'unix-ssh',
    emoji: '🐧',
    summary: 'A Unix or Linux account that signs in over SSH with a password: the host, the username and the password.',
    use: [
      'The password can be generated from the password policy, but Sneakers-PAM never checks it or changes it on the host.',
    ],
    targets: 'The type can carry a target with an SSH connection, but it has no heartbeat or rotation, and the web app\'s terminal opens SSH Key secrets only, so the target does nothing for it today.',
  },
  'type-windows-local': {
    slug: 'windows-local',
    emoji: '🖥️',
    summary: 'A local account on one Windows machine: the machine, the username and the password.',
    automation: [
      'The type is marked for heartbeat, rotation and check-out, but they need a WinRM or SAMR connection, and neither adapter is built yet: a heartbeat or rotation over them reports the target as unreachable.',
    ],
    targets: 'A target with a WinRM connection (port 5986 over TLS by default). The connection can be saved today; checking and rotating over it aren\'t built yet.',
  },
  'type-windows-domain': {
    slug: 'windows-domain',
    emoji: '🏢',
    summary: 'A Windows domain account in its simplest form: the domain, the username and the password.',
    use: ['For new Active Directory accounts, prefer [Active Directory Account](./active-directory.md), which also sets the NetBIOS name, the logon format and the UPN suffix.'],
    automation: [
      'The heartbeat binds to the directory as the account itself. Rotation is a self-service password change made with the current password, so the connector needs no admin rights on the directory.',
      'The domain\'s built-in Administrator (RID 500) is never rotated; its heartbeat still runs.',
    ],
    targets: 'A target with an LDAPS connection (LDAP over TLS, port 636), an LDAP connection, or a Kerberos connection (the password changes over kpasswd on port 464 of the same host). Active Directory only allows a password change over an encrypted connection, so use LDAPS or Kerberos to rotate.',
  },
  'type-active-directory': {
    slug: 'active-directory',
    emoji: '🗂️',
    summary: 'An Active Directory account: the domain, its NetBIOS name, the logon format and UPN suffix, the account name and the password, plus two flags for service accounts and gMSAs.',
    use: [
      'The logon format decides the name a bind uses: NETBIOS signs in as `NETBIOS\\username`, UPN as `username@suffix` (or `username@domain` without a suffix). Leave it unset for the default, `username@domain`.',
      'The Service account and gMSA account flags are yes/no markers on the secret.',
    ],
    automation: [
      'The heartbeat binds to the directory as the account itself, and also records whether the account is the domain\'s built-in Administrator and whether `adminCount` is set.',
      'Rotation is a self-service password change made with the current password, so the connector needs no admin rights on the directory. After a change the new password is proved over Kerberos.',
      'The built-in Administrator (RID 500, matched by its SID, never by name) is never rotated; its heartbeat still runs.',
    ],
    targets: 'A target with an LDAPS connection (port 636), an LDAP connection, or a Kerberos connection (kpasswd on port 464 of the same host). Active Directory only allows a password change over an encrypted connection, so use LDAPS or Kerberos to rotate.',
  },
  'type-bank-account': {
    slug: 'bank-account',
    emoji: '🏦',
    summary: 'A bank account: the bank, the account and routing numbers, and the online banking sign-in.',
    use: ['The editor checks the account number (4 to 17 digits) and the routing number (9 digits) before it saves.'],
    targets: 'A Bank Account takes no target.',
  },
  'type-credit-card': {
    slug: 'credit-card',
    emoji: '💳',
    summary: 'A payment card: the cardholder, the card number, the expiry date and the CVV.',
    use: ['The editor checks the card number (13 to 23 digits and spaces), the expiry (MM/YY or MM/YYYY) and the CVV (3 or 4 digits) before it saves.'],
    targets: 'A Credit Card takes no target.',
  },
  'type-license-key': {
    slug: 'license-key',
    emoji: '🧾',
    summary: 'A software license key and the product it belongs to.',
    targets: 'A License Key takes no target.',
  },
  'type-combination-lock': {
    slug: 'combination-lock',
    emoji: '🔒',
    summary: 'The combination of a physical lock, a safe or a key box, and where it is.',
    targets: 'A Combination Lock takes no target.',
  },
  'type-pin': {
    slug: 'pin',
    emoji: '🔢',
    summary: 'A PIN of 3 to 12 digits.',
    targets: 'A PIN takes no target.',
  },
  'type-ssn': {
    slug: 'ssn',
    emoji: '🪪',
    summary: 'A US Social Security Number and the name of the person it belongs to.',
    use: ['The editor takes the number as `123-45-6789` or as nine digits without dashes.'],
    targets: 'A Social Security Number takes no target.',
  },
  'type-contact': {
    slug: 'contact',
    emoji: '📇',
    summary: 'A person\'s contact details: the name, email, phone and postal address.',
    use: ['The email and phone are treated as secret values: they\'re masked until someone reveals them, and every reveal is audited.'],
    targets: 'A Contact takes no target.',
  },
  'type-anthropic-token': {
    slug: 'anthropic-token',
    emoji: '🤖',
    summary: 'An Anthropic OAuth token for an AI coding assistant. The value must start with `sk-ant-oa`.',
    use: ['This is a single token, not an OAuth application; for an OAuth client with its own secret and refresh token, use [OAuth Application](./oauth.md).'],
    targets: 'An Anthropic Token takes no target.',
  },
  'type-ssl-cert': {
    slug: 'ssl-cert',
    emoji: '📜',
    summary: 'A TLS or PKI certificate with its private key and chain. The subject, issuer, names, serial, fingerprint, validity and key details are read from the certificate when it\'s imported.',
    use: [
      'Import a PKCS#12 / PFX, PEM, DER, PKCS#7 or JKS file. The secret\'s page shows the certificate\'s details and how long it has left.',
      'Export it as PEM with or without the private key (a key can be re-encrypted with a passphrase), and replace the material later from the same page.',
    ],
    targets: 'An SSL/PKI Certificate takes no target: there is no rotation for arbitrary certificates.',
  },
};
