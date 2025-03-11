import { useEffect, useState } from 'react'

export function useQuery({ form, api }: { form: any, api: any }) {
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