import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    // 禁用所有代码块的实时预览功能‌:ml-citation{ref="3,7" data="citationList"}
    showPreview: false,
    // 关闭代码块的交互操作栏‌:ml-citation{ref="3" data="citationList"}
    hideActions: ['EXTERNAL', 'RIDDLE', 'CODESANDBOX'],

  },
  // 全局禁用组件渲染‌:ml-citation{ref="3" data="citationList"}
  resolve: {
    codeBlockMode: 'passive' // 关闭自动解析为可执行组件
  }
});
