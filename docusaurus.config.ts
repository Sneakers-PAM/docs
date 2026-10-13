import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

// Versioned docs: until the first release there are no snapshots, so the
// unversioned "current" docs are the whole site and must stay included. Once a
// version is cut, the release build sets DOCS_INCLUDE_NEXT=false so "next" is
// served locally but left out of the published site.
const includeNext = process.env.DOCS_INCLUDE_NEXT !== 'false';

const config: Config = {
  title: 'sneakers·pam',
  tagline: 'An open-source, Apache-2.0 privileged access management system.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://sneakers-pam.github.io',
  baseUrl: '/website/',
  trailingSlash: false,

  organizationName: 'Sneakers-PAM',
  projectName: 'website',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  markdown: {
    // future.v4 turns this off by default; the docs rely on explicit heading
    // IDs (`## Heading {#id}`), which need the MDX1-compat escape or acorn
    // tries to parse "{#id}" as a JS expression and fails the build.
    mdx1Compat: {
      headingIds: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Sneakers-PAM/website/edit/main/',
          showLastUpdateTime: true,
          includeCurrentVersion: includeNext,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [{name: 'theme-color', content: '#2F5BD3'}],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'sneakers·pam',
      logo: {
        alt: 'sneakers·pam',
        src: 'img/mark-light.svg',
        srcDark: 'img/mark-dark.svg',
      },
      items: [
        {to: '/download', label: 'Download', position: 'left'},
        {to: '/docs/getting-started', label: 'Getting started', position: 'left'},
        {to: '/docs/admin-guide', label: 'Admin guide', position: 'left', activeBasePath: '/docs/admin-guide'},
        {to: '/docs/appliance-guide', label: 'Appliance guide', position: 'left', activeBasePath: '/docs/appliance-guide'},
        {to: '/docs/user-guide/agents-and-the-mcp', label: 'Using the MCP', position: 'left'},
        {to: '/changelog', label: 'Changelog', position: 'left'},
        {to: '/docs/security', label: 'Security', position: 'left'},
        {type: 'docsVersionDropdown', position: 'right'},
        {
          href: 'https://github.com/Sneakers-PAM',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright:
        'Released under the Apache License, Version 2.0.<br />' +
        'Copyright 2026 The Sneakers-PAM Authors',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
