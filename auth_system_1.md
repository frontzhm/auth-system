---
title: 后台系统从零搭建（一）—— 项目基础
tags: vue
categories: vue
theme: vue-pro
highlight:
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter6 + Vite4 + Antd5 + zustand  + TS`。
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
```

## 3. 配置.editorconfig - 统一编辑器风格

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

## 4. 配置.npmrc - 使用淘宝镜像

在项目根目录下创建`.npmrc`文件，配置淘宝镜像，加快依赖包的下载速度。
全局设置的话，可以在`~/.npmrc`中配置，也可以运行`npm config set registry https://registry.npmmirror.com/`命令。
只是针对当前项目的话，可以在项目根目录下创建`.npmrc`文件，配置如下：

```shell
registry = "https://registry.npmmirror.com/"
```

如果用yarn的话，可以在项目根目录下创建`.yarnrc`文件，配置也是一样。

pnpm安装移除的命令和npm一样，`pnpm install`和`pnpm remove`。

## 5. 配置.prettierrc - 统一代码风格，格式化代码

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

## 6. 配置eslint.config.js - 检查代码，提高代码质量

最新的vite已经集成了eslint，所以不用处理。
这里介绍下eslint，eslint是一个代码检查工具，可以帮助我们统一代码风格，确保团队成员的代码风格一致。[官网](https://eslint.org/)，也可以[在线玩下](https://eslint.org/demo/)

eslint和prettier感觉都是代码检查工具，有什么区别呢？

- Prettier是一个代码格式化工具，它可以帮助你自动格式化代码，确保代码风格的一致性。Prettier主要关注代码的排版和格式，比如空格、缩进、括号等。它强制执行一种代码风格，不会询问你的偏好，也不会与你的代码风格冲突。这意味着，如果你在一个团队中使用Prettier，那么所有人的代码风格都会保持一致。其支持多种编程语言，包括JavaScript、TypeScript、CSS、HTML等。
- ESLint是一个代码质量检查工具，它可以帮助你检测代码中的错误、潜在的问题和不一致的地方。ESLint主要关注代码的质量和可维护性，比如变量命名、代码结构、潜在的bug等。ESLint的特点是它非常灵活，你可以根据自己的需求配置规则。这意味着，你可以选择哪些规则要启用，哪些规则要禁用，以及如何处理违反规则的情况。ESLint也支持多种编程语言，包括JavaScript、TypeScript、CSS、HTML等。

如果项目没有eslint的话，

```shell
pnpm install eslint -D
# 初始化eslint配置文件
eslint --init
```

`eslint.config.js`一般是加上官方推荐的规则，然后根据自己的需求进行配置。

```js
rules: {
  // ...
  // 禁止使用var
  'no-var': 'error',
  // 警告使用console
  'no-console': 'warn',
  // 警告使用debugger
  'no-debugger': 'warn',
  // 警告使用alert
  'no-alert': 'warn',
},
```

## 7. vite.config.ts - 配置vite

vite的[官网](https://cn.vitejs.dev/guide/)，vite是一个基于ESBuild的新一代前端构建工具，它的特点是快速、简单、开箱即用。直接使用import的方式引入模块，不需要打包，开发环境下的热更新速度非常快，这样可以提高开发效率。
这里看下并使用下[常用配置](https://cn.vitejs.dev/config/shared-options.html)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // @配置根目录, 默认是当前目录,index.html所在目录
  base: '/', // @配置基础路径, 默认是/,如果配置/base/，那么访问路径就是http://localhost:3000/base/index.html
  publicDir: 'public', // @配置静态资源目录, 默认是public
  server: {
    port: 3000, // @配置端口号, 默认是3000
    open: true, // @配置是否自动打开浏览器, 默认是false
    proxy: {
      // @配置代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

## 8. 配置@指向src目录 - 结合vite配置和ts配置

需要两处配置

- `vite.config.ts`中配置，让vite能够识别`@`指向`src`目录，编译成功
- `tsconfig.app.json`中配置，让`ts`能够识别`@`指向`src`目录，识别成功并能够跳转

``

在`vite.config.ts`中添加`alias`配置。

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ...
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

## 疑问区

1. 为什么要使用`vite`？

`vite`是一个基于`ESBuild`的新一代前端构建工具，它的特点是快速、简单、开箱即用。直接使用`import`的方式引入模块，不需要打包，开发环境下的热更新速度非常快，这样可以提高开发效率。
可以看下`index.html`中的引入方式，直接引入`/src/main.tsx`，不需要打包。

```html
<script type="module" src="/src/main.tsx"></script>
```

2. 为什么要使用`pnpm`？

`pnpm`是一个快速、节省磁盘空间的包管理工具，它的特点是共享依赖，不会重复下载依赖包，节省磁盘空间。`pnpm`的速度比`npm`和`yarn`都要快，可以提高开发效率。

5. 为什么要使用`Antd`？

`Antd`是一个新的UI库，它的特点是`组件丰富`和`主题定制`，可以提高性能，提高用户体验。

6. 为什么要使用`zustand`？

`zustand`是一个新的状态管理库，它的特点是`immer`和`dva`，方便使用，提高开发效率。

7. 为什么要使用`TS`？

`TS`是一个新的语言，它的特点是`类型检查`和`代码提示`，可以提高性能，提高用户体验。
