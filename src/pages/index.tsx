import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {SplitHero} from '@site/src/components/SplitHero';

import styles from './index.module.css';

type EntryPoint = {
  title: string;
  details: string;
  to: string;
};

const entryPoints: EntryPoint[] = [
  {
    title: 'User guide',
    details: 'Sign in, find and use a secret, check out, ask for access, break the glass.',
    to: '/docs/user-guide',
  },
  {
    title: 'Admin guide',
    details: 'Folders and permissions, secret types, targets, rotation, approvals, audit.',
    to: '/docs/admin-guide',
  },
  {
    title: 'Appliance guide',
    details: 'Install, first setup, protection levels, updates, backups, the console.',
    to: '/docs/appliance-guide',
  },
  {
    title: 'Migration guide',
    details: 'Move an existing Sneakers-PAM install, step by step, with the lessons learned.',
    to: '/docs/migration-guide',
  },
];

function EntryPoints(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {entryPoints.map(({title, details, to}) => (
            <div key={title} className={clsx('col col--3', styles.featureCol)}>
              <Link to={to} className={styles.feature}>
                <Heading as="h3">{title}</Heading>
                <p>{details}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreReleaseNotice(): ReactNode {
  return (
    <section className={styles.notice}>
      <div className="container">
        <Heading as="h2">Pre-1.0 notice</Heading>
        <p>
          Sneakers-PAM is pre-1.0 and under active development. The services, the appliance and this
          site are all being built in the open as a from-scratch, open-source PAM. Interfaces,
          configuration and the install flow can still change before v0.1.0. Nothing here is ready
          for production use yet — most pages below mark what's still coming.
        </p>
        <p>
          Follow along or get involved on <Link href="https://github.com/Sneakers-PAM">GitHub</Link>;
          see <Link to="/docs/contributing">Contributing</Link> for how.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Documentation" description={siteConfig.tagline}>
      <SplitHero
        eyebrow="Documentation"
        headline="Everything you need to"
        headlineAccent="run Sneakers-PAM"
        lede={
          <>
            Guides for the three people who meet it: the <mark>people who use it</mark> every day,
            the <mark>admins who run it</mark>, and the <mark>admins who look after the appliance</mark>{' '}
            it ships on.
          </>
        }
        primaryCta={{label: 'Get started', to: '/docs/getting-started'}}
        secondaryCta={{label: 'Why Sneakers-PAM', to: '/docs/why'}}
        terminalTitle="sneakers-run"
        terminalLines={[
          {prompt: 'sneakers-run -secret prod/db-primary -- psql'},
          {text: 'you can read this secret — no approval needed'},
          {text: 'connecting to db-primary.example.org ...'},
          {text: 'logged: check-out by you, 08:14:02'},
        ]}
      />
      <main>
        <EntryPoints />
        <PreReleaseNotice />
      </main>
    </Layout>
  );
}
