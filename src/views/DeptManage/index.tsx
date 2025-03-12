import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
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
      updateFormProps={{ schema: schemaUpdate, onMount }}
      api={api}
    />
  )
}

DeptManage.displayName = 'DeptManage'
export default DeptManage
