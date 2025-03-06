import React, { useState } from 'react'
import { useForm, SearchForm } from 'form-render'
import { columns, schema } from './config'
import { Flex, Button, Table } from 'antd'

type UserManageProps = {}

const UserManage: React.FC<UserManageProps> = () => {
  const form = useForm()
  const onSearch = (values: any) => {
    console.log(values, 'searchData')
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const createItem = () => {
    console.log('createItem')
  }
  const deleteItem = (ids: any[]) => {
    console.log(ids, 'deleteRecord')
  }
  return (
    <div>
      <SearchForm schema={schema} form={form} column={3} labelWidth={100} onSearch={onSearch} />
      <Flex className='table-header' style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div className='table-header-title'>用户列表</div>
        <Flex className='action-list'>
          <Button type='primary' onClick={createItem}>
            新增
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            type='primary'
            danger
            onClick={() => {
              deleteItem(selectedRowKeys)
            }}
            disabled={!selectedRowKeys.length}
          >
            批量删除
          </Button>
        </Flex>
      </Flex>
      <Table columns={columns} dataSource={[]} rowKey='id' pagination={{ pageSize: 10 }} scroll={{ x: 1300 }} />
    </div>
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
