---
title: 6-zustand状态管理
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 6
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

本文主要介绍系统架构设计之zustand状态管理。

[Zustand](https://zustand-demo.pmnd.rs/)适合中小型项目或需要轻量级状态管理的场景， 其核心特点：

- 轻量级：API 简单，学习成本低。
- 高性能：支持选择性订阅，避免不必要的渲染。
- 灵活：支持异步操作、持久化、DevTools 等。

## 1.安装zustand

```shell
pnpm install zustand
```

## 2.创建store

在`src/store`目录下创建`user.ts`文件，用于存储用户信息。

```ts
// src/store/user.ts
import { create } from 'zustand'
import { apiGetUser, type IUserInfo } from '@/service/user'

type IUserState = {
  user: IUserInfo
}
type IUserAction = {
  setUser: (user: IUserInfo) => void
  resetUser: () => void
  fetchUser: () => Promise<void>
}
type IUserStore = IUserState & IUserAction

// 初始状态
const userInit: IUserInfo = {
  name: '',
  email: '',
}

// 创建 store
export const useUserStore = create<IUserStore>((set) => ({
  user: { ...userInit },
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: userInit }),
  fetchUser: async () => {
    try {
      const res = await apiGetUser()
      set({ user: res })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  },
}))

/**
 * 使用的时候
 * import { useUserStore } from '@/store/user'
 * import { shallow } from 'zustand/shallow'
 * // 只订阅 user 状态
 * const user = useUserStore((state) => state.user)
 * // 只订阅 setUser 方法
 * const setUser = useUserStore((state) => state.setUser)
 * // 订阅多个状态，使用 shallow 避免不必要的重渲染
 * const { user, setUser } = useUserStore((state) => ({
 *   user: state.user,
 *   setUser: state.setUser,
 * }))
 * // 订阅所有状态
 * const state = useUserStore()
 */
```

用户信息的api，因为是全局的所以放在`src/service/user.ts`中。

```ts
import request from '@/utils/request'

export type IUserInfo = {
  id?: number
  name: string
  email: string
  role?: string
  _id?: string
  deptId?: string
  state?: number
  roleList?: string[]
  createId?: string
  deptName?: string
  mobile?: string
  job?: string
  avatar?: string
  introduction?: string
  username?: string
}

export const apiGetUser = (): Promise<IUserInfo> => {
  return request.get('/api/userInfo')
}
export default {
  apiGetUser,
}
```

## 3.获取用户信息，保存在store中

项目启动的时候，获取用户信息，保存在store中。

这边在App.tsx中获取用户信息。

```tsx
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const fetchUser = useUserStore((state) => state.fetchUser)
    fetchUser()
  }, [])
  // ...
}
```

## 4.使用用户信息

在`NavHeader`组件中使用用户信息。

```tsx
// src/layout/NavHeader/index.tsx
import { useUserStore } from '@/store/user'
import { shallow } from 'zustand/shallow'
// ...
const user = useUserStore((state) => state.user)
const resetUser = useUserStore((state) => state.resetUser)
const menuItems: MenuProps['items'] = [
  {
    label: '退出登录',
    key: '1',
    onClick: () => {
      resetUser()
      localStorage.setItem('token', '')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    },
  },
]
// 下面的name和email就是替换成用户信息
```

![auth_page2.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_page2.gif)

<!--
### 为何使用shalllow

shallow 会对对象或数组进行浅比较，即只比较对象的第一层属性或数组的第一层元素。如果第一层属性或元素没有变化，即使引用发生变化，shallow 也会认为状态没有变化，从而避免组件的重渲染。
在上面的例子中，如果 user 对象的属性没有变化，即使 user 的引用发生变化，组件也不会重渲染。

shallow 的源码实现非常简单，它会对两个对象进行浅比较：

```ts
import { is } from 'zustand/shallow'

const shallow = <T extends object>(objA: T, objB: T): boolean => {
  if (Object.is(objA, objB)) return true // 如果是同一个引用，直接返回 true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }
  return true
}
```

什么场景使用：

1. 订阅多个状态：当你需要订阅多个状态时，使用 shallow 可以避免不必要的重渲染。

```ts
const { user, setUser } = useUserStore(
  (state) => ({
    user: state.user,
    setUser: state.setUser,
  }),
  shallow,
)
```

2. 避免对象引用变化导致的渲染： 如果状态是一个对象或数组，且你只关心其内容是否变化，而不是引用是否变化，可以使用 shallow。

```ts
const user = useUserStore((state) => state.user, shallow)
``` -->
