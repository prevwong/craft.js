/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = {
  title: 'craft.js',
  tagline: 'A React framework for building drag-n-drop page editors',
  url: 'https://craft.js.org/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'prevwong', // Usually your GitHub org/user name.
  projectName: 'craft.js', // Usually your repo name.
  onBrokenLinks: 'warn',
  themeConfig: {
    algolia: {
      apiKey: 'e641d82b10af84aa818e883b1035c3b4',
      indexName: 'craft-js',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    prism: {
      theme: require('prism-react-renderer/themes/shadesOfPurple'),
    },
    navbar: {
      hideOnScroll: false,
      title: 'craft.js',
      items: [
        {
          to: 'docs/overview',
          label: 'Documentation',
          activeBasePath: `docs`,
          position: 'left',
        },
        // TODO: create an /examples page in Docusaurus
        {
          label: 'Examples',
          position: 'right',
          items: [
            {
              to: 'examples/landing/',
              label: 'Landing',
            },
            {
              to: 'examples/basic/',
              label: 'Basic',
            },
          ],
        },
        { to: 'support', label: 'Support', position: 'right' },
        {
          href: 'https://github.com/prevwong/craft.js',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: 'docs/overview',
            },
            {
              label: 'Core Concepts',
              to: 'docs/concepts/nodes',
            },
            {
              label: 'Tutorial',
              to: 'docs/guides/basic-tutorial',
            },
            {
              label: 'API Reference',
              to: 'docs/api/editor-state',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github Repository',
              href: 'https://github.com/prevwong/craft.js',
            },
            {
              label: 'Open Collective',
              href: 'https://opencollective.com/craftjs',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/sPpF7fX',
            },
            {
              label: 'NPM',
              href: 'https://npmjs.com/package/@craftjs/core',
            },
          ],
        },
        {
          title: 'Find me elsewhere',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/prevwong',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/prev/',
            },
            {
              label: 'Dribbble',
              href: 'https://dribbble.com/prevwong',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/prevwong',
            },
          ],
        },
      ],

      copyright: `Copyright © ${new Date().getFullYear()} Prev Wong`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
