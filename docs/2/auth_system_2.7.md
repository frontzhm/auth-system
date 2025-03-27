---
title: 7-菜单和路由的关联
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 7
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

本文主要介绍系统架构设计之菜单和页面的设计。

目前菜单和路由并没有直接关联，点击菜单并不会跳转到对应的页面，这个需要我们自己实现。

## 1.新建页面

我们在`SideMenu`组件里定义了菜单，这个菜单是一个递归的菜单，我们可以通过`menu`这个数组来定义菜单。

```tsx
const items = [
  {
    label: '工作台',
    icon: <DesktopOutlined />,
    key: '1',
  },
  {
    label: '系统管理',
    icon: <SettingOutlined />,
    key: '2',
    children: [
      {
        label: '用户管理',
        icon: <UserOutlined />,
        key: '2-1',
      },
      {
        label: '角色管理',
        icon: <VideoCameraOutlined />,
        key: '2-2',
      },
      {
        label: '菜单管理',
        icon: <UploadOutlined />,
        key: '2-3',
      },
    ],
  },
]
```

先建立各个页面的文件，然后在`SideMenu`里定义菜单，这样我们就可以在`SideMenu`里定义菜单。

views目录下建立`Dashboard`、`UserManage`、`RoleManage`、`MenuManage`四个文件夹，然后在这四个文件夹下建立`index.tsx`文件。大致内容如下，这里只是简单的定义了一个组件。

```tsx
// views/Dashboard/index.tsx
import React from 'react'

type DashBoardProps = {}
const DashBoard: React.FC<DashBoardProps> = () => {
  return <div>DashBoard</div>
}

DashBoard.displayName = 'DashBoard'
export default DashBoard
```

## 2.路由设计

去路由文件里定义路由，这里我们使用`ReactRouter7`，我们可以使用`lazy`和`Suspense`来实现路由懒加载。

```tsx
// src/router/index.ts

const DashBoard = lazy(() => import('@/views/Dashboard'))
const UserManage = lazy(() => import('@/views/UserManage'))
const RoleManage = lazy(() => import('@/views/RoleManage'))
const MenuManage = lazy(() => import('@/views/MenuManage'))

// ...
const routes = [
  // ...
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: SuspenseView(Home),
      },
      {
        path: '/dashboard',
        element: SuspenseView(DashBoard),
      },
      {
        path: '/role-manage',
        element: SuspenseView(RoleManage),
      },
      {
        path: '/user-manage',
        element: SuspenseView(UserManage),
      },
      {
        path: '/menu-manage',
        element: SuspenseView(MenuManage),
      },
    ],
  },
]
```

此时，切换页面的地址，页面会切换，但是点击菜单并不会切换页面。

## 3.菜单和路由的关联

### 3.1 路由改变时，菜单高亮

我们可以通过`useLocation`来获取当前的`pathname`，然后通过`useEffect`来监听`pathname`的变化，然后通过`setSelectedKeys`来设置菜单的高亮。这里的`key`是我们在菜单里定义的`key`，值是pathname的第一个路径。

```tsx
// src/components/SideMenu/index.tsx
const [selectedKeys, setSelectedKeys] = useState(['dashboard'])
const [openKeys, setOpenKeys] = useState<string[]>(['system-manage'])
// 获取路由
const { pathname } = useLocation()
useEffect(() => {
  // 路径改变时，设置选中的菜单项
  const key = pathname.split('/')[1]
  setSelectedKeys([key || 'dashboard'])
}, [pathname])

const items = [
  {
    label: '工作台',
    icon: <DesktopOutlined />,
    key: 'dashboard',
  },
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
      {
        label: '角色管理',
        icon: <VideoCameraOutlined />,
        key: 'role-manage',
      },
      {
        label: '菜单管理',
        icon: <UploadOutlined />,
        key: 'menu-manage',
      },
    ],
  },
]
const onOpenChange = (openKeys: string[]) => {
  setOpenKeys(openKeys)
}

;<Menu mode='inline' items={items} selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={onOpenChange} />
```

这样，当我们切换页面时，菜单会高亮。

### 3.2 点击菜单切换页面

在`Menu`组件里定义`onSelect`方法，当点击菜单时，调用`navigate`方法，切换页面。

```tsx
// src/components/SideMenu/index.tsx
const navigate = useNavigate()
const onClickMenu: MenuProps['onClick'] = ({ key }) => {
  navigate(`/${key}`)
}

;<Menu
  mode='inline'
  items={items}
  selectedKeys={selectedKeys}
  openKeys={openKeys}
  onOpenChange={onOpenChange}
  onClick={onClickMenu}
/>
```

这样，我们点击菜单时，页面会切换。

## 4.总结

本文主要介绍了菜单和路由的设计，菜单组件和路由组件是分开的，我们需要自己实现菜单和路由的关联。核心的连接点是`key`，我们在菜单里定义的`key`和路由里定义的`path`是一样的，通过这个`key`来实现菜单和路由的关联。
路由影响菜单：路由改变时，菜单高亮，可以通过`useLocation`来获取当前的`pathname`，也可以key，然后通过`useEffect`来监听`pathname`的变化，然后通过`setSelectedKeys`来设置菜单的高亮。
菜单影响路由：点击菜单切换页面，可以通过点击菜单获取`key`，然后通过`navigate`方法切换页面。

效果如下：![auth_page1.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_page1.gif)
