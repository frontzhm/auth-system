---
title: 2-部门管理(抽离通用的增删改查逻辑)
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

本文主要介绍具体页面之部门管理，抽离通用的的增删改查。

上篇实现了[用户管理](https://juejin.cn/post/7478865607029112867)，这篇实现部门管理，而部门管理的增删改查和用户管理是一样的，所以我们可以在用户管理页面的基础上抽离出通用的增删改查逻辑。

## 抽离逻辑到 components/PageTable

上次的用户管理页面的结构

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
        └── AvatarUpload.tsx    # 头像上传组件（集成表单校验）

```

复制一份到`src/components`，重命名为`src/components/PageTable`，然后修改文件名和文件内容。

### 处理index.tsx

- searchFormProps和tableProps作为参数传入
- api作为参数传入
- actionBtns作为可选参数传入
- modalCreateProps和updateFormProps作为可选参数传入

```tsx
// src/components/PageTable/index.tsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { useForm, SearchForm } from 'form-render'
// import { genColumns, schemaQuery } from './config'
import { Flex, Button, Table, message } from 'antd'
// import * as api from './api'
import ModalCreateItem, { ModalCreateItemRef } from './ModalCreateItem'
import { IModalCreateProps, IUpdateFormProps } from './ModalCreateItem'
import { useQuery } from './useQuery'
import { Ref } from 'react'

type ISearchFormProps = {
  schema: any
  [key: string]: any
}
type ITableProps = {
  columns?: any
  rowKey?: string
  [key: string]: any
}
type IApi = {
  apiDelete?: (ids: string[]) => Promise<any>
  apiUpdate?: (values: any) => Promise<any>
  apiQueryList: (params: any) => Promise<any>
}

type IPapeTableProps = {
  searchFormProps: ISearchFormProps
  tableProps: ITableProps
  modalCreateProps?: IModalCreateProps
  updateFormProps?: IUpdateFormProps
  api: IApi
  actionBtns?: React.ReactNode
}
type PageTableRef = {
  onSearch: () => void
}

const PageTable = forwardRef((props: IPapeTableProps, ref: Ref<PageTableRef>) => {
  const { searchFormProps, tableProps, api, modalCreateProps, updateFormProps, actionBtns } = props
  // useForm 是 form-render 提供的 hook，用于生成表单实例
  const form = useForm()
  // 查询相关
  const { list, pagination, onSearch, changePageAndSort } = useQuery({ form, api })

  // 新增/编辑
  const refModalCreateItem = useRef<ModalCreateItemRef>(null)
  const createItem = () => {
    refModalCreateItem.current?.open({
      action: 'create',
    })
  }
  const updateItem = (record: Object) => {
    refModalCreateItem.current?.open({
      action: 'update',
      record,
    })
  }

  const deleteItem = (ids: string[]) => {
    api.apiDelete &&
      api.apiDelete(ids).then(() => {
        message.success('删除成功')
        onSearch()
      })
  }
  useImperativeHandle(
    ref,
    () => ({
      form,
      api,
      onSearch,
      createItem,
      updateItem,
      deleteItem,
    }),
    [onSearch],
  )
  const tablePropsInner = {
    dataSource: list,
    rowKey: 'id',
    onChange: changePageAndSort,
    pagination,
    scroll: { x: 1300 },
    ...tableProps,
  }
  return (
    <div>
      <SearchForm form={form} schema={searchFormProps.schema} onSubmit={onSearch} />
      <Flex style={{ justifyContent: 'flex-end', marginBottom: 10 }}>
        {updateFormProps && (
          <Button type='primary' onClick={createItem}>
            新增
          </Button>
        )}

        {actionBtns}
      </Flex>
      <Table {...tablePropsInner} />

      <ModalCreateItem
        ref={refModalCreateItem}
        updateList={onSearch}
        api={api}
        modalCreateProps={modalCreateProps}
        updateFormProps={updateFormProps}
      />
    </div>
  )
})
PageTable.displayName = 'PageTable'
export default PageTable
```

### 处理useQuery.ts

- 将api作为参数传入

```tsx
// src/components/PageTable/useQuery.ts
import { useEffect, useState } from 'react'

export function useQuery({ form, api }: { form: any; api: any }) {
  // // 状态管理
  const [list, setList] = useState<Object[]>([])
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

### 处理ModalCreateItem/index.tsx

- 将api作为参数传入
- 将modalCreateProps和updateFormProps作为参数传入

```tsx
// src/components/PageTable/ModalCreateItem/index.tsx
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import FormRender, { useForm } from 'form-render'
// import { schemaUpdate } from '../config'
// import * as api from '../api'
// import { IItemResponse } from '../typing'
// import AvatarUpload from './AvatarUpload'
// 定义 ModalCreateItemRef 接口类型，父组件通过 ref.current 调用子组件方法
export interface ModalCreateItemRef {
  open: (params: { action: 'create' | 'update'; record?: Object }) => void
  close: () => void
}
export type IModalCreateProps = {
  titleKey: string
  [key: string]: any
}
export type IUpdateFormProps = {
  schema: any
  [key: string]: any
}
// 定义 ModalCreateItemProps 属性类型，父组件传入属性，子组件通过 props 使用
type ModalCreateItemProps = {
  modalCreateProps?: IModalCreateProps
  updateFormProps?: IUpdateFormProps
  updateList: () => void
  api?: any
}

const ModalCreateItem = forwardRef<ModalCreateItemRef, ModalCreateItemProps>(
  ({ updateList, api, modalCreateProps, updateFormProps }, ref) => {
    const form = useForm()
    const [open, setOpen] = useState<boolean>(false)
    const [action, setAction] = useState<'create' | 'update'>('create')
    const [record, setRecord] = useState<Object | undefined>(undefined)

    // 打开时，如果是编辑状态，将 record 填充到表单中
    useEffect(() => {
      if (open && action === 'update') {
        form.resetFields()
        console.log('record', record)
        form.setValues(record)
      }
    }, [open, action, record])

    // 打开弹窗, action 为 create 时，record 为空，为 update 时，record 为当前行数据
    const openModal = ({ action, record }: { action: 'create' | 'update'; record?: Object }) => {
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
    const modalPropsInner = {
      width: 600,
      open: open,
      onOk: submit,
      onCancel: close,
      destroyOnClose: true,
      title: action === 'create' ? `新建${modalCreateProps?.titleKey}` : `编辑${modalCreateProps?.titleKey}`,
      ...modalCreateProps,
    }
    const updateFormPropsInner = {
      schema: updateFormProps?.schema || {},
      maxWidth: 400,
      labelWidth: 100,
      form,
      column: 1,
      ...updateFormProps,
    }
    return (
      <Modal {...modalPropsInner}>
        <FormRender {...updateFormPropsInner} />
      </Modal>
    )
  },
)
ModalCreateItem.displayName = 'ModalCreateItem'
export default ModalCreateItem
```

- 删除`components/PageTable/ModalCreateItem/AvatarUpload.tsx`
- 删除`components/PageTable/config.ts`
- 删除`components/PageTable/api.ts`
- 删除`components/PageTable/typing.d.ts`

### 重构UserManage

接下来我们将UserManage重构为PageTable的调用。

- 将`AvatarUpload`组件移到`src/views/UserManage/components/AvatarUpload.tsx`，然后修改UserManage的调用。
- 删除`src/views/UserManage/useQuery.ts`
- 删除`src/views/UserManage/ModalCreateItem`

```tsx
// src/views/UserManage/index.tsx
import React, { useState } from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
import AvatarUpload from './components/AvatarUpload'
import { Button, Popconfirm } from 'antd'

const UserManage: React.FC = () => {
  // 批量删除
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
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

  // 操作按钮
  const actionBtns = (
    <Popconfirm
      title='确定批量删除吗？'
      onConfirm={() => {
        refPageTable.current?.deleteItem(selectedRowKeys)
        setSelectedRowKeys([])
      }}
    >
      <Button style={{ marginLeft: 10 }} type='primary' danger disabled={!selectedRowKeys.length}>
        批量删除
      </Button>
    </Popconfirm>
  )
  return (
    <PageTable
      ref={refPageTable}
      searchFormProps={{ schema: schemaQuery }}
      tableProps={{ columns, rowKey: 'id', rowSelection }}
      modalCreateProps={{ titleKey: '用户' }}
      updateFormProps={{ schema: schemaUpdate, widgets: { AvatarUpload } }}
      actionBtns={actionBtns}
      api={api}
    />
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
```

页面效果同之前。

## 应用PageTable到部门管理

![auth_dept_1.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_dept_1.png)
![auth_dept_2.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_dept_2.png)
![auth_dept_3.png](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_dept_3.png)

部门管理的结构：

```shell
views/
└── DeptManage/
    ├── index.tsx               # 用户管理主页面逻辑 ‌
    ├── config.ts               # 页面级配置（表格列定义/搜索表单配置）
    ├── api.ts                  # 用户管理接口请求封装 ‌
    ├── typing.d.ts             # 类型定义（接口响应/数据模型）

```

### index.tsx

- 这里，上级部门是树形结构，所以需要在`config.ts`中配置`parentId`字段为`treeSelect`类型。
- 负责人是下拉选择，所以需要在`config.ts`中配置`master`字段为`select`类型。
- 需要在`index.tsx`中获取部门列表和用户列表，然后将部门列表和用户列表传递给`updateForm.setSchema`。
- 新增子部门的逻辑是点击新增子部门按钮，然后打开新增弹框，然后将当前部门的id作为parentId传递给新增弹框，然后新增子部门。

```tsx
// src/views/DeptManage/index.tsx
import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
import AvatarUpload from './components/AvatarUpload'
import { apiQueryList as apiUserList } from '@/views/UserManage/api'

const DeptManage: React.FC = () => {
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
      const deptList = await api.apiQueryList({ pageNum: 1, pageSize: 1000 })
      const userList = await apiUserList({ pageNum: 1, pageSize: 1000 })
      console.log('deptList', deptList)
      // 根据服务端下发内容，重置下拉选项
      const updateForm = refPageTable.current?.updateForm
      updateForm.setSchema({
        parentId: {
          props: {
            fieldNames: { label: 'deptName', value: 'id' },
            treeData: deptList.list,
          },
        },
        master: {
          props: {
            fieldNames: { label: 'username', value: 'id' },
            options: userList.list,
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
      modalCreateProps={{ titleKey: '部门' }}
      updateFormProps={{ schema: schemaUpdate, onMount, widgets: { AvatarUpload } }}
      api={api}
    />
  )
}

DeptManage.displayName = 'DeptManage'
export default DeptManage
```

### api.ts

```tsx
// src/views/DeptManage/api.ts
import request from '@/utils/request'
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/dept/deptList', {
    method: 'GET',
    params,
  })
}

export function apiUpdate(params: IUpdateParams) {
  return request('/api/dept/update', {
    method: 'POST',
    data: params,
  })
}
export function apiDelete(ids: string[]) {
  return request('/api/dept/delete', {
    method: 'POST',
    data: { ids },
  })
}
```

### typing.d.ts

```tsx
// src/views/DeptManage/typing.d.ts
// 查询请求的参数类型
export type IQueryParams = {
  deptName?: string
}
// 查询请求的formData类型  这里和IQueryParams一样
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string
  deptName: string
  master: string
  parentId: string
  createTime: string
  updateTime: string
  children: IItemTable[]
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  createId: number
  __v: number
}

// 新增请求的formData类型
export type ICreateFormData = {
  deptName: string
  master: string
  parentId?: string
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData
```

### config.ts

```tsx
// src/views/DeptManage/config.ts
import { TableColumnsType } from 'antd'
import { IItemTable } from './typing'
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
    deptName: {
      // 标签名
      title: '部门名称',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入部门名称',
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
    { title: '部门名称', dataIndex: 'deptName', ellipsis: true, width: 150 },
    { title: '负责人', dataIndex: 'master', ellipsis: true, width: 100 },
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
      title: '更新时间',
      dataIndex: 'updateTime',
      sorter: true,
      render: (lastLoginTime: string) => {
        return dayjs(lastLoginTime).format('YYYY-MM-DD HH:mm')
      },
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: IItemResponse) => (
        <Flex>
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
            新增子部门
          </Button>
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
    parentId: {
      title: '上级部门',
      type: 'array',
      widget: 'treeSelect',
      required: false,
      // treeData是树形选择器的数据, 这里是空数组
      props: { treeData: [] },
    },
    deptName: {
      title: '部门名称',
      type: 'string',
      required: true,
      placeholder: '请输入部门名称',
    },
    master: {
      title: '负责人',
      required: true,
      widget: 'select',
      props: {
        options: [],
      },
    },
  },
}
```

### src/router/index.tsx和SideMenu/index.tsx加入部门管理

router/index.tsx如下:

```js
// src/router/index.tsx
{
  path: '/dept-manage',
  element: SuspenseView(DeptManage),
},
```

SideMenu/index.tsx如下:

```js
// src/layout/components/SideMenu/index.tsx
{
  label: '部门管理',
  icon: <VideoCameraOutlined />,
  key: 'dept-manage',
},
```

### 效果

![auth_dept_4.gif](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/auth_dept_4.gif)
