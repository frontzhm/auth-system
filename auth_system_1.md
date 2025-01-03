---
title: 后台系统从零搭建（一）—— 框架
tags: vue
categories: vue
theme: vue-pro
highlight:
---


本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

## 1. 创建项目

首先我们需要创建一个项目，这里我们使用`Vite`来创建项目。

```bash
pnpm create vite admin-system
✔ Select a framework: › React
✔ Select a variant: › TypeScript
```

## 2. 安装依赖和启动项目

```bash
cd admin-system
pnpm install
pnpm run dev
pnpm install react-router react-router-dom zustand antd axios
```
## 3. 配置@指向src目录 - 优化路径

需要两处配置
- `vite.config.ts`中配置，让vite能够识别`@`指向`src`目录，编译成功
- `tsconfig.app.json`中配置，让`ts`能够识别`@`指向`src`目录，识别成功并能够跳转

``

在`vite.config.ts`中添加`alias`配置。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @配置别名
  resolve: {
    alias: {
      '@': '/src/',
    },
  },
})
```
t
在`tsconfig.app.json`中添加`"baseUrl": "./src"`，这样我们就可以使用`@`来指向`src`目录。

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

![rbac_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/rbac_1.png)
![rbac_2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/rbac_2.png)

## 4. 配置.editorconfig - 统一编辑器风格

在项目根目录下创建`.editorconfig`文件，配置编辑器的一些规则。确保团队成员的编辑器风格一致，在VSCode中安装`EditorConfig for VS Code`插件，可以自动识别`.editorconfig`文件。

```shell
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```



## 疑问区

1. 为什么要使用`vite`？

`vite`是一个基于`ESBuild`的新一代前端构建工具，它的特点是快速、简单、开箱即用。直接使用`import`的方式引入模块，不需要打包，开发环境下的热更新速度非常快，这样可以提高开发效率。
可以看下`index.html`中的引入方式，直接引入`/src/main.tsx`，不需要打包。

```html
<script type="module" src="/src/main.tsx"></script>
```
