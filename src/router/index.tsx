import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from '@/views/Home'
import { Spin } from 'antd'
import Layout from '@/layout'

/**
 *  路由懒加载
 * 1. 通过 React.lazy 方法配合 import() 函数来实现路由懒加载，优化首屏加载速度
 * 2. Suspense 组件用于在路由组件加载过程中显示 loading 界面,  fallback 属性来指定loading组件，
 *    当路由组件加载完成后，自动隐藏 loading 组件，显示路由组件，优化用户体验
 */
const Login = lazy(() => import('@/views/Login'))
const Test = lazy(() => import('@/views/Test'))
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
  // {
  //   path: '/',
  //   element: SuspenseView(Home),
  // },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: SuspenseView(Home),
      },
    ],
  },
  {
    path: '/login',
    // element: <Login />,
    element: SuspenseView(Login),
  },
  {
    path: '/test',
    // element: <Login />,
    element: SuspenseView(Test),
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
