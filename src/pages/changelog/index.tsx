import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import {byUnit, type InlineRun, type NoteBlock, type ReleasesData} from '../../lib/releases';
import releasesJson from '../../data/releases.json';

import styles from './styles.module.css';

const releasesData = releasesJson as ReleasesData;

function Inline({runs}: {runs: InlineRun[]}): ReactNode {
  return (
    <>
      {runs.map((run, i) => {
        if (run.t === 'code') return <code key={i}>{run.v}</code>;
        if (run.t === 'bold') return <strong key={i}>{run.v}</strong>;
        if (run.t === 'link')
          return (
            <a key={i} href={run.href} target="_blank" rel="noreferrer">
              {run.v}
            </a>
          );
        return <span key={i}>{run.v}</span>;
      })}
    </>
  );
}

function Notes({blocks}: {blocks: NoteBlock[]}): ReactNode {
  return (
    <div className={styles.notes}>
      {blocks.map((block, i) => {
        if (block.type === 'heading')
          return (
            <Heading as="h4" key={i}>
              <Inline runs={block.inline} />
            </Heading>
          );
        if (block.type === 'list')
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline runs={item} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <Inline runs={block.inline} />
          </p>
        );
      })}
    </div>
  );
}

const CHANNEL_LABEL: Record<string, string> = {
  stable: 'Stable',
  rc: 'Release candidate',
  'pre-release': 'Pre-release',
};

export default function Changelog(): ReactNode {
  const sections = byUnit(releasesData.releases);
  return (
    <Layout title="Changelog" description="What shipped in each Sneakers-PAM release, by unit.">
      <main className="container margin-vert--lg">
        <Heading as="h1">📰 Changelog</Heading>
        <p>
          What shipped in each release, grouped by the unit it ships: the appliance's Base OS and
          Base Web, and the Sneakers-PAM product itself (the appliance and the Helm release carry
          the same product version). Every entry links back to the full release notes on GitHub.
          See <Link to="/security/advisories">Security advisories</Link> for published CVEs and
          GHSAs.
        </p>
        {sections.map((section) => (
          <section key={section.id} className={styles.unitSection}>
            <Heading as="h2">{section.label}</Heading>
            {section.entries.length === 0 ? (
              <p className={styles.empty}>No releases yet.</p>
            ) : (
              section.entries.map((entry) => (
                <article key={`${entry.repo}-${entry.tag}`} className={styles.release}>
                  <div className={styles.releaseHeader}>
                    <Heading as="h3" className={styles.releaseVersion}>
                      <a href={entry.url} target="_blank" rel="noreferrer">
                        {entry.version}
                      </a>
                    </Heading>
                    <span className={styles.badge}>{CHANNEL_LABEL[entry.channel] ?? entry.channel}</span>
                    <time className={styles.date} dateTime={entry.publishedAt}>
                      {new Date(entry.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <Notes blocks={entry.notes} />
                </article>
              ))
            )}
          </section>
        ))}
      </main>
    </Layout>
  );
}
