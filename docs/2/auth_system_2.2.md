---
title: 2-Axios请求封装
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 2
# group:
#   path: /design/auth-system
#   title: Axios请求封装
#   order: 1
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

<!-- 目录结构定义、 -->

系统架构设计包含：路由封装、Axios请求封装、环境变量封装、storage模块封装(sessionStorage、localStorage)、公共函数封装(日期、金额、权限...)、通用交互定义(删除二次确认、列表、面包屑...)、接口全貌概览等。

本文主要介绍系统架构设计之Axios请求封装。

## 1 安装Axios

安装`Axios`，并封装请求。

```bash
pnpm add axios
```

## 2 请求封装 - src/utils/request.ts

```tsx
// src/utils/request.ts
import axios from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from '@/utils/loading'

// 创建 Axios 实例
export const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  timeoutErrorMessage: '请求超时，请稍后重试',
  withCredentials: true, // 跨域请求时是否需要使用凭证
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 显示加载状态
    showLoading()
    // 添加通用请求头，例如 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 请求错误时关闭加载状态
    hideLoading()
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 关闭加载状态
    hideLoading()
    return response.data // 直接返回响应数据，简化后续处理
  },
  (error) => {
    // 关闭加载状态
    hideLoading()

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请登录')
          break
        case 404:
          message.error('请求资源未找到')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error('请求失败，请稍后重试')
      }
    } else if (error.message.includes('timeout')) {
      message.error('请求超时，请稍后重试')
    } else {
      message.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  },
)

export default request
```

## 实现请求中加载效果 - src/utils/loading.ts

这边直接在`index.html`中添加loading效果。

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite + React + TS</title>
  <style>
    #loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #555;
    }
    #loading-icon {
      animation: rotate 1.5s linear infinite;
      margin-top: 5px;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="loading">
    <svg
      id="loading-icon"
      t="1739183770985"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4285"
      width="40"
      height="40"
    >
      <path
        d="M511.882596 287.998081h-0.361244a31.998984 31.998984 0 0 1-31.659415-31.977309v-0.361244c0-0.104761 0.115598-11.722364 0.115598-63.658399V96.000564a31.998984 31.998984 0 1 1 64.001581 0V192.001129c0 52.586273-0.111986 63.88237-0.119211 64.337537a32.002596 32.002596 0 0 1-31.977309 31.659415zM511.998194 959.99842a31.998984 31.998984 0 0 1-31.998984-31.998984v-96.379871c0-51.610915-0.111986-63.174332-0.115598-63.286318s0-0.242033 0-0.361243a31.998984 31.998984 0 0 1 63.997968-0.314283c0 0.455167 0.11921 11.711527 0.11921 64.034093v96.307622a31.998984 31.998984 0 0 1-32.002596 31.998984zM330.899406 363.021212a31.897836 31.897836 0 0 1-22.866739-9.612699c-0.075861-0.075861-8.207461-8.370021-44.931515-45.094076L195.198137 240.429485a31.998984 31.998984 0 0 1 45.256635-45.253022L308.336112 263.057803c37.182834 37.182834 45.090463 45.253022 45.41197 45.578141A31.998984 31.998984 0 0 1 330.899406 363.021212zM806.137421 838.11473a31.901448 31.901448 0 0 1-22.628318-9.374279L715.624151 760.859111c-36.724054-36.724054-45.018214-44.859267-45.097687-44.93874a31.998984 31.998984 0 0 1 44.77618-45.729864c0.32512 0.317895 8.395308 8.229136 45.578142 45.411969l67.88134 67.88134a31.998984 31.998984 0 0 1-22.624705 54.630914zM224.000113 838.11473a31.901448 31.901448 0 0 0 22.628317-9.374279l67.88134-67.88134c36.724054-36.724054 45.021826-44.859267 45.097688-44.93874a31.998984 31.998984 0 0 0-44.776181-45.729864c-0.32512 0.317895-8.395308 8.229136-45.578142 45.411969l-67.88134 67.884953a31.998984 31.998984 0 0 0 22.628318 54.627301zM255.948523 544.058589h-0.361244c-0.104761 0-11.722364-0.115598-63.658399-0.115598H95.942765a31.998984 31.998984 0 1 1 0-64.00158h95.996952c52.586273 0 63.88237 0.111986 64.337538 0.11921a31.998984 31.998984 0 0 1 31.659414 31.97731v0.361244a32.002596 32.002596 0 0 1-31.988146 31.659414zM767.939492 544.058589a32.002596 32.002596 0 0 1-31.995372-31.666639v-0.361244a31.998984 31.998984 0 0 1 31.659415-31.970085c0.455167 0 11.754876-0.11921 64.34115-0.11921h96.000564a31.998984 31.998984 0 0 1 0 64.00158H831.944685c-51.936034 0-63.553638 0.111986-63.665624 0.115598h-0.335957zM692.999446 363.0176a31.998984 31.998984 0 0 1-22.863126-54.381656c0.317895-0.32512 8.229136-8.395308 45.41197-45.578141l67.88134-67.884953A31.998984 31.998984 0 1 1 828.693489 240.429485l-67.892177 67.88134c-31.020013 31.023625-41.644196 41.759794-44.241539 44.393262l-0.697201 0.722488a31.908673 31.908673 0 0 1-22.863126 9.591025z"
        fill="#4096ff"
        p-id="4286"
      ></path>
    </svg>
    <div>加载中...</div>
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

然后在`utils/loading.ts`中添加显示和隐藏loading效果。

```tsx
// src/utils/loading.ts
let countIsRequesting = 0

const loading = document.querySelector('#loading')
export const showLoading = () => {
  countIsRequesting++
  if (loading instanceof HTMLElement) {
    loading.style.display = 'flex'
  }
}
export const hideLoading = () => {
  countIsRequesting--
  if (countIsRequesting === 0) {
    if (loading instanceof HTMLElement) {
      loading.style.display = 'none'
    }
  }
}
```

## 4 额外备注

请求拦截器和响应拦截器可以在`request.ts`中配置，也可以在`App.tsx`中配置。

```tsx
// src/App.tsx
import request from '@/utils/request'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

request.interceptors.request.use(
  (config) => {
    // 请求头添加token
    // config.headers['Authorization'] = 'Bearer ' + token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

function App() {
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <Suspense fallback={<Spin fullscreen size='default' tip='页面正在加载...' />}>
            <Router />
          </Suspense>
        </RouterProvider>
      </QueryClientProvider>
    </div>
  )
}
export default App
```
