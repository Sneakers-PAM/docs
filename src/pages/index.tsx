import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type Feature = {
  icon: string;
  title: string;
  details: string;
};

const features: Feature[] = [
  {
    icon: '🗄️',
    title: 'One place for secrets',
    details:
      'Credentials live in folders with their own access rules, never scattered across config files or chat threads.',
  },
  {
    icon: '✅',
    title: 'Approvals, not blanket access',
    details:
      'Reveals, check-outs and break-glass access can all require a reason and, where set up, a second approver.',
  },
  {
    icon: '🔄',
    title: 'Rotation you can trust',
    details:
      'A heartbeat checks that a target still matches what the vault holds, and rotation runs on a schedule or on demand.',
  },
  {
    icon: '🔗',
    title: "An audit trail that can't be quietly edited",
    details:
      'Every action is recorded in a hash-chained log; a changed, deleted or reordered record is detectable.',
  },
  {
    icon: '🤖',
    title: 'Built for agents too',
    details:
      'An MCP server lets coding agents and other tools use secrets through the same approvals and audit trail as a person would.',
  },
  {
    icon: '📦',
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

function WhyShort(): ReactNode {
  return (
    <section className={styles.notice}>
      <div className="container">
        <p className={styles.whyPitch}>
          A privileged access manager you own outright: a signed appliance you can roll back,
          built so AI agents can use a credential without ever holding a copy.
        </p>
        <div className="row">
          <div className="col col--6">
            <Heading as="h3">🤖 Agents first</Heading>
            <p>
              An agent signs in with its own token, never a person's password, and can use a
              secret without ever seeing it. Every tool call is audited to the token that made
              it; revoke one and the rest keep working. Agents can't break the glass.
            </p>
          </div>
          <div className="col col--6">
            <Heading as="h3">🏠 You own it</Heading>
            <p>
              One signed appliance, on your own hypervisor — no cloud account to open. Run it
              fully offline, carrying signed update files in by hand, and every unit has its own
              way back.
            </p>
          </div>
        </div>
        <p>
          <Link to="/docs/why">Why Sneakers-PAM →</Link>
        </p>
      </div>
    </section>
  );
}

function Features(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(({icon, title, details}) => (
            <div key={title} className={clsx('col col--4', styles.featureCol)}>
              <div className={styles.feature}>
                <span className={styles.featureIcon} aria-hidden="true">
                  {icon}
                </span>
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
          Most privileged access tools were built for people at a desk, sold as a service and
          priced per seat. Sneakers-PAM is built for how teams work now:
        </p>
        <ul className={styles.whyList}>
          <li>
            🔐 <b>One place for every privileged credential,</b> behind the rules each folder
            sets, instead of spreadsheets, ticket comments and chat.
          </li>
          <li>
            ⚡ <b>One prompt per task.</b> It knows who's asking and what they've already proved,
            so an outage doesn't turn into a stack of approvals. Nobody approves their own request.
          </li>
          <li>
            🤖 <b>Agents as first-class users,</b> with their own tokens, using secrets without
            holding them, and recorded as themselves.
          </li>
          <li>
            🧾 <b>An audit trail nobody can quietly edit,</b> with every action in one hash-chained
            log.
          </li>
          <li>
            📦 <b>Yours to run,</b> on your own hypervisor, offline if you want, with every update
            reversible.
          </li>
        </ul>
        <p>
          Privileged access has no organisation-specific core, so Sneakers-PAM is open source
          under Apache-2.0, for anyone who needs it.
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
          site are all being built in the open as a from-scratch, open-source PAM. Two release
          candidates, v0.1.0-rc.1 and v0.1.0-rc.2, are out, and it's already running in production
          for real workloads — but interfaces, configuration and the install flow can still change
          before v0.1.0 itself ships. Most pages below mark what's still coming.
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
        <WhyShort />
        <Features />
        <Story />
        <UseCase />
        <PreReleaseNotice />
      </main>
    </Layout>
  );
}
