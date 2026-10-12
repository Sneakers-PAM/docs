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
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsible: false,
      items: [
        {type: 'doc', id: 'index', label: 'Overview'},
        {type: 'doc', id: 'admin-guide/folders-and-permissions', label: 'Secrets and folders'},
        {type: 'doc', id: 'admin-guide/approval-policy', label: 'Approvals and requests'},
        {type: 'doc', id: 'user-guide/check-out', label: 'Check-out and check-in'},
        {type: 'doc', id: 'admin-guide/rotation-and-heartbeat', label: 'Heartbeat and rotation'},
        {type: 'doc', id: 'admin-guide/break-glass', label: 'Break-glass'},
        {type: 'doc', id: 'admin-guide/mcp-and-agent-tokens', label: 'Agents and the MCP'},
        {type: 'doc', id: 'admin-guide/audit', label: 'Audit trail'},
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
      items: [{type: 'doc', id: 'user-guide/agents-and-the-mcp', label: 'Using the MCP'}],
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
