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
      updateForm: refModalCreateItem.current?.form,
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
