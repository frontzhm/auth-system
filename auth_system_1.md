---
title: 后台系统从零搭建（一）—— 框架
tags: vue
categories: vue
theme: vue-pro
highlight:
---


本系列从零搭建一个后台系统，使用`Vite + React + React-router6 + zustand + Antd`。
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
## 3. 配置@指向src目录

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
`