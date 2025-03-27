---
title: 1-路由封装
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 1
# group:
#   path: /design
#   title: 架构设计
#   order: 1
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

<!-- 目录结构定义、 -->

系统架构设计包含：路由封装、Axios请求封装、环境变量封装、storage模块封装(sessionStorage、localStorage)、公共函数封装(日期、金额、权限...)、通用交互定义(删除二次确认、列表、面包屑...)、接口全貌概览等。

已实现的[项目地址](https://github.com/frontzhm/auth-system)，如果需要接口，还需要运行[接口项目](https://github.com/frontzhm/auth-system-server)。

本文主要介绍系统架构设计之路由封装。

## 1 安装ReactRouter6

安装`ReactRouter6`，并封装路由。

```bash
pnpm add react-router-dom@6
```

## 2 路由配置，懒加载和Loading - src/router/index.tsx

新增`views`文件夹，用于存放页面组件，新增`Home/index.tsx`、`Login/index.tsx`、`Error403/index.tsx`、`Error404/index.tsx`页面组件。

```tsx
// src/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from '@/views/Home'
import { Spin } from 'antd'

/**
 *  路由懒加载
 * 1. 通过 React.lazy 方法配合 import() 函数来实现路由懒加载，优化首屏加载速度
 * 2. Suspense 组件用于在路由组件加载过程中显示 loading 界面,  fallback 属性来指定loading组件，
 *    当路由组件加载完成后，自动隐藏 loading 组件，显示路由组件，优化用户体验
 */
const Login = lazy(() => import('@/views/Login'))
const Error404 = lazy(() => import('@/views/Error404'))
const Error403 = lazy(() => import('@/views/Error403'))

const SuspenseView = (View: React.ComponentType) => {
  return (
    <Suspense fallback={<Spin fullscreen size='default' tip='页面正在加载...' />}>
      <View />
    </Suspense>
  )
}

const routes = [
  {
    path: '/',
    element: SuspenseView(Home),
  },
  {
    path: '/login',
    // element: <Login />,
    element: SuspenseView(Login),
  },
  {
    path: '/403',
    element: <Error403 />,
  },
  {
    path: '/404',
    element: <Error404 />,
  },
  {
    path: '*',
    // 跳转到 404 页面
    element: <Navigate to='/404' />,
  },
]

const router = createBrowserRouter(routes)
export default router
```

## 3 路由展示 - App.tsx

`Suspense`也可以在`App.tsx`中使用，这样可以全局使用`loading`组件，但个人建议在路由中使用，这样可以更好的控制`loading`组件的展示。

```tsx
// src/App.tsx
import router from '@/router'
import { RouterProvider } from 'react-router-dom'
// import { Suspense } from 'react'
// import { Spin } from 'antd'

function App() {
  return (
    <div className='App'>
      {/* <Suspense fallback={<Spin fullscreen size='default' tip='页面正在加载...' />}> */}
      <RouterProvider router={router} />
      {/* </Suspense> */}
    </div>
  )
}
export default App
```

## 4 额外备注

路由可以通过路由组件，也可以通过API创建路由。

API创建组件就是上面的方式，通过`createBrowserRouter`创建路由，然后通过`element`属性指定组件，在App.tsx中通过`RouterProvider`提供路由。

```tsx
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
const routes = [{ path: '/', element: <Home /> }]
const router = createBrowserRouter(routes)
export default router

// src/App.tsx
import router from '@/router'
import { RouterProvider } from 'react-router-dom'
function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}
export default App
```

路由组件的创建方式是通过`Route`组件，这种方式更加灵活，可以通过`children`属性传递子路由，可以通过`element`属性指定组件。

```tsx
// src/router/index.tsx
import { useRoutes } from 'react-router-dom'
const routes = [{ path: '/', element: <Home /> }]
// Router 组件
const Router = () => useRoutes(routes)
/* 这里的Router组件等同于下面的写法
  <Routes> 
    <Route path='/' element={<Home />} /> 
  </Routes>
*/
export default Router

// src/App.tsx
import Router from '@/router'
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  )
}
```

<!-- ### 1.3 路由封装 - 路由守卫

```tsx
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { useEffect } from 'react'

export const useAuth = () => {
  const navigate = useNavigate()
  const { state } = useStore()
  useEffect(() => {
    if (!state.user) {
      navigate('/login')
    }
  }, [state.user, navigate])
}
```
 -->
