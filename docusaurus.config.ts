import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Vyckey Computer Notes',
  tagline: 'Programmer are cool ~',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'http://hoily.site',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vyckey', // Usually your GitHub org/user name.
  projectName: 'vyckey-computer-notes', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'ai',
        path: 'ai',
        routeBasePath: 'ai',
        // editUrl: ({locale, versionDocsDirPath, docPath}) => {
        //   if (locale !== defaultLocale) {
        //     return `https://crowdin.com/project/docusaurus-v2/${locale}`;
        //   }
        //   return `https://github.com/facebook/docusaurus/edit/main/website/${versionDocsDirPath}/${docPath}`;
        // },
        // remarkPlugins: [npm2yarn],
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'java',
        path: 'java',
        routeBasePath: 'java',
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'database',
        path: 'database',
        routeBasePath: 'database',
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'middleware',
        path: 'middleware',
        routeBasePath: 'middleware',
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'bigdata',
        path: 'bigdata',
        routeBasePath: 'bigdata',
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
    [
      'content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'frontend',
        path: 'frontend',
        routeBasePath: 'Frontend',
        editCurrentVersion: true,
        sidebarPath: require.resolve('./sidebars.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }),
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Vyckey Notes',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.jpeg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Computer',
        },
        { 
          type: 'dropdown',
          label: 'Database',
          position: 'left',
          to: '/database',
          items: [
            {label: 'MySQL', to: '/database/mysql'},
            {label: 'Redis', to: '/database/redis'},
            {label: 'ES', to: '/database/elasticsearch'}
          ]
        },
        {to: '/java', label: 'Java', position: 'left'},
        { 
          type: 'dropdown',
          label: 'Middleware',
          position: 'left',
          to: '/middleware',
          items: [
            {label: 'Dubbo', to: '/middleware/rpc/dubbo'},
            {label: 'Kafka', to: '/middleware/mq/kafka'},
          ]
        },
        {to: '/bigdata', label: 'Bigdata', position: 'left'},
        { 
          type: 'dropdown',
          label: 'AI',
          position: 'left',
          to: '/ai',
          items: [
            {label: 'Transformer', to: '/ai/deeplearning/transformer'},
            {label: 'Models', to: '/ai/deeplearning/models'},
          ]
        },
        {to: '/frontend', label: 'Frontend', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/vyckey/vyckey-computer-notes',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      }
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 6
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Notes',
          items: [
            {
              label: 'Java',
              to: '/java',
            },
            {
              label: 'AI',
              to: '/ai',
            },
          ],
        },
        {
          title: 'E-mail',
          items: [
            {
              label: 'Google E-mail',
              href: 'mailto:vyckeyolyland@gmail.com',
            },
            {
              label: 'QQ E-mail',
              href: 'mailto:vyckey@qq.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vyckey/vyckey-computer-notes',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vyckey's Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'python']
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
