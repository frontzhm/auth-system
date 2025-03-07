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
