---
title: 终结篇之RBAC权限系统
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /rbac
  title: 权限系统RBAC模式
  order: 3
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

前面介绍了架构、页面的完成，这篇文章主要介绍权限系统的RBAC模式，也是这个系列的最后一篇文章。

## 什么是RBAC

RBAC（Role-Based Access Control，基于角色的访问控制）是一种访问控制的方法，它将权限授予角色，而不是直接授予用户。将用户与权限通过“角色”解耦。  
用户通过绑定角色（如管理员、普通用户）间接获得权限（如访问页面、操作按钮），而非直接分配权限。
典型结构‌就是，`用户 → 角色 → 权限`，角色作为权限分配的中间层，简化权限管理复杂度。

## RBAC的优势

1. **权限管理集中化**：权限集中管理，方便维护。
2. **权限可继承**：角色之间可以继承权限，减少权限管理的复杂度。
3. **权限可分配**：角色可以分配给用户，用户可以拥有多个角色。

## RBAC的实现

### 数据结构

RBAC的数据结构主要包括用户、角色、权限三个表，以及用户角色、角色权限两个关联表。

1. 用户表：用户信息，包括用户ID、用户名、密码等。

2. 角色表：角色信息，包括角色ID、角色名等。

3. 权限表：权限信息，包括权限ID、权限名等。

4. 用户角色表：用户与角色的关联表，包括用户ID、角色ID。

5. 角色权限表：角色与权限的关联表，包括角色ID、权限ID。

这里使用mock数据模拟用户、角色、权限数据，数据结构如下：

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password": "123456"
    },
    {
      "id": 2,
      "username": "user",
      "password": "123456"
    }
  ],
  "roles": [
    {
      "id": 1,
      "roleName": "admin"
    },
    {
      "id": 2,
      "roleName": "user"
    }
  ],
  "permissions": [
    {
      "id": 1,
      "name": "工作台",
      "authCode": "dashboard",
      "children": [
        {
          "parentId": 1,
          "id": 11,
          "name": "分析页",
          "authCode": "dashboard-analysis"
        },
        {
          "parentId": 1,
          "id": 12,
          "name": "监控页",
          "authCode": "dashboard-monitor"
        }
      ]
    },
    {
      "id": 2,
      "name": "用户管理",
      "authCode": "user-manage",
      "children": [
        {
          "parentId": 2,
          "id": 21,
          "name": "用户列表",
          "authCode": "user-list",
          "children": [
            {
              "parentId": 21,
              "id": 211,
              "name": "添加用户",
              "authCode": "btn@user-add"
            },
            {
              "parentId": 21,
              "id": 212,
              "name": "删除用户",
              "authCode": "btn@user-delete"
            }
          ]
        }
      ]
    }
  ],
  "userRoles": [
    {
      "userId": 1,
      "roleId": 1
    },
    {
      "userId": 2,
      "roleId": 2
    }
  ],
  "rolePermissions": [
    {
      "roleId": 1,
      "permissionIds": [1, 2]
    },
    {
      "roleId": 2,
      "permissionIds": [1, 2]
    }
  ]
}
```

### 实现思路

1. **获取用户信息和权限**：登录成功或者用token，获取用户信息、角色、权限。

2. **路由拦截**：根据用户角色，获取用户权限，根据权限判断是否有访问权限。

3. **菜单渲染**：根据用户权限，渲染菜单。

4. **按钮权限**：根据用户权限，控制按钮的显示。

## RBAC的实现

### 获取用户信息和权限

登录成功或者用token，获取用户信息、角色、权限。

拿当前项目来说，使用zustand管理全局状态，存储用户信息、角色、权限等。

`src/store/user.ts`设置用户信息。

```ts
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
  roles: [],
  permissions: [],
}

// 创建 store
export const useUserStore = create<IUserStore>((set) => ({
  // 用户初始化信息
  user: { ...userInit },
  // 设置用户信息
  setUser: (user) => set({ user }),
  // 重置用户信息，退出登录时使用
  resetUser: () => set({ user: userInit }),
  // 发送请求获取用户信息
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

然后在App组件中，获取用户信息。这个其实灵活使用啦，总之就是在很前面的地方获取用户信息。各种方式都可以。

```tsx
import { useUserStore } from '@/store/user'
const fetchUser = useUserStore((state) => state.fetchUser)
useEffect(() => {
  fetchUser()
}, [])
```

用户信息如下：

```ts
// 用户信息
{
  id: 1,
  username: '兰花花',
  roles: ['admin'],
  permissions: [
    {id: 1, menuName: '工作台', authCode: 'dashboard',menuType:1,path:'/dashboard',parentId:'',icon:'BarChartOutlined',
      children: [
        {id: 11, menuName: '分析页', authCode: 'dashboard-analysis',menuType:1,path:'/dashboard/analysis',parentId:1,icon:''},
        {id: 12, menuName: '监控页', authCode: 'dashboard-monitor',menuType:1,path:'/dashboard/monitor',parentId:1,icon:''}
      ]
    },
    {id: 2, menuName: '用户管理', authCode: 'user-manage',menuType:1,path:'/user',parentId:'',icon:'UserOutlined',
      children: [
        {id: 21, menuName: '用户列表', authCode: 'user-list',menuType:1,path:'/user/list',parentId:2,icon:'',
          children: [
            {id: 211, menuName: '添加用户', authCode: 'btn@user-add',menuType:2,path:'',parentId:21,icon:''},
            {id: 212, menuName: '删除用户', authCode: 'btn@user-delete',menuType:2,path:'',parentId:21,icon:''}
          ]
        }
      ]
    }

  ]
}

```

### 路由拦截

路由拦截，根据用户权限，判断是否有访问权限。也是不同的项目，不同的实现方式，这里是当前项目的实现方式。

先去`src/router/index.ts`中设置路由。这里主要在Layout组件中设置路由拦截。其他如果没有用Layout包裹的组件，也可以单独设置`<RequireAuth><XXXXX /></RequireAuth>`

```ts
import RequireAuth from '@/components/RequireAuth'
const routes = [{
    // element: <Layout />,
    element: ( <RequireAuth><Layout /></RequireAuth> ),
    children: []
    },
]
```

然后在`src/components/RequireAuth.tsx`中设置路由拦截。

- 检查用户信息是不是已经返回了，因为在 App.tsx 中已经调用了 fetchUser 方法，所以这里不需要再次调用
- 如果用户角色有 admin，直接返回，因为这里默认 admin 有所有权限，不需要再检查权限
- 检查权限（根据当前菜单路径，判断在不在 权限的路径里）

```tsx
// src/components/RequireAuth.tsx
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/user'

interface Props {
  children: React.ReactNode
}

const RequireAuth = ({ children }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    // 1. 检查用户信息是不是已经返回了，因为在 App.tsx 中已经调用了 fetchUser 方法，所以这里不需要再次调用
    // 没有这个判断，会导致在用户信息返回之前，就跳转到 403 页面
    if (!user?.name) {
      return
    }
    // 如果用户角色有 admin，直接返回，因为这里默认 admin 有所有权限，不需要再检查权限
    // 如果不是这样，可以根据实际情况，修改这里的逻辑，也可以去掉这个判断
    if (user.roles.includes('admin')) {
      return
    }

    // 2. 检查权限（根据当前菜单路径，来看下在不在权限的路径里）
    const permissions = user.permissions
    // 获取所有菜单路径
    const menuPaths: string[] = (() => {
      const paths: string[] = []
      // 递归查找所有菜单路径
      const findPaths = (menus: any[]) => {
        menus.forEach((menu) => {
          // 有 path 属性的，就是菜单路径
          menu.path && paths.push(menu.path)
          // 递归查找子菜单路径
          if (menu.children) {
            findPaths(menu.children)
          }
        })
      }
      findPaths(permissions)
      return paths
    })()
    // 如果当前路径不在菜单路径里，就跳转到 403 页面
    if (!menuPaths.includes(location.pathname)) {
      navigate('/403')
    }
  }, [user, navigate, location])
  // 3. 返回子组件
  return <>{children}</>
}

RequireAuth.displayName = 'RequireAuth'

export default RequireAuth
```

### 菜单渲染

根据用户权限，渲染菜单。
说白了就是根据用户权限，生成符合用户权限的菜单。  
再说白了就是接口返回的菜单数据结构，改成符合菜单组件的数据结构。

接口返回的结构：

```ts
// 用户信息
const c = [
  {
    id: 2,
    menuName: '系统管理',
    authCode: 'system-manage',
    menuType: 1,
    path: '',
    parentId: '',
    icon: 'UserOutlined',
    children: [
      {
        id: 21,
        menuName: '用户管理',
        authCode: 'user-manage',
        menuType: 1,
        path: '/user-manage',
        parentId: 2,
        icon: '',
        children: [
          { id: 211, authCode: 'user-manage@add', menuType: 2, parentId: 21, icon: '' },
          {
            id: 212,
            authCode: 'user-manage@delete',
            menuType: 2,
            parentId: 21,
          },
        ],
      },
    ],
  },
]
```

菜单组件Item的结构：

```js
{
  label: '系统管理',
  icon: <SettingOutlined />,
  key: 'system-manage',
  children: [
    {
      label: '用户管理',
      icon: <UserOutlined />,
      key: 'user-manage',
    },
  ]
}
```

- 过滤menuType为1的项
- 映射字段：menuName→label，authCode→key，icon字符串→图标组件
- 递归处理子项，同样应用过滤和映射

```tsx
// src/components/SiderMenu/tranformMenu.ts
import * as Icon from '@ant-design/icons'
import React from 'react'
import type { MenuProps } from 'antd'

type IPermission = {
  id: string
  menuName?: string
  menuType: number
  path?: string
  children?: IPermission[]
  icon?: string
}
type MenuItem = Required<MenuProps>['items'][number]
/**
 * 转换菜单结构
 * @param originalMenu 原始菜单数据
 * @returns 转换后的菜单结构
 */
export const transformPermissionsToMenus = (originalMenu: IPermission[]): MenuItem[] => {
  const MENU = 1
  return originalMenu
    .filter((item) => item.menuType === MENU) // 只处理 menuType=1 的菜单项
    .map((item: any) => {
      // 判断是否有子菜单，如果有则递归处理
      const hasChildren =
        item.children && item.children.length && item.children.some((child: any) => child.menuType === MENU)
      const icon = item.icon ? (Icon as any)[item.icon] : null
      return {
        label: item.menuName,
        key: item.authCode,
        icon: icon ? React.createElement(icon) : null, // 转换为图标组件
        ...(hasChildren && { children: transformPermissionsToMenus(item.children) }),
      }
    })
}
```

然后在`src/components/SiderMenu/index.tsx`中使用。

```tsx
// src/components/SiderMenu/index.tsx
import { useUserStore } from '@/store/user'
import { transformPermissionsToMenus } from './tranformMenu'
// ....
const user = useUserStore((state) => state.user)
const items = useMemo(() => {
  return transformPermissionsToMenus(user.permissions)
}, [user])
```

### 按钮权限

根据用户权限，控制按钮的显示。

先根据返回的权限列表，生成一个映射，key是路径，value是按钮的权限标识列表。

```ts
import { create } from 'zustand'
import { apiGetUser, type IUserInfo, type IPermission } from '@/service/user'

// ....跟之前一样
// 初始状态
const userInit: IUserInfo = {
  name: '',
  email: '',
  roles: [],
  permissions: [],
  pathToButtonsMap: {},
}

// 创建 store
export const useUserStore = create<IUserStore>((set) => ({
  // ...
  fetchUser: async () => {
    try {
      const res = await apiGetUser()
      console.log('fetchUser:', res)
      // 将菜单数据转换为路径-按钮权限码的映射
      res.pathToButtonsMap = convertMenuToButtonMap(res.permissions)
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

/**
 * 将菜单数据转换为路径-按钮权限码的映射
 * @param menuList 原始菜单数据
 * @returns 形如 { '/user-manage': ['user-manage@add', 'user-manage@delete'] } 的映射
 */
function convertMenuToButtonMap(menuList: IPermission[]): Record<string, string[]> {
  // Step 1: 构建 ID -> 有效路径的映射表
  const idToPathMap: Record<number | string, string> = {}

  const buildIdToPath = (items: IPermission[]) => {
    items.forEach((item) => {
      // 只处理菜单项（menuType=1）且路径有效的情况
      if (item.menuType === 1 && item.path && item.path.trim() !== '') {
        idToPathMap[item.id] = item.path
      }
      // 递归处理子菜单
      if (item.children) buildIdToPath(item.children)
    })
  }

  // Step 2: 收集按钮权限码到对应路径下
  const pathToButtonsMap: Record<string, string[]> = {}

  const collectButtons = (items: IPermission[]) => {
    items.forEach((item) => {
      if (item.menuType === 2) {
        // 查找按钮的父级路径
        const parentPath = idToPathMap[item.parentId!]
        if (parentPath) {
          // 将按钮权限码添加到对应路径下，如果路径不存在则创建
          if (!pathToButtonsMap[parentPath]) pathToButtonsMap[parentPath] = []
          pathToButtonsMap[parentPath].push(item.authCode)
        }
      }
      // 递归处理子菜单
      if (item.children) collectButtons(item.children)
    })
  }

  // 执行转换
  buildIdToPath(menuList)
  collectButtons(menuList)
  return pathToButtonsMap
}
```

然后将一个`AuthButton`组件，根据路径和按钮权限，控制按钮的显示。

- 如果没有`authCode`属性，则跟普通按钮一样展示
- 如果有`authCode`属性，那么根据用户拥有的按钮权限列表有没有该`authCode`属性来展示或者隐藏按钮

```tsx
// src/components/AuthButton/index.tsx
/**
 * AuthButton
 * @description 该组件用于权限按钮的展示主要通过是authCode属性实现，
 * 如果没有authCode属性则跟普通按钮一样展示，如果有authCode属性，那么根据用户拥有的按钮权限列表有没有该authCode属性来展示或者隐藏按钮
 * @param {string} authCode - 权限标识
 * @param {React.ReactNode} children - 按钮内容
 * @returns {React.FunctionComponent}
 * @example
 * import AuthButton from '@/components/AuthButton'
 * <AuthButton>查看</AuthButton> 这个按钮不受权限控制,就是一个Button
 * <AuthButton authCode="user@add">添加用户</AuthButton> 这个按钮需要用户拥有user@add权限才能看到
 * @version 1.0.0
 */
import { Button } from 'antd'
import React from 'react'
import { useUserStore } from '@/store/user'

type AuthButtonProps = {
  auth?: string
  [key: string]: any
}
const AuthButton: React.FC<AuthButtonProps> = ({ authCode, ...otherProps }) => {
  if (!authCode) return <Button {...otherProps} />
  const user = useUserStore((state) => state.user)
  // 获取用户按钮权限列表
  const buttonAuthCodes = user.pathToButtonsMap ? [window.location.pathname] : []
  if (buttonAuthCodes.includes(authCode)) {
    return <Button {...otherProps} />
  }
  return null
}

AuthButton.displayName = 'AuthButton'
export default AuthButton
```

## 举例使用RBAC

现在新建一个页面，比如`src/pages/OrderManage/index.tsx`。

- 去`菜单管理`页面中添加一个菜单，菜单名为`订单管理`，路径为`/order-manage`，建完之后，在其基础上，添加子权限，设置为按钮权限，权限码为`order-manage@add`和`order-manage@delete`。
- 去`角色管理`页面中，如果需要特定的角色拥有`订单管理`的权限，就给这个角色添加`订单管理`的权限。或者添加一个订单管理员的角色，给这个角色添加`订单管理`的权限。
- 去`用户管理`页面中，给特定用户添加角色。
- 去路由中添加`/order-manage`的路由，这个路由会被`RequireAuth`组件拦截，根据用户权限，自动判断是否有访问权限。

页面里使用`AuthButton`组件，根据权限码，控制按钮的显示。

```tsx
// src/pages/OrderManage/index.tsx
import AuthButton from '@/components/AuthButton'
const OrderManage = () => {
  return (
    <div>
      <AuthButton authCode='order-manage@add'>添加订单</AuthButton>
      <AuthButton
        authCode='order-manage@delete'
        onClick={() => {
          console.log('删除订单')
        }}
      >
        删除订单
      </AuthButton>
    </div>
  )
}
export default OrderManage
```

## 总结

本篇文章介绍了RBAC权限系统的实现，通过用户、角色、权限三个表，以及用户角色、角色权限两个关联表，实现了权限管理。
通过登录、路由拦截、菜单渲染、按钮权限等功能，实现了RBAC权限系统。

这个系列文章介绍了从零搭建一个后台系统，包括登录、权限、菜单、用户、角色等功能，希望对大家有所帮助。
