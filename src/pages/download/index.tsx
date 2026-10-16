import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import releasesJson from '../../data/releases.json';
import {latestByChannel, type ReleasesData} from '../../lib/releases';

import styles from './styles.module.css';

const releasesData = releasesJson as ReleasesData;

export default function Download(): ReactNode {
  const appliance = latestByChannel(releasesData.releases, 'Sneakers-PAM/sneakers-appliance');
  const release = latestByChannel(releasesData.releases, 'Sneakers-PAM/sneakers-release');

  return (
    <Layout title="Download" description="Get the Sneakers-PAM appliance or the Helm release.">
      <main className="container margin-vert--lg">
        <Heading as="h1">⬇️ Download</Heading>
        <p>
          Sneakers-PAM runs one of two ways: a signed, single-node appliance, or Helm charts on
          your own Kubernetes. Both come from the same pinned release.
        </p>

        <section className={styles.card} id="appliance">
          <Heading as="h2">📦 The appliance</Heading>
          {appliance.latest ? (
            <>
              <p>
                Latest: <strong>{appliance.latest.version ?? appliance.latest.tag}</strong> (
                {appliance.latest.channel === 'stable' ? 'stable' : 'release candidate'})
              </p>
              <p>
                <a
                  className="button button--primary button--lg"
                  href={appliance.latest.url}
                  target="_blank"
                  rel="noreferrer">
                  Get the OVA on GitHub Releases
                </a>
              </p>
            </>
          ) : (
            <p className={styles.empty}>No appliance release has been published yet.</p>
          )}
          <p>
            Each release ships a VMware OVA with its checksum and a signature by the project's
            release key. <strong>Always verify both before importing it.</strong> See{' '}
            <Link to="/docs/appliance-guide/install">Install</Link> for the exact commands, how to
            clear the VM's Secure Boot keys before the first power-on, and how to build your own
            image from a signed release with <code>sneakers-kit</code> instead of downloading the
            published one. ISO and arm64 images are reserved names in the release format but
            aren't built yet.
          </p>
        </section>

        <section className={styles.card} id="helm">
          <Heading as="h2">☸️ Helm, on your own Kubernetes</Heading>
          {release.latest ? (
            <p>
              Latest: <strong>{release.latest.version ?? release.latest.tag}</strong>, from{' '}
              <a href={release.latest.url} target="_blank" rel="noreferrer">
                the sneakers-release GitHub release
              </a>
              .
            </p>
          ) : (
            <p className={styles.empty}>No release has been published yet.</p>
          )}
          <p>
            Install the <code>sneakers</code> umbrella chart from a checkout of{' '}
            <a href="https://github.com/Sneakers-PAM/sneakers-release">sneakers-release</a> at
            that tag. See <Link to="/docs/kubernetes-helm">Kubernetes with Helm</Link> for the
            requirements, the commands and what you're responsible for running yourself (the
            cluster, TLS and backups) instead of the appliance handling them.
          </p>
        </section>

        <section className={styles.card}>
          <Heading as="h2">🧭 Which one?</Heading>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Appliance</th>
                <th>Helm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Updates</td>
                <td>Signed packages from :8443, with automatic fallback</td>
                <td><code>helm upgrade</code>, when you run it</td>
              </tr>
              <tr>
                <td>Kubernetes</td>
                <td>k0s, pinned in the release</td>
                <td>Your cluster</td>
              </tr>
              <tr>
                <td>TLS and the public edge</td>
                <td>Built in</td>
                <td>Your ingress controller and certificates</td>
              </tr>
              <tr>
                <td>Backups</td>
                <td>The recovery keys and the escrow</td>
                <td>Yours: PostgreSQL and the Secrets</td>
              </tr>
            </tbody>
          </table>
          <p>
            See <Link to="/docs/getting-started">Getting started</Link> for the full path from
            nothing to a signed-in first admin, whichever you pick, and{' '}
            <Link to="/changelog">Changelog</Link> for what's in every release.
          </p>
        </section>

        <aside className={styles.notice}>
          <strong>Pre-1.0 notice.</strong> Sneakers-PAM is before its first stable release.
          Interfaces, configuration and the install flow can still change before v0.1.0. Try it in
          a lab first.
        </aside>
      </main>
    </Layout>
  );
}
