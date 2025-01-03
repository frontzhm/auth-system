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

## 5. 配置.npmrc - 使用淘宝镜像

在项目根目录下创建`.npmrc`文件，配置淘宝镜像，加快依赖包的下载速度。
全局设置的话，可以在`~/.npmrc`中配置，也可以运行`npm config set registry https://registry.npmmirror.com/`命令。
只是针对当前项目的话，可以在项目根目录下创建`.npmrc`文件，配置如下：

```shell
registry = "https://registry.npmmirror.com/"
```

如果用yarn的话，可以在项目根目录下创建`.yarnrc`文件，配置也是一样。

pnpm安装移除的命令和npm一样，`pnpm install`和`pnpm remove`。

## 6. 配置.prettierrc - 统一代码风格，格式化代码

在项目根目录下创建`.prettierrc`文件，配置`prettier`的一些规则，确保团队成员的代码风格一致。[官网](https://www.prettier.cn/)，也可以[在线玩下](https://www.prettier.cn/playground/)

```shell
# pnpm install prettier --save-dev
# 安装到开发依赖，线上不需要
pnpm install prettier -D
```

以下是一个简单的配置，可以根据自己的需求进行配置。

```js
// .prettierrc.cjs
module.exports = {
  printWidth: 120, // 每行最大列，超过换行，默认80
  semi: false, // 末尾分号，默认为true，改为false
  singleQuote: true, // 使用单引号，默认为false，改为true
  jsxSingleQuote: true, // jsx中使用单引号，默认为false，改为true
  trailingComma: 'all', // 数组、对象最后一个元素后面是否加逗号（在ES5中加尾逗号），默认none，可选 none|es5|all
  tabWidth: 2, // 缩进长度，默认2
  endOfLine: 'lf', // 换行符，可选 lf|crlf|cr，默认lf
  singleAttributePerLine: false, // 多个属性是否换行, 默认为false
}
```

安装`prettier`插件，可以在VSCode中安装`Prettier - Code formatter`插件，希望保存时自动格式化代码，可以在项目里创建`.vscode/settings.json`文件，添加如下配置，表示项目范围内保存的时候，自动格式化代码。

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 7. 配置.eslintrc - 统一代码规范

在项目根目录下创建`.eslintrc`文件，配置`eslint`的一些规则，确保团队成员的代码规范一致。

```json
{
  "extends": ["react-app", "plugin:prettier/recommended"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

## 疑问区

1. 为什么要使用`vite`？

`vite`是一个基于`ESBuild`的新一代前端构建工具，它的特点是快速、简单、开箱即用。直接使用`import`的方式引入模块，不需要打包，开发环境下的热更新速度非常快，这样可以提高开发效率。
可以看下`index.html`中的引入方式，直接引入`/src/main.tsx`，不需要打包。

```html
<script type="module" src="/src/main.tsx"></script>
```

2. 为什么要使用`pnpm`？

`pnpm`是一个快速、节省磁盘空间的包管理工具，它的特点是共享依赖，不会重复下载依赖包，节省磁盘空间。`pnpm`的速度比`npm`和`yarn`都要快，可以提高开发效率。
