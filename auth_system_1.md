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
# pnpm install react-router react-router-dom@next zustand antd
```
