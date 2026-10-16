import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import releasesJson from '../../data/releases.json';
import type {ReleasesData} from '../../lib/releases';

import styles from './advisories.module.css';

const releasesData = releasesJson as ReleasesData;

const SEVERITY_LABEL: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unknown: 'Unknown',
};

export default function Advisories(): ReactNode {
  const advisories = releasesData.advisories;
  return (
    <Layout
      title="Security advisories"
      description="Published Sneakers-PAM security advisories (GHSA and CVE), with affected and fixed versions.">
      <main className="container margin-vert--lg">
        <Heading as="h1">🛡️ Security advisories</Heading>
        <p>
          Published security advisories across the Sneakers-PAM repositories, newest first. See{' '}
          <Link to="/docs/security">Security</Link> for how to report a vulnerability, and{' '}
          <Link to="/changelog">Changelog</Link> for what shipped in each release.
        </p>
        {advisories.length === 0 ? (
          <p className={styles.empty}>
            No security advisories have been published yet. This page updates automatically as
            soon as one is.
          </p>
        ) : (
          <div className={styles.list}>
            {advisories.map((a) => (
              <article key={a.ghsaId} className={styles.advisory}>
                <div className={styles.header}>
                  <Heading as="h2" className={styles.title}>
                    <a href={a.url} target="_blank" rel="noreferrer">
                      {a.ghsaId}
                    </a>
                  </Heading>
                  <span className={`${styles.badge} ${styles[a.severity] ?? ''}`}>
                    {SEVERITY_LABEL[a.severity] ?? a.severity}
                  </span>
                  {a.cveId && <span className={styles.cve}>{a.cveId}</span>}
                  <time className={styles.date} dateTime={a.publishedAt}>
                    {new Date(a.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <p>{a.summary}</p>
                {a.affected.length > 0 && (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Affected</th>
                        <th>Fixed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.affected.map((row, i) => (
                        <tr key={i}>
                          <td>{row.package}</td>
                          <td>{row.affected}</td>
                          <td>{row.fixed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
