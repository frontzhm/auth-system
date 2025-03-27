---
title: 3-环境变量封装
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 3
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

<!-- 目录结构定义、 -->

系统架构设计包含：路由封装、Axios请求封装、环境变量封装、storage模块封装(sessionStorage、localStorage)、公共函数封装(日期、金额、权限...)、通用交互定义(删除二次确认、列表、面包屑...)、接口全貌概览等。

本文主要介绍系统架构设计之环境变量封装。

常用的两种配置环境的方式，一种是编译时确定环境变量，一种是运行时确定环境变量。运行时，就是访问页面的时候，根据不同的环境变量，显示不同内容。编译时，就是在编译的时候，根据不同的环境变量，生成不同的代码。

## 1 编译时确定环境变量

编译时确定环境变量，主要是通过env文件配置环境变量，然后在代码中使用环境变量。

项目根目录下新建`.env.dev`文件，配置环境变量，这里的dev可以理解`local`但local容易被忽略这边使用dev。

```bash
VITE_BASE_URL=http://localhost:3000
```

项目根目录下新建`.env.test`文件，配置环境变量。

```bash
VITE_BASE_URL=http://test.com
```

项目根目录下新建`.env.prod`文件，配置环境变量。

```bash
VITE_BASE_URL=http://prod.com
```

然后在`package.json`配置相应的命令

```json
{
  "scripts": {
    "dev": "pnpm dev:dev",
    "dev:dev": "vite --mode dev",
    "dev:test": "vite --mode test",
    "dev:prod": "vite --mode prod",
    "build:test": "vite build",
    "build:prod": "vite build",
    "serve": "vite preview"
  }
}
```

启动的时候，根据不同的命令，加载不同的环境变量。默认本地开发的时候，加载`.env.local`文件。

在`request.ts`文件，使用环境变量。

```tsx
// src/utils/request.ts
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 10000,
})
```

这里，如果想访问正式环境的接口，只需要执行`npm run dev:prod`命令，就可以访问正式环境的接口。

测试环境的打包，只需要执行`npm run build:test`命令，就可以打包测试环境的代码。
正式环境的打包，只需要执行`npm run build:prod`命令，就可以打包正式环境的代码。

## 2 运行时确定环境变量

运行时确定环境变量，主要是根据访问的地址，来确定环境，从而设置不同的环境变量。

一般新建`config/index.ts`文件，根据不同的环境，设置不同的环境变量。

```js
const configMap = {
  dev: {
    baseURL: 'http://localhost:3000',
  },
  test: {
    baseURL: 'http://test.api.example.com',
  },
  prod: {
    baseURL: 'http://api.example.com',
  },
}

const env = (() => {
  const href = window.location.href
  if (href.includes('localhost')) {
    return 'dev'
  }
  if (href.includes('test')) {
    return 'test'
  }
  return 'prod'
})()

const config = configMap[env]

export default config
```

在`request.ts`文件，使用环境变量。

```tsx
// src/utils/request.ts
import axios from 'axios'
import config from '@/config'

const request = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
})
```

这样，就可以根据访问的地址，来确定环境，从而设置不同的环境变量。
当然，这种方式，需要注意的是，如果是本地开发，需要访问正式环境的接口，就需要手动修改`config/index.ts`，将config的值设置为正式环境的值`config=configMap.prod`即可。

## 3 总结

编译时确定环境变量，主要是通过env文件配置环境变量，然后在代码中使用环境变量。
运行时确定环境变量，主要是根据访问的地址，来确定环境，从而设置不同的环境变量。

这两种方式，在各个公司中，都有使用，根据实际情况，选择合适的方式即可。我个人比较喜欢编译时确定环境变量，这样可以根据不同的命令，加载不同的环境变量，方便开发和部署。
