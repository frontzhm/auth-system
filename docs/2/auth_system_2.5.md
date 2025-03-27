---
title: 5-公共布局Layout
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 5
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

本文主要介绍系统架构设计之公共布局Layout。

### 1. 建Layout组件

后台页面左边是菜单，右边是内容，这样的布局是比较常见的，我们可以将这样的布局封装成一个组件，这样在其他页面中就可以直接使用这个组件。
这边使用`Antd`的[`Layout`组件](https://ant-design.antgroup.com/components/layout-cn#layout-demo-custom-trigger)。

按照@ant-design/icons

```shell
pnpm install @ant-design/icons
```

新建`src/layout/index.tsx`组件，注意引入`Outlet`组件，这个组件是`react-router-dom`提供的，用于渲染子路由。

```tsx
// src/layout/index.tsx
import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import { Outlet } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const CusLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default CusLayout
```

## 2.使用Layout组件

在`src/router/index.ts`中配置路由，让`Layout`组件显示在`/`路径下。

```tsx
// src/router/index.ts

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
```

## 3. 加水印

在`Layout`组件中加[水印组件](https://ant-design.antgroup.com/components/watermark-cn)，这样就可以在每个页面上显示水印。

```tsx
// src/layout/index.tsx
<Watermark content='Watermark'>
  <Outlet />
</Watermark>
```

![water_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/water_1.png)

### 水印原理简述

水印的原理是有一个元素，绝对定位，图片平铺，这样就可以显示出水印效果。

```css
.watermark {
  z-index: 9;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-repeat: repeat;
  background-position: 0px 0px;
  background-image: url(...);
  background-size: 368px;
  visibility: visible !important;
}
```

`pointer-events: none;`，这个属性可以让元素不响应鼠标事件，这样就不会影响页面的交互。
有意思的是，如果审查元素，右击删除水印元素的话，根本删除不了。因为使用了MutationObserver监听元素的变化，如果水印元素被删除，就会重新创建水印元素。

以下以Home组件为例，给Home组件的其中一个元素加上ref，然后使用MutationObserver监听元素的变化，如果元素被删除，就重新创建元素。这样就可以保证元素一直存在。

```tsx
// src/views/Home/index.tsx
import React from 'react'
import style from './index.module.less'
import { Button, theme } from 'antd'
import { useEffect, useRef } from 'react'

const { useToken } = theme

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) {
      return
    }
    // 获取 contentRef 的父节点
    const parent = contentRef.current?.parentElement
    // 创建一个观察者实例
    // 当 MutationObserver 检测到 childList 变化时，它会检查 contentRef.current 是否仍然存在于 document.body 中。如果不存在，说明该元素被删除了，于是我们重新将其添加到 document.body 中。
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 检查 contentRef 是否被删除
          if (!document.body.contains(contentRef.current)) {
            // 如果被删除，重新添加,=，添加到第一个子节点
            parent.insertBefore(contentRef.current, parent.firstChild)
          }
        }
      }
    })

    // 开始观察 body 的子节点变化
    observer.observe(document.body, { childList: true, subtree: true })

    // 清理 observer
    return () => {
      observer.disconnect()
    }
  }, [])
  const { token } = useToken()
  return (
    <div className={style['page-home']}>
      <h1 className={style.title} ref={contentRef}>
        Home
      </h1>
      <p
        style={{
          backgroundColor: token.colorPrimaryBg,
          padding: token.padding,
          borderRadius: token.borderRadius,
          color: token.colorPrimaryText,
          fontSize: token.fontSize,
        }}
        className={style.content}
      >
        This is the home page.
      </p>
      <Button type='primary'>按钮</Button>
    </div>
  )
}

Home.displayName = 'Home'
export default Home
```

## 4.写NavHeader组件

头部导航大约这样：

![navheader_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/navheader_1.png)

其实就是左右布局，左边是收缩菜单和面包屑，右边是主题色切换和用户信息及退出。  
首先把`Layout/index.tsx`的`Header`换成`NavHeader`组件。

```tsx
// src/layout/index.tsx
<Layout>
  <NavHeader />
  <Watermark content='Watermark'>{/* 不变 */}</Watermark>
</Layout>
```

添加`NavHeader`组件

```tsx
// src/layout/NavHeader/index.tsx
import React from 'react'
import { useState } from 'react'
import { Breadcrumb, Dropdown, Switch } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import style from './index.module.less'
import { DownOutlined } from '@ant-design/icons'
import { Space } from 'antd'

type NavHeaderProps = {}
const NavHeader: React.FC<NavHeaderProps> = () => {
  const [items, setItems] = useState([
    {
      title: 'Home',
    },
    {
      title: '工作台',
    },
  ])
  const menuItems: MenuProps['items'] = [
    {
      label: `邮箱：Jack@x.cn`,
      key: '0',
    },
    {
      label: '退出登录',
      key: '1',
    },
  ]

  return (
    <div className={style.header}>
      <div className={style.left}>
        <Breadcrumb className={style.breadcrumb} items={items} />
      </div>
      <div className={style.right}>
        <Switch
          checkedChildren='默认'
          unCheckedChildren='暗黑'
          defaultChecked
          onChange={(checked) => {
            console.log(`switch to ${checked ? 'dark' : 'light'}`)
          }}
        />
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <a className={style.dropMenu} onClick={(e) => e.preventDefault()}>
            <Space>
              Jack
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  )
}

NavHeader.displayName = 'NavHeader'
export default NavHeader
```

然后加个样式

```less
// src/layout/NavHeader/index.module.less
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  height: 40px;
  .left {
    display: flex;
    align-items: center;
    .breadcrumb {
      margin-left: 20px;
    }
  }
  .right {
    display: flex;
    align-items: center;

    .dropMenu {
      margin-left: 20px;
      color: #333;
    }
  }
}
```

`Footer`组件后台系统一般不需要，这边就不写了。

## 5.写左侧菜单SideMenu组件

官网菜单组件[Menu](https://ant-design.antgroup.com/components/menu-cn)。

```tsx
<Layout>
  <SideMenu />
  <Layout>{/* .. */}</Layout>
</Layout>
```

侧边组件

```tsx
// src/layout/SideMenu/index.tsx
import React, { Children } from 'react'
import { Layout } from 'antd'
import { Menu, theme } from 'antd'
import { UserOutlined, VideoCameraOutlined, UploadOutlined, DesktopOutlined, SettingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import style from './index.module.less'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

type SideMenuProps = {}
const SideMenu: React.FC<SideMenuProps> = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken()
  const { Sider } = Layout
  const [collapsed, setCollapsed] = useState(false)
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
          label: '权限管理',
          icon: <UploadOutlined />,
          key: '2-3',
        },
      ],
    },
  ]

  return (
    <Sider className={style.sideMenu} trigger={null} collapsible collapsed={collapsed}>
      <div className={style.sideBox}>
        <div>
          <div className={style.logo}>
            <img src='https://uac.test.xdf.cn/static/logo.dbb35e10.svg' alt='logo' />
          </div>
          <Menu mode='inline' defaultSelectedKeys={['1']} items={items} />
        </div>
        <div
          onClick={() => {
            setCollapsed(!collapsed)
          }}
          className={style.footer}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </Sider>
  )
}

SideMenu.displayName = 'SideMenu'
export default SideMenu
```

样式

```less
// src/layout/SideMenu/index.module.less
.sideMenu {
  background-color: #fff !important;
  box-sizing: border-box;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  .sideBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 14px);
  }
  .logo {
    height: 32px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 100%;
      margin-right: 10px;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 16px;
    padding-left: 20px;
    cursor: pointer;
  }
}
```

## 6. 撑开Content组件的高度

Content组件的高度撑开，这样页面不局促。

```tsx
// src/layout/index.tsx
<Content
  style={{
    margin: 15,
    padding: 20,
    minHeight: 'calc(100vh - 90px)',
    background: colorBgContainer,
    borderRadius: borderRadiusLG,
  }}
>
  <Outlet />
</Content>
```

## 7.写首页

首页就是一个简单的页面，用来展示一些信息。

```tsx
// src/views/Home/index.tsx
import React from 'react'

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  return (
    <div className='ant-card-body'>
      <h1>
        欢迎使用
        <span role='img' aria-label='smile' className='anticon anticon-smile'>
          <svg
            viewBox='64 64 896 896'
            focusable='false'
            data-icon='smile'
            width='1em'
            height='1em'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'
              fill='#1890ff'
            ></path>
            <path
              d='M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zM288 421a48.01 48.01 0 0196 0 48.01 48.01 0 01-96 0zm224 272c-85.5 0-155.6-67.3-160-151.6a8 8 0 018-8.4h48.1c4.2 0 7.8 3.2 8.1 7.4C420 589.9 461.5 629 512 629s92.1-39.1 95.8-88.6c.3-4.2 3.9-7.4 8.1-7.4H664a8 8 0 018 8.4C667.6 625.7 597.5 693 512 693zm176-224a48.01 48.01 0 010-96 48.01 48.01 0 010 96z'
              fill='#e6f7ff'
            ></path>
            <path
              d='M288 421a48 48 0 1096 0 48 48 0 10-96 0zm376 112h-48.1c-4.2 0-7.8 3.2-8.1 7.4-3.7 49.5-45.3 88.6-95.8 88.6s-92-39.1-95.8-88.6c-.3-4.2-3.9-7.4-8.1-7.4H360a8 8 0 00-8 8.4c4.4 84.3 74.5 151.6 160 151.6s155.6-67.3 160-151.6a8 8 0 00-8-8.4zm-24-112a48 48 0 1096 0 48 48 0 10-96 0z'
              fill='#1890ff'
            ></path>
          </svg>
        </span>
      </h1>
      <p>
        希望你昨天，今天，明天都有一个好心情！
        <span role='img' aria-label='heart' className='anticon anticon-heart'>
          <svg
            viewBox='64 64 896 896'
            focusable='false'
            data-icon='heart'
            width='1em'
            height='1em'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              d='M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z'
              fill='#eb2f96'
            ></path>
            <path
              d='M679.7 201c-73.1 0-136.5 40.8-167.7 100.4C480.8 241.8 417.4 201 344.3 201c-104 0-188.3 82.6-188.3 184.5 0 201.2 356 429.3 356 429.3s356-228.1 356-429.3C868 283.6 783.7 201 679.7 201z'
              fill='#fff0f6'
            ></path>
          </svg>
        </span>
      </p>
      <p>
        点击左侧的菜单，快使用起来吧！
        <span role='img' aria-label='check-circle' className='anticon anticon-check-circle'>
          <svg
            viewBox='64 64 896 896'
            focusable='false'
            data-icon='check-circle'
            width='1em'
            height='1em'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'
              fill='#52c41a'
            ></path>
            <path
              d='M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm193.4 225.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.3 0 19.9 5 25.9 13.3l71.2 98.8 157.2-218c6-8.4 15.7-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.4 12.7z'
              fill='#f6ffed'
            ></path>
            <path
              d='M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z'
              fill='#52c41a'
            ></path>
          </svg>
        </span>
      </p>
      <div className='ant-space ant-space-horizontal ant-space-align-center'>
        <div className='ant-space-item'>
          <div className='ant-image ant-image-error'>
            <img className='ant-image-img' src='' />
          </div>
        </div>
      </div>
    </div>
  )
}

Home.displayName = 'Home'
export default Home
```

![auth_system1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_system1.png)
