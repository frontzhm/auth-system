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
