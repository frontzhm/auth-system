---
title: 1-用户管理(通用的增删改查逻辑和form-render)
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

本文主要介绍具体页面之用户管理，介绍通用的的增删改查，并使用`form-render`来生成表单。

![auth_user1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user1.png)
![auth_user5.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user5.gif)

先安装好form-render和dayjs。

```shell
pnpm add form-render dayjs
```

form-render的使用可以参考[form-render](https://xrender.fun/form-render/)
dayjs的使用可以参考[dayjs](https://day.js.org/docs/zh-CN/parse/parse)

## 页面结构

```shell
views/
└── UserManage/
    ├── index.tsx               # 用户管理主页面逻辑 ‌
    ├── config.ts               # 页面级配置（表格列定义/搜索表单配置）
    ├── useQuery.ts             # 查询逻辑封装（请求参数/数据响应）
    ├── api.ts                  # 用户管理接口请求封装 ‌
    ├── typing.d.ts             # 类型定义（接口响应/数据模型）
    └── ModalCreateItem/        # 新增/编辑用户弹框组件
        ├── index.tsx           # 弹框主体逻辑与表单交互 ‌
        ├── config.ts           # 弹框表单配置项（字段规则/布局）
        └── AvatarUpload.tsx    # 头像上传组件（集成表单校验）

```

关键文件说明

- ‌index.tsx (主页面)‌

集成表格渲染、分页逻辑、操作按钮（新增/删除）
调用 api.ts 接口获取数据，通过 config.ts 配置表格列 ‌

- ‌config.ts (页面配置)‌

定义表格列 columns 结构和渲染逻辑
配置搜索表单字段（如用户名/状态过滤）‌

- ‌api.ts (接口层)‌

封装用户管理相关接口（如 getUserList、createUser）‌
统一处理请求参数和响应数据格式化 ‌

- ‌typing.d.ts (类型定义)‌

声明接口响应类型（如 UserListResponse）
定义表单数据类型（如 CreateUserForm）‌

- ‌ModalCreateItem (弹框组件)‌

复用表单组件，通过 config.ts 驱动表单渲染 ‌
集成 AvatarUpload 组件实现头像上传与数据绑定

## 定义通用请求参数类型和响应数据类型

在global.d.ts中定义通用请求参数类型和响应数据类型。

- G_IResponse：通用响应数据类型
- G_TableResponseData：表格类响应数据类型
- G_TableResponse：表格类响应数据类型
- G_PageAndSort：分页和排序
- G_TableRequestParams：表格请求参数类型

```ts
// global.d.ts
declare type G_IResponse<T = any> = {
  data: T
  code: number
  message: string
  success: boolean
}

declare type G_TableResponseData<T = any> = {
  list: T[]
  total: number
}
// 表格类响应数据类型
declare type G_TableResponse<T = any> = G_IResponse<G_TableResponseData<T>>

// 分页和排序
declare type G_PageAndSort = {
  pageNum: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
}

declare type G_TableRequestParams<T> = G_PageAndSort & T
```

## 定义类型-用户管理

在`src/views/UserManage/typing.d.ts`中定义请求用户管理数据类型。

- IQueryParams：查询请求的参数类型
- IQueryFormData：查询formData类型
- IItemTable：表格每条数据类型
- IItemResponse：查询返回的每条数据类型
- ICreateFormData：新增请求的formData类型
- IUpdateFormData：编辑请求的formData类型
- IUpdateParams：编辑请求的参数类型

```ts
// src/views/UserManage/typing.d.ts
// 查询请求的参数类型
export type IQueryParams = {
  userId?: string
  username?: string
  state?: boolean
}
// 查询请求的formData类型  这里和IQueryParams一样
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string
  username: string
  email: string
  role: string
  state: string
  createTime: string
  lastLoginTime: string
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  createId: number
  deptId: string
  deptName: string
  roleList: string
  userImg: string
}

// 新增请求的formData类型
export type ICreateFormData = {
  username: string
  email: string
  phone?: string
  deptId?: string
  job?: string
  role: number
  state: string
  userImg?: string
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData
```

## 定义接口-用户管理

在`src/views/UserManage/api.ts`中定义请求用户管理接口。

- apiQueryList：请求用户列表
- apiUpdate：新增/编辑用户
- apiDelete：删除用户

```ts
// src/views/UserManage/api.ts
import request from '@/utils/request'
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/user/userList', {
    method: 'GET',
    params,
  })
}
export function apiUpdate(params: IUpdateParams) {
  return request('/api/user/update', {
    method: 'POST',
    data: params,
  })
}
export function apiDelete(ids: string[]) {
  return request('/api/user/delete', {
    method: 'POST',
    data: { ids },
  })
}
```

## 配置查询表单的schema/表格columns/新增编辑表单的schema

在`src/views/UserManage/config.tsx`中定义查询表单和表格列。

- schemaQuery：查询表单的schema
- genColumns：查询表格的columns
- schemaUpdate：新增/编辑表单的schema，注意id只是为了编辑时传递给后端的字段，不需要展示在表单中，需要设置.hidden{display: none}，否则会有高度

```tsx
// src/views/UserManage/config.ts
import { TableColumnsType } from 'antd'
import { IItemTable } from './typing.d'
import { Button, Popconfirm, Flex } from 'antd'
import { IItemResponse } from './typing'
import dayjs from 'dayjs'

export const STATE_TYPE = {
  WORK: 1,
  LEAVE: 2,
}
export const STATE_TYPE_OPTIONS = [
  { label: '在职', value: STATE_TYPE.WORK },
  { label: '离职', value: STATE_TYPE.LEAVE },
]

export const ROLE = {
  ADMIN: 1,
  USER: 2,
}
export const ROLE_OPTIONS = [
  { label: '管理员', value: ROLE.ADMIN },
  { label: '用户', value: ROLE.USER },
]
// 查询表单的schema
export const schemaQuery = {
  type: 'object',
  displayType: 'row',
  properties: {
    // id是字段名，也是字段的key
    id: {
      // 标签名
      title: '用户ID',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入用户ID',
      },
    },
    username: {
      title: '用户名',
      widget: 'input',
      type: 'string',
      props: {
        placeholder: '请输入用户名',
      },
    },
    state: {
      title: '状态',
      type: 'string',
      widget: 'select',
      props: {
        placeholder: '请选择状态',
        options: STATE_TYPE_OPTIONS,
      },
    },
  },
}
// 查询表格的columns
export const genColumns = ({
  updateItem,
  deleteItem,
}: {
  updateItem: (record: IItemResponse) => void
  deleteItem: (ids: string[]) => void
}) => {
  const columns: TableColumnsType<IItemTable> = [
    { title: '用户ID', dataIndex: 'id', ellipsis: true, width: 100 },
    { title: '用户名', dataIndex: 'username' },
    { title: '用户邮箱', dataIndex: 'email' },
    {
      title: '用户角色',
      dataIndex: 'role',
      render: (role: number) => {
        return ROLE_OPTIONS.find((item) => item.value === role)?.label || '--'
      },
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      render: (state: number) => {
        return STATE_TYPE_OPTIONS.find((item) => item.value === state)?.label || '--'
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      sorter: true,
      render: (createTime: string) => {
        return dayjs(createTime).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      sorter: true,
      render: (lastLoginTime: string) => {
        return dayjs(lastLoginTime).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (record: IItemResponse) => (
        <Flex>
          <Button type='primary' onClick={() => updateItem(record)}>
            编辑
          </Button>
          <Popconfirm title='确定删除吗？' onConfirm={() => deleteItem([record?.id])}>
            <Button type='primary' danger style={{ marginLeft: 10 }}>
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
      // 这里需要注意，需要设置.hidden{display: none}，否则会有高度
      className: 'hidden',
      props: {
        type: 'hidden',
      },
    },
    username: {
      title: '用户名称',
      type: 'string',
      required: true,
      placeholder: '请输入用户名',
      rules: [{ pattern: '^.{3,20}$', message: '用户名需3-20位字符' }],
    },
    email: {
      title: '用户邮箱',
      type: 'string',
      format: 'email',
      required: true,
      placeholder: 'example@domain.com',
    },
    phone: {
      title: '手机号',
      type: 'string',
      required: true,
      pattern: '^1[3-9]\\d{9}$',
      placeholder: '请输入11位手机号',
    },
    deptId: {
      title: '部门',
      type: 'array',
      widget: 'treeSelect',
      required: false,
      props: {
        treeData: [
          { title: '总部', value: '0', children: [{ title: '研发部', value: '0-0' }] },
          { title: '分部', value: '1', children: [{ title: '销售部', value: '1-0' }] },
        ],
      },
    },
    job: {
      title: '岗位',
      type: 'string',
      required: false,
      placeholder: '请输入岗位名称',
    },
    role: {
      title: '角色',
      type: 'number',
      widget: 'select',
      required: true,
      props: {
        options: ROLE_OPTIONS,
      },
    },
    state: {
      title: '状态',
      type: 'number',
      widget: 'select',
      required: true,
      props: {
        options: STATE_TYPE_OPTIONS,
      },
    },
    userImg: {
      title: '头像',
      type: 'string',
      widget: 'AvatarUpload',
      required: false,
    },
  },
}
```

## 创建编辑弹框 - 用户管理

在`src/views/UserManage/ModalCreateItem/index.tsx`中定义用户管理的新增和编辑弹框。

- 1.  通过 ref 暴露 open/close 方法供父组件调用
- 2.  集成 FormRender 表单渲染引擎
- 3.  支持头像上传组件集成
- 4.  自动区分创建/编辑模式
- 5.  提交成功后刷新列表并关闭弹窗

```tsx
// src/views/UserManage/ModalCreateItem/index.tsx
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import FormRender, { useForm } from 'form-render'
import { schemaUpdate } from '../config'
import * as api from '../api'
import { IItemResponse } from '../typing'
import AvatarUpload from './AvatarUpload'
// 定义 ModalCreateItemRef 接口类型，父组件通过 ref.current 调用子组件方法
export interface ModalCreateItemRef {
  open: (params: { action: 'create' | 'update'; record?: IItemResponse }) => void
  close: () => void
}
// 定义 ModalCreateItemProps 属性类型，父组件传入属性，子组件通过 props 使用
type ModalCreateItemProps = {
  updateList: () => void
}

const ModalCreateItem = forwardRef<ModalCreateItemRef, ModalCreateItemProps>(({ updateList }, ref) => {
  const form = useForm()
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<'create' | 'update'>('create')
  const [record, setRecord] = useState<IItemResponse | undefined>(undefined)

  // 打开时，如果是编辑状态，将 record 填充到表单中
  useEffect(() => {
    if (open && action === 'update') {
      form.resetFields()
      form.setValues(record)
    }
  }, [open, action, record])

  // 打开弹窗
  const openModal = ({ action, record }: { action: 'create' | 'update'; record?: IItemResponse }) => {
    setOpen(true)
    setAction(action)
    setRecord(record)
  }
  const close = () => {
    setOpen(false)
    // 关闭时清空表单‌
    form.resetFields()
  }
  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({ open: openModal, close }), [form])

  const submit = () => {
    form.validateFields().then(() => {
      api.apiUpdate(form.getValues()).then(() => {
        message.success('操作成功')
        // 提交成功后刷新列表
        updateList()
        // 关闭弹窗
        close()
      })
    })
  }

  return (
    <Modal
      width={600}
      title={action === 'create' ? '新建用户' : '编辑用户'}
      open={open}
      onOk={submit}
      onCancel={close}
      destroyOnClose={true}
    >
      <FormRender
        widgets={{ AvatarUpload }}
        maxWidth={400}
        labelWidth={100}
        schema={schemaUpdate}
        form={form}
        column={1}
      />
    </Modal>
  )
})
ModalCreateItem.displayName = 'ModalCreateItem'
export default ModalCreateItem
```

## 上传头像组件 - 用户管理

在`src/views/UserManage/ModalCreateItem/AvatarUpload.tsx`中定义用户管理的头像上传组件。

- 1.  通过 Upload 组件实现图片上传
- 2.  通过 Avatar 组件展示图片，imageUrl 为图片地址，默认值为表单传入的值，回显图片
- 3.  通过 handleChange处理上传状态，onChange 方法同步数据到表单
- 4.  通过 beforeUpload 方法校验图片格式和大小
- 5.  通过 uploadButton 定义上传图标

```tsx
// src/views/UserManage/ModalCreateItem/AvatarUpload.tsx
import { useState } from 'react'
import { Upload, Avatar, message } from 'antd'
import { UploadProps, UploadFile } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const AvatarUpload = ({ value, onChange }: any) => {
  // value 是表单传入的值，onChange 是表单传入的方法, 用于同步数据到表单, value 和 onChange 是固定的
  // imageUrl 是组件内部的状态，用于展示图片
  const [imageUrl, setImageUrl] = useState<string>(value)
  const [loading, setLoading] = useState<boolean>(false)

  // 上传图片
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      const {
        response: {
          success,
          data: { url },
        },
      } = info.file
      if (!success) {
        message.error('上传失败')
        return
      }
      setImageUrl(url)
      onChange(url) // 关键：同步数据到表单
    }
    if (info.file.status === 'error') {
      setLoading(false)
      message.error('上传失败')
    }
  }
  // 上传前校验
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('请上传jpg或png格式的图片')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2M')
      return false
    }
    return isJpgOrPng && isLt2M
  }
  // 上传图标
  const uploadButton = <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>

  return (
    <>
      <Upload
        listType='picture-circle'
        showUploadList={false}
        maxCount={1}
        headers={{ Authorization: localStorage.getItem('token') || '' }}
        action={`${import.meta.env.VITE_BASE_URL}/api/user/upload`}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <Avatar style={{ height: '100px', width: '100px' }} src={imageUrl} /> : uploadButton}
      </Upload>
    </>
  )
}

export default AvatarUpload
```

## 查询逻辑封装

在`src/views/UserManage/useQuery.ts`中定义查询逻辑封装。

- 状态管理：列表数据、总数、页码、每页条数、排序字段、排序方式
- 查询列表数据：fetchList
- 触发手动刷新（带页码重置）：onSearch
- 初次查询，页码变化、排序变化时查询：useEffect
- 主动触发的页码和排序变化：changePageAndSort
- 分页器配置：pagination

```ts
// src/views/UserManage/useQuery.ts
import { useEffect, useState } from 'react'
import * as api from './api'
import { IItemResponse } from './typing'

export function useQuery({ form }: { form: any }) {
  // // 状态管理
  const [list, setList] = useState<IItemResponse[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend')

  // 查询列表数据
  const fetchList = async () => {
    const { list, total } = await api.apiQueryList({
      ...form.getValues(),
      pageNum,
      pageSize,
      ...(sortField && { sortField, sortOrder }),
    })
    setList(list)
    setTotal(total)
  }

  // 触发手动刷新（带页码重置）
  const onSearch = () => {
    setPageNum(1)
    fetchList()
  }

  // 初次查询，页码变化、排序变化时查询
  useEffect(() => {
    fetchList()
  }, [pageNum, pageSize, sortField, sortOrder])

  // 页码变化、排序变化时
  const changePageAndSort = (pagination: any, _: any, sorter: any) => {
    setPageNum(pagination.current || 1)
    setPageSize(pagination.pageSize || 10)
    const sortField = Array.isArray(sorter) ? sorter[0]?.field : sorter?.field
    const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order
    if (sortField && typeof sortField === 'string') {
      setSortField(sortField)
      if (sortOrder) {
        setSortOrder(sortOrder)
      }
    }
  }
  const pagination = {
    total,
    showTotal: () => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize,
    current: pageNum,
  }

  return {
    list,
    total,
    pagination,
    changePageAndSort,
    onSearch,
  }
}
```

## 增删改查-用户管理页面

在`src/views/UserManage/index.tsx`中定义用户管理页面。

- 查询相关：list、pagination、onSearch、changePageAndSort
- 新增/编辑：refModalCreateItem、createItem、updateItem
- 删除和批量删除：selectedRowKeys、rowSelection、deleteItem
- 表格列配置：columns

```tsx
import React, { useState, useRef } from 'react'
import { useForm, SearchForm } from 'form-render'
import { genColumns, schemaQuery } from './config'
import { Flex, Button, Table, Popconfirm, message } from 'antd'
import * as api from './api'
import { IItemResponse } from './typing'
import ModalCreateItem, { ModalCreateItemRef } from './ModalCreateItem'
import { useQuery } from './useQuery'

const UserManage: React.FC = () => {
  // useForm 是 form-render 提供的 hook，用于生成表单实例
  const form = useForm()
  // 查询相关
  const { list, pagination, onSearch, changePageAndSort } = useQuery({ form })

  // 新增/编辑
  const refModalCreateItem = useRef<ModalCreateItemRef>(null)
  const createItem = () => {
    refModalCreateItem.current?.open({
      action: 'create',
    })
  }
  const updateItem = (record: IItemResponse) => {
    refModalCreateItem.current?.open({
      action: 'update',
      record,
    })
  }

  // 删除和批量删除
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  const deleteItem = (ids: string[]) => {
    api.apiDelete(ids).then(() => {
      message.success('删除成功')
      onSearch()
    })
  }

  // 表格列配置
  const columns = genColumns({
    updateItem,
    deleteItem,
  })

  return (
    <div>
      {/* 查询表单 */}
      <SearchForm
        searchOnMount={false}
        schema={schemaQuery}
        form={form}
        column={3}
        labelWidth={100}
        onSearch={onSearch}
      />
      {/* 操作 */}
      <Flex style={{ justifyContent: 'flex-end', marginBottom: 10 }}>
        <Button type='primary' onClick={createItem}>
          {' '}
          新增{' '}
        </Button>
        <Popconfirm title='确定批量删除吗？' onConfirm={() => deleteItem(selectedRowKeys)}>
          <Button style={{ marginLeft: 10 }} type='primary' danger disabled={!selectedRowKeys.length}>
            批量删除
          </Button>
        </Popconfirm>
      </Flex>
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={list}
        rowSelection={rowSelection}
        rowKey='id'
        onChange={changePageAndSort}
        pagination={pagination}
        scroll={{ x: 1300 }}
      />
      <ModalCreateItem updateList={onSearch} ref={refModalCreateItem} />
    </div>
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
```

<!--
![auth_user2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user2.png)

![auth_user3.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user3.png)

![auth_user4.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user4.png)

![auth_user6.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user6.gif)

![auth_user7.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user7.gif) -->

![auth_user8.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_user8.gif)
