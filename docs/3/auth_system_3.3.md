---
title: 3-菜单管理和角色管理
tags: vue
categories: vue
theme: vue-pro
highlight:
nav:
  path: /pages
  title: 具体页面
  order: 2
---

本系列从零搭建一个后台系统，技术选型`React18 + ReactRouter7 + Vite4 + Antd5 + zustand  + TS`。
这个系列文章将会从零开始，一步一步搭建一个后台系统，这个系统将会包括登录、权限、菜单、用户、角色等功能。

本文主要介绍具体页面之菜单管理和角色管理，先写完页面，然后说下权限系统的RBAC模式。

## 继续使用PageTable到菜单管理

![auth_menu_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_menu_1.png)
![auth_menu_2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_menu_2.png)
![auth_menu_3.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_menu_3.png)

上次的菜单管理页面的结构:

```shell
views/
└── MenuManage/
    ├── index.tsx               # 主页面逻辑 ‌
    ├── config.ts               # 页面级配置（表格列定义/搜索表单配置）
    ├── api.ts                  # 接口请求封装 ‌
    ├── typing.d.ts             # 类型定义（接口响应/数据模型）

```

可以复制之前的DeptManage的代码，然后修改成MenuManage。

### 处理index.tsx

微微改下相关字段就好了，比如把`Dept`改成`Menu`，titleKey改成`菜单`。

- 这里，上级菜单是树形结构，所以需要在`config.ts`中配置`parentId`字段为`treeSelect`类型。
- 创建菜单的时候，需要选择上级菜单，所以需要在`onMount`中请求所有的菜单列表
- 新增子菜单的逻辑是点击新增子菜单，然后打开新增弹框，然后将当前的id作为parentId传递给新增弹框，然后新增子菜单。

```tsx
// src/views/MenuManage/index.tsx
import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'

const MenuManage: React.FC = () => {
  // 获取实例
  const refPageTable = React.createRef<any>()

  // 表格列配置
  const columns = genColumns({
    updateItem: (record: Object) => {
      refPageTable.current?.updateItem(record)
    },
    deleteItem: (ids: string[]) => {
      refPageTable.current?.deleteItem(ids)
    },
  })

  const onMount = () => {
    const fn = async () => {
      const menuList = await api.apiQueryList({ pageNum: 1, pageSize: 1000 })
      console.log('menuList', menuList)
      // 根据服务端下发内容，重置下拉选项
      const updateForm = refPageTable.current?.updateForm
      updateForm.setSchema({
        parentId: {
          props: {
            fieldNames: { label: 'menuName', value: 'id' },
            treeData: menuList.list,
          },
        },
      })
    }
    fn()
  }

  return (
    <PageTable
      ref={refPageTable}
      searchFormProps={{ schema: schemaQuery }}
      tableProps={{ columns, rowKey: 'id' }}
      modalCreateProps={{ titleKey: '菜单' }}
      updateFormProps={{ schema: schemaUpdate, onMount }}
      api={api}
    />
  )
}

MenuManage.displayName = 'MenuManage'
export default MenuManage
```

### api.ts

可以使用快捷键，然后替换dept为menu。

```tsx
// src/views/MenuManage/api.ts
import request from '@/utils/request'
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/menu/menuList', {
    method: 'GET',
    params,
  })
}

export function apiUpdate(params: IUpdateParams) {
  return request('/api/menu/update', {
    method: 'POST',
    data: params,
  })
}
export function apiDelete(ids: string[]) {
  return request('/api/menu/delete', {
    method: 'POST',
    data: { ids },
  })
}
```

### typing.d.ts

这个得根据情况写了

```tsx
// src/views/MenuManage/typing.d.ts
// 查询请求的参数类型
export type IQueryParams = {
  menuName?: string
  menuState?: number
}
// 查询请求的formData类型  这里和IQueryParams一样
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string
  menuName: string
  menuType: number
  menuCode: string
  path: string
  createTime: string
  orderBy: number
  menuState: number
  icon: string
  parentId: string
  component: string
  children: IItemTable[]
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  updateTime: string
}

// 新增请求的formData类型
export type ICreateFormData = {
  parentId?: string
  menuType: number
  menuName: string
  icon?: string
  path?: string
  component?: string
  menuCode?: string
  orderBy?: number
  menuState: number
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData
```

### config.ts

这个也得根据情况写了，这里主要是表格的columns和新增/编辑的schema。

注意不同的菜单类型，显示不同的字段，比如菜单类型是按钮的时候，不显示菜单名称、图标、路由地址、排序字段。

```tsx
// src/views/MenuManage/config.ts
import { TableColumnsType } from 'antd'
import { IItemTable } from './typing'
import { Button, Popconfirm, Flex } from 'antd'
import { IItemResponse } from './typing'
import dayjs from 'dayjs'

// 菜单类型 1菜单 2按钮 3独立页面
export const MENU_TYPE = {
  MENU: 1,
  BUTTON: 2,
}

export const MENU_TYPE_OPTIONS = [
  { label: '菜单', value: MENU_TYPE.MENU },
  { label: '按钮', value: MENU_TYPE.BUTTON },
]

export const MENU_STATE = {
  ENABLE: 1,
  DISABLE: 0,
}
export const MENU_STATE_OPTIONS = [
  { label: '启用', value: MENU_STATE.ENABLE },
  { label: '禁用', value: MENU_STATE.DISABLE },
]
// 查询表单的schema
export const schemaQuery = {
  type: 'object',
  displayType: 'row',
  properties: {
    menuName: {
      // 标签名
      title: '菜单名称',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入菜单名称',
      },
    },
    menuState: {
      // 标签名
      title: '菜单状态',
      // widget是字段的类型，input是输入框
      widget: 'select',
      // 字段的props
      props: {
        options: MENU_STATE_OPTIONS,
        placeholder: '请选择菜单状态',
      },
    },
  },
}
// 查询表格的columns
export const genColumns = ({
  updateItem,
  deleteItem,
}: {
  updateItem: (record: IItemResponse | { parentId: string }) => void
  deleteItem: (ids: string[]) => void
}) => {
  const columns: TableColumnsType<IItemTable> = [
    { title: '菜单名称', dataIndex: 'menuName', width: 150 },
    { title: '图表', dataIndex: 'icon', width: 100 },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      width: 100,
      render: (menuType: number) => {
        return MENU_TYPE_OPTIONS.find((item) => item.value === menuType)?.label
      },
    },
    { title: '权限标识', dataIndex: 'menuCode', width: 100 },
    { title: '路由地址', dataIndex: 'path', width: 100 },
    { title: '组件名称', dataIndex: 'component', width: 100 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: (createTime: string) => {
        return dayjs(createTime).format('YYYY-MM-DD HH:mm')
      },
      width: 160,
    },

    {
      title: '操作',
      key: 'action',
      render: (record: IItemResponse) => (
        <Flex>
          {record.menuType === MENU_TYPE.MENU && (
            <Button
              size='small'
              color='primary'
              variant='link'
              onClick={() =>
                updateItem({
                  parentId: record.id,
                })
              }
            >
              新增子菜单
            </Button>
          )}
          <Button size='small' color='primary' variant='link' onClick={() => updateItem(record)}>
            编辑
          </Button>
          <Popconfirm title='确定删除吗？' onConfirm={() => deleteItem([record?.id])}>
            <Button size='small' color='danger' variant='link' danger>
              删除
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ]
  return columns
}

const menuSchema = {
  menuName: {
    title: '菜单名称',
    type: 'string',
    required: true,
    placeholder: '请输入菜单名称',
    hidden: '{{formData.menuType === 2}}',
  },
  icon: {
    title: '菜单图标',
    type: 'string',
    required: false,
    placeholder: '请输入图标',
    hidden: '{{formData.menuType === 2}}',
  },
  path: {
    title: '路由地址',
    type: 'string',
    required: false,
    placeholder: '请输入路由地址',
    dependencies: ['menuType'],
    hidden: '{{formData.menuType === 2 }}',
  },
  orderBy: {
    title: '排序',
    type: 'number',
    required: false,
    placeholder: '请输入排序',
    hidden: '{{formData.menuType === 2}}',
  },
}

// 新增/编辑表单的schema
export const schemaUpdate = {
  type: 'object',
  // label和input放在一行
  displayType: 'row',
  properties: {
    // id是为了编辑时传递给后端的字段，不需要展示在表单中
    id: {
      type: 'string',
      className: 'hidden',
      props: {
        type: 'hidden',
      },
    },
    parentId: {
      title: '父级菜单',
      type: 'array',
      widget: 'treeSelect',
      required: false,
      // treeData是树形选择器的数据, 这里是空数组
      props: { treeData: [] },
    },
    menuType: {
      title: '菜单类型',
      type: 'number',
      widget: 'radio',
      required: true,
      props: {
        options: MENU_TYPE_OPTIONS,
      },
      default: MENU_TYPE.MENU,
    },
    menuCode: {
      title: '权限标识',
      type: 'string',
      required: false,
      placeholder: '请输入权限标识',
    },
    ...menuSchema,

    menuState: {
      title: '权限状态',
      type: 'number',
      widget: 'radio',
      required: true,
      props: {
        options: MENU_STATE_OPTIONS,
      },
      default: MENU_STATE.ENABLE,
    },
  },
}
```

### src/router/index.tsx和SideMenu/index.tsx加入菜单管理

router/index.tsx如下:

```js
// src/router/index.tsx
{
  path: '/menu-manage',
  element: SuspenseView(MenuManage),
},
```

SideMenu/index.tsx如下:

```js
// src/layout/components/SideMenu/index.tsx
{
  label: '菜单管理',
  icon: <VideoCameraOutlined />,
  key: 'menu-manage',
},
```

### 效果

![auth_menu_4.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_menu_4.gif)

## 角色管理

![auth_role_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_role_1.png)
![auth_role_2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_role_2.png)

角色管理和菜单管理类似，只是字段不同。复制MenuManage，然后修改成RoleManage。

### 处理index.tsx

微微改下相关字段就好了，比如把`Menu`改成`Role`，titleKey改成`角色`。

- 创建角色的时候，需要选择权限，所以需要在`onMount`中请求所有的菜单列表

```tsx
// src/views/RoleManage/index.tsx
import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
import { apiQueryList as apiMenuList } from '@/views/RoleManage/api'

const RoleManage: React.FC = () => {
  // 获取实例
  const refPageTable = React.createRef<any>()

  // 表格列配置
  const columns = genColumns({
    updateItem: (record: Object) => {
      refPageTable.current?.updateItem(record)
    },
    deleteItem: (ids: string[]) => {
      refPageTable.current?.deleteItem(ids)
    },
  })

  const onMount = () => {
    const fn = async () => {
      const menuList = await apiMenuList({ pageNum: 1, pageSize: 1000 })
      console.log('menuList', menuList)
      // 根据服务端下发内容，重置下拉选项
      const updateForm = refPageTable.current?.updateForm
      updateForm.setSchema({
        authCodes: {
          props: {
            fieldNames: { label: 'menuName', value: 'id' },
            treeData: menuList.list,
          },
        },
      })
    }
    fn()
  }

  return (
    <PageTable
      ref={refPageTable}
      searchFormProps={{ schema: schemaQuery }}
      tableProps={{ columns, rowKey: 'id' }}
      modalCreateProps={{ titleKey: '角色' }}
      updateFormProps={{ schema: schemaUpdate, onMount }}
      api={api}
    />
  )
}

RoleManage.displayName = 'RoleManage'
export default RoleManage
```

### api.ts

可以使用快捷键，然后替换menu为role。

```tsx
// src/views/RoleManage/api.ts
import request from '@/utils/request'
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/role/roleList', {
    method: 'GET',
    params,
  })
}

export function apiUpdate(params: IUpdateParams) {
  return request('/api/role/update', {
    method: 'POST',
    data: params,
  })
}
export function apiDelete(ids: string[]) {
  return request('/api/role/delete', {
    method: 'POST',
    data: { ids },
  })
}
```

### typing.d.ts

这个得根据情况写了

```tsx
// src/views/RoleManage/typing.d.ts
// 查询请求的参数类型
export type IQueryParams = {
  roleName?: string
}
// 查询请求的formData类型  这里和IQueryParams一样
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string
  roleName: string
  createTime: string
  authCodes: string[]
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  updateTime: string
}

// 新增请求的formData类型
export type ICreateFormData = {
  roleName: string
  authCodes: string[]
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData
```

### config.ts

这个也得根据情况写了，这里主要是表格的columns和新增/编辑的schema。

注意authCodes是权限列表，是树形结构，所以需要配置为`treeSelect`类型，这里是多选的，且默认展开所有节点。

```tsx
// src/views/RoleManage/config.ts
import { TableColumnsType } from 'antd'
import { IItemTable } from './typing'
import { Button, Popconfirm, Flex } from 'antd'
import { IItemResponse } from './typing'
import dayjs from 'dayjs'

// 查询表单的schema
export const schemaQuery = {
  type: 'object',
  displayType: 'row',
  properties: {
    roleName: {
      // 标签名
      title: '角色名称',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入角色名称',
      },
    },
  },
}
// 查询表格的columns
export const genColumns = ({
  updateItem,
  deleteItem,
}: {
  updateItem: (record: IItemResponse | { parentId: string }) => void
  deleteItem: (ids: string[]) => void
}) => {
  const columns: TableColumnsType<IItemTable> = [
    { title: '角色ID', dataIndex: 'id', width: 150 },
    { title: '角色名称', dataIndex: 'roleName', width: 150 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: (createTime: string) => {
        return dayjs(createTime).format('YYYY-MM-DD HH:mm')
      },
      width: 160,
    },

    {
      title: '操作',
      key: 'action',
      render: (record: IItemResponse) => (
        <Flex>
          <Button size='small' color='primary' variant='link' onClick={() => updateItem(record)}>
            编辑
          </Button>
          <Popconfirm title='确定删除吗？' onConfirm={() => deleteItem([record?.id])}>
            <Button size='small' color='danger' variant='link' danger>
              删除
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ]
  return columns
}

// 新增/编辑表单的schema
export const schemaUpdate = {
  type: 'object',
  // label和input放在一行
  displayType: 'row',
  properties: {
    // id是为了编辑时传递给后端的字段，不需要展示在表单中
    id: {
      type: 'string',
      className: 'hidden',
      props: {
        type: 'hidden',
      },
    },

    roleName: {
      title: '角色名称',
      type: 'string',
      widget: 'input',
      required: true,
      props: {
        placeholder: '请输入角色名称',
      },
    },
    authCodes: {
      title: '选择权限',
      type: 'array',
      widget: 'treeSelect',
      required: true,
      // treeData是树形选择器的数据, 这里是空数组。
      // multiple是是否多选，treeCheckable是是否显示多选框, treeDefaultExpandAll是是否默认展开所有节点
      props: { treeData: [], multiple: true, treeCheckable: true, treeDefaultExpandAll: true },
    },
  },
}
```

### src/router/index.tsx和SideMenu/index.tsx加入角色管理

router/index.tsx如下:

```js
// src/router/index.tsx
{
  path: '/role-manage',
  element: SuspenseView(RoleManage),
},
```

SideMenu/index.tsx如下:

```js
// src/layout/components/SideMenu/index.tsx
{
  label: '角色管理',
  icon: <VideoCameraOutlined />,
  key: 'role-manage',
},
```

### 效果

![auth_role_3.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_role_4.gif)
