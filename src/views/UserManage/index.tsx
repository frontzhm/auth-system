import React, { useEffect, useState } from 'react'
import { useForm, SearchForm } from 'form-render'
import { columns, schema } from './config'
import { Flex, Button, Table } from 'antd'
import * as api from './api'
import { IItemResponse } from './typing'
import ModalCreateItem from './ModalCreateItem'

type UserManageProps = {}

const UserManage: React.FC<UserManageProps> = () => {
  const form = useForm()
  const [list, setList] = useState<IItemResponse[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend')
  // 查询
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
  const onSearch = () => {
    // 查询的时候重置页码
    setPageNum(1)
    fetchList()
  }
  // 初次查询，或者依赖变化时查询
  useEffect(() => {
    fetchList()
    // 页码变化、排序变化时重新查询
  }, [pageNum, pageSize, sortField, sortOrder])

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const refModalCreateItem = React.useRef<any>()
  const createItem = () => {
    console.log('createItem')
    refModalCreateItem.current.open()
  }
  const deleteItem = (ids: any[]) => {
    console.log(ids, 'deleteRecord')
  }
  return (
    <div>
      {/* searchOnMount不开启，因为useEffect已经请求了 */}
      <SearchForm searchOnMount={false} schema={schema} form={form} column={3} labelWidth={100} onSearch={onSearch} />
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
      <Table
        columns={columns}
        dataSource={list}
        rowKey='id'
        onChange={(pagination, _, sorter) => {
          console.log('onChange')
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
        }}
        pagination={{
          total,
          // 显示总数
          showTotal: () => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize,
          current: pageNum,
        }}
        scroll={{ x: 1300 }}
      />
      <ModalCreateItem ref={refModalCreateItem} />
    </div>
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
