---
title: 4-CSSModule、主题、登录页
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /design
  title: 架构设计
  order: 4
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

<!-- 目录结构定义、 -->

本文主要介绍系统架构设计之CSSModule、主题、登录页。

## 开启CSSModule

CSSModule是一种CSS模块化的解决方案，它可以让我们在不同的模块中使用相同的类名，而不会相互影响。这边将CSSModule集成到项目中，以便于我们在项目中使用。

React默认支持CSSModule，样式表只需要以`.module.css/less/sass`命名。为了方便使用嵌套样式，这边我们使用`less`作为样式表的解决方案，

安装依赖：

```bash
pnpm install less -D
```

以`Home`组件为例，我们可以给`Home`组件的样式文件`index.module.less`添加样式：

```less
// src/pages/Home/index.module.less
.page-home {
  .title {
    font-size: 24px;
    color: #333;
  }
  .content {
    font-size: 16px;
    color: #f69;
  }
  // 类名前加 :global 表示类名不会被 css module 处理
  :global {
    .ant-btn {
      background-color: #f69;
      color: #fff;
    }
  }
}
```

然后在`Home`组件中引入样式：

```tsx
// src/views/Home/index.tsx
import React from 'react'
import style from './index.module.less'
import { Button } from 'antd'

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  return (
    <div className={style['page-home']}>
      <h1 className={style.title}>Home</h1>
      <p className={style.content}>This is the home page.</p>
      <Button>按钮</Button>
    </div>
  )
}

Home.displayName = 'Home'
export default Home
```

![css_module1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/css_module1.png)，本质就是给类名添加了一个哈希值，这样就不会相互影响了。

注意类名必须一致，在`Home`组件中使用`style['page-home']`和`style.title`来引用样式。

如果不希望类名被CSSModule处理，可以在类名前加`:global`。

```less
:global {
  .ant-btn {
    background-color: #f69;
    color: #fff;
  }
}
```

## 主题色设置

Antd提供了一种主题色的设置方式，[官网说明](https://ant-design.antgroup.com/docs/react/customize-theme-cn)。

### 设置主题色

在App.tsx中增加主题色设置：

```tsx
// src/App.tsx
import router from '@/router'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#24be91',
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  )
}
export default App
```

将App组件包裹在`ConfigProvider`中，设置`theme`属性，`colorPrimary`为主题色。

将Home组件中的Button样式去掉，设置type属性为primary，这样就会使用主题色。

如果想特定修改组件变量，如下设置

```tsx
theme={{
  components: {
    Button: {
      colorPrimary: '#00b96b',
    },
    Input: {
      colorPrimary: '#eb2f96',
    }
  },
}}
```

如果用当前主题下的一些样式值，可以使用`useToken`来获取，用Home示例下

```tsx
// src/views/Home/index.tsx
import React from 'react'
import style from './index.module.less'
import { Button, theme } from 'antd'

const { useToken } = theme

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  const { token } = useToken()
  return (
    <div className={style['page-home']}>
      <h1 className={style.title}>Home</h1>
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

![css_module2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/css_module2.png)

## 设置中文

在App.tsx中设置中文

```tsx
// src/App.tsx
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import zhCN from 'antd/lib/locale/zh_CN'

function App() {
  return (
    <div className='App'>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#24be91',
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  )
}
export default App
```

## 登录

### 登录页

直接使用`Antd`的[`Form`](https://ant-design.antgroup.com/components/form-cn)

```tsx
// src/views/Login/index.tsx

import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'

type FieldType = {
  username?: string
  password?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const Login: React.FC = () => (
  <Form
    name='basic'
    labelAlign='right'
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600, marginTop: 50 }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete='off'
  >
    <Form.Item<FieldType> label='用户名' name='username' rules={[{ required: true, message: '请输入用户名!' }]}>
      <Input />
    </Form.Item>

    <Form.Item<FieldType> label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
      <Input.Password />
    </Form.Item>

    <Form.Item label={null}>
      <Button type='primary' htmlType='submit'>
        登陆
      </Button>
    </Form.Item>
  </Form>
)

export default Login
```

![login_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/login_1.png)

### 登录接口

在Login/service.ts中定义登录接口

```ts
import request from '@/utils/request'

export const apiLogin = (data: { username?: string; password?: string }): Promise<string> => {
  return request.post('/api/login', data).then((res) => res.data.token)
}
export default { apiLogin }
```

在页面上使用

```tsx
import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message } from 'antd'
import api from './service'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  username?: string
  password?: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const token = await api.apiLogin(values)
    // 登陆成功后将 token 存储到 localStorage
    localStorage.setItem('token', token)
    // 提示登陆成功
    message.success('登陆成功')
    // callback 用于登陆成功后跳转到之前的页面 全网址
    const callback = new URLSearchParams(window.location.search).get('callback')
    // 替换当前路由 去首页 这样用户就不能回到登陆页
    callback ? (location.href = callback) : navigate('/')
  }
  // 没动。。。。
}
```

接口我用另一个项目，用的express框架，这边就不贴代码了。回头整个集中贴一下。
