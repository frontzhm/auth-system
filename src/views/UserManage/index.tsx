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
