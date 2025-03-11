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
