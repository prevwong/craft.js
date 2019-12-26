/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'craft.js',
  tagline: 'A React framework for building drag-n-drop page editors',
  url: 'https://prevwong.github.io/craft.js',
  baseUrl: '/craft.js/r/',
  favicon: 'img/favicon.ico',
  organizationName: 'prevwong', // Usually your GitHub org/user name.
  projectName: 'craft.js', // Usually your repo name.
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/shadesOfPurple'),
    },
    navbar: {
      logo: {
        alt: 'Craft.js',
        src: 'img/logo.png',
      },
      links: [
        {to: 'docs/overview', label: 'Docs', position: 'left'},
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
              label: 'Docs',
              to: 'docs/overview',
            },
            {
              label: 'Core Concepts',
              to: 'docs/concepts/nodes',
            },
            {
              label: 'Tutorial',
              to: 'docs/basic-tutorial',
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
              label: 'Project page',
              href: 'https://github.com/prevwong/craft.js',
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
     
      copyright: `Copyright © ${new Date().getFullYear()} Prev Wong.`,
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
