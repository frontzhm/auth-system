import React, { useState } from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
import AvatarUpload from './components/AvatarUpload'
import { Button, Popconfirm } from 'antd'
import { apiQueryList as apiDeptList } from '@/views/DeptManage/api'
import { apiQueryList as apiRoleList } from '@/views/RoleManage/api'

const UserManage: React.FC = () => {
  const onMount = () => {
    const fn = async () => {
      const deptList = await apiDeptList({ pageNum: 1, pageSize: 1000 })
      const roleList = await apiRoleList({ pageNum: 1, pageSize: 1000 })
      console.log('deptList', deptList)
      // 根据服务端下发内容，重置下拉选项
      const updateForm = refPageTable.current?.updateForm
      updateForm.setSchema({
        deptId: {
          props: {
            fieldNames: { label: 'deptName', value: 'id' },
            treeData: deptList.list,
          },
        },
        roleList: {
          props: {
            fieldNames: { label: 'roleName', value: 'id' },
            options: roleList.list,
          },
        },
      })
    }
    fn()
  }

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
      updateFormProps={{ schema: schemaUpdate, widgets: { AvatarUpload }, onMount }}
      actionBtns={actionBtns}
      api={api}
    />
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
