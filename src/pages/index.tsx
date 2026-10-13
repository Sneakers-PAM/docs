import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type Feature = {
  title: string;
  details: string;
};

const features: Feature[] = [
  {
    title: 'One place for secrets',
    details:
      'Credentials live in folders with their own access rules, never scattered across config files or chat threads.',
  },
  {
    title: 'Approvals, not blanket access',
    details:
      'Reveals, check-outs and break-glass access can all require a reason and, where set up, a second approver.',
  },
  {
    title: 'Rotation you can trust',
    details:
      'A heartbeat checks that a target still matches what the vault holds, and rotation runs on a schedule or on demand.',
  },
  {
    title: "An audit trail that can't be quietly edited",
    details:
      'Every action is recorded in a hash-chained log; a changed, deleted or reordered record is detectable.',
  },
  {
    title: 'Built for agents too',
    details:
      'An MCP server lets coding agents and other tools use secrets through the same approvals and audit trail as a person would.',
  },
  {
    title: 'Run it yourself',
    details:
      'Sneakers-PAM ships as a signed, single-node appliance you build from an org-signed release — no hosted service required.',
  },
];

function Hero(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.heroName}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroText}>Privileged access, kept on a short leash.</p>
        <p className={styles.heroTagline}>
          An open-source, Apache-2.0 privileged access management system — a vault for credentials,
          scoped secret delivery, and an audit trail for every access.
        </p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/download">
            Download
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/getting-started">
            Getting started
          </Link>
          <Link className="button button--secondary button--lg" href="https://github.com/Sneakers-PAM">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function Features(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(({title, details}) => (
            <div key={title} className={clsx('col col--4', styles.featureCol)}>
              <div className={styles.feature}>
                <Heading as="h3">{title}</Heading>
                <p>{details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story(): ReactNode {
  return (
    <section className={styles.notice}>
      <div className="container">
        <Heading as="h2">Why it exists</Heading>
        <p>
          Sneakers-PAM comes from years of running privileged access in two major hospitals and a
          private healthcare organisation, from the seats of a CISO, a VP of infrastructure and a
          CIO. At every one of them the most dangerous passwords were the ones nobody could find
          quickly: shared admin passwords in spreadsheets and ticket comments, values pasted into
          chat, and audit answers spread across three logs, if they lived anywhere.
        </p>
        <p>
          The moment that sums it up: a system is down, people are waiting, and the tool holding
          the one password that matters asks for an approval, then a second factor, then the second
          factor again. By the third prompt nobody is thinking about the outage, only about the
          shortcut they'll take next time. A control that costs that much attention stops being a
          control.
        </p>
        <p>
          So Sneakers-PAM is built around one idea: know who's asking and what they've already
          proved, instead of asking again. Owners decide and nobody approves their own request, one
          task gets one prompt, and every action lands in an audit trail nobody can quietly edit.
          Privileged access has no organisation-specific core, so it's open source, for anyone who
          needs it.
        </p>
      </div>
    </section>
  );
}

function UseCase(): ReactNode {
  return (
    <section className={styles.notice}>
      <div className="container">
        <Heading as="h2">🤖 Built for agents, not just people</Heading>
        <p>
          AI agents and automated tools need credentials as much as people do. Sneakers-PAM's MCP
          server lets an agent find, use and even generate secrets through the same approvals and
          audit trail a person would use — see{' '}
          <Link to="/docs/use-cases/agent-vault">the vault-for-agents use case</Link> for a hub of
          agents keeping their credentials out of every workspace they touch.
        </p>
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
    <Layout title="Home" description={siteConfig.tagline}>
      <Hero />
      <main>
        <Features />
        <Story />
        <UseCase />
        <PreReleaseNotice />
      </main>
    </Layout>
  );
}
