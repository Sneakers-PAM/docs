import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Order here is the sidebar order; ids are file paths under docs/ minus ".md".
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Start here',
      collapsible: false,
      items: [
        {type: 'link', label: 'Home', href: '/'},
        {type: 'doc', id: 'getting-started', label: 'Getting started'},
        {type: 'doc', id: 'install-proxmox', label: 'Install on Proxmox VE'},
        {type: 'doc', id: 'release-notes', label: 'Release notes'},
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsible: false,
      items: [
        {type: 'doc', id: 'concepts/index', label: 'Overview'},
        {type: 'doc', id: 'concepts/secrets-and-folders', label: 'Secrets and folders'},
        {type: 'doc', id: 'concepts/approvals', label: 'Approvals and requests'},
        {type: 'doc', id: 'concepts/check-out', label: 'Check-out and check-in'},
        {type: 'doc', id: 'concepts/heartbeat-and-rotation', label: 'Heartbeat and rotation'},
        {type: 'doc', id: 'concepts/break-glass', label: 'Break-glass'},
        {type: 'doc', id: 'concepts/agents-and-mcp', label: 'Agents and the MCP'},
        {type: 'doc', id: 'concepts/audit', label: 'Audit trail'},
      ],
    },
    {
      type: 'category',
      label: 'Use cases',
      collapsible: false,
      items: [{type: 'doc', id: 'use-cases/agent-vault', label: 'A vault for AI agents'}],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsible: false,
      items: [
        {type: 'doc', id: 'mcp-guide', label: 'Using the MCP'},
        {type: 'doc', id: 'appliance-updates-guide', label: 'Updating the appliance'},
        {type: 'doc', id: 'cli-sign-in-guide', label: 'Signing in from the command line'},
        {type: 'doc', id: 'github-app-guide', label: 'Storing a GitHub App'},
        {type: 'doc', id: 'change-type-guide', label: "Changing a secret's type"},
        {type: 'doc', id: 'appliance-network-guide', label: "Changing the appliance's network"},
        {type: 'doc', id: 'support-bundle-guide', label: 'Getting a support bundle'},
      ],
    },
    {
      type: 'category',
      label: 'Project',
      collapsible: false,
      items: [
        {type: 'doc', id: 'security', label: 'Security'},
        {type: 'doc', id: 'contributing', label: 'Contributing'},
        {type: 'doc', id: 'governance', label: 'Governance'},
        {type: 'doc', id: 'license', label: 'License'},
      ],
    },
  ],
};

export default sidebars;
