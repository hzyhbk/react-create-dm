export default {
  mode: 'site',
  title: 'ReactCreateDM',
  base: '/react-create-dm',
  publicPath: '/react-create-dm/',
  exportStatic: {},
  description: '使用函数优雅地创建弹框抽屉',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  menus: {
    '/guide': [
      {
        title: '指南',
        children: ['/guide/index.md'],
      },
      {
        title: '示例',
        children: ['/guide/modal.md', '/guide/drawer.md'],
      },
    ],
  },
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/hzyhbk/react-create-dm',
    },
    {
      title: 'VueCreateDM',
      path: 'https://hzyhbk.github.io/vue-create-dm/',
    },
  ],

  // more config: https://d.umijs.org/config
};
