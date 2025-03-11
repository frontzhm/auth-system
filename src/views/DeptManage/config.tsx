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
    id: {
      // 标签名
      title: '用户ID',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入用户ID',
      },
    },
    username: {
      title: '用户名',
      widget: 'input',
      type: 'string',
      props: {
        placeholder: '请输入用户名',
      },
    },
    state: {
      title: '状态',
      type: 'string',
      widget: 'select',
      props: {
        placeholder: '请选择状态',
        options: STATE_TYPE_OPTIONS,
      },
    },
  },
}
// 查询表格的columns
export const genColumns = ({
  updateItem,
  deleteItem,
}: {
  updateItem: (record: IItemResponse) => void
  deleteItem: (ids: string[]) => void
}) => {
  const columns: TableColumnsType<IItemTable> = [
    { title: '用户ID', dataIndex: 'id', ellipsis: true, width: 100 },
    { title: '用户名', dataIndex: 'username' },
    { title: '用户邮箱', dataIndex: 'email' },
    {
      title: '用户角色',
      dataIndex: 'role',
      render: (role: number) => {
        return ROLE_OPTIONS.find((item) => item.value === role)?.label || '--'
      },
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      render: (state: number) => {
        return STATE_TYPE_OPTIONS.find((item) => item.value === state)?.label || '--'
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      sorter: true,
      render: (createTime: string) => {
        return dayjs(createTime).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      sorter: true,
      render: (lastLoginTime: string) => {
        return dayjs(lastLoginTime).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (record: IItemResponse) => (
        <Flex>
          <Button type='primary' onClick={() => updateItem(record)}>
            编辑
          </Button>
          <Popconfirm title='确定删除吗？' onConfirm={() => deleteItem([record?.id])}>
            <Button type='primary' danger style={{ marginLeft: 10 }}>
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
    username: {
      title: '用户名称',
      type: 'string',
      required: true,
      placeholder: '请输入用户名',
      rules: [{ pattern: '^.{3,20}$', message: '用户名需3-20位字符' }],
    },
    email: {
      title: '用户邮箱',
      type: 'string',
      format: 'email',
      required: true,
      placeholder: 'example@domain.com',
    },
    phone: {
      title: '手机号',
      type: 'string',
      required: true,
      pattern: '^1[3-9]\\d{9}$',
      placeholder: '请输入11位手机号',
    },
    deptId: {
      title: '部门',
      type: 'array',
      widget: 'treeSelect',
      required: false,
      props: {
        treeData: [
          { title: '总部', value: '0', children: [{ title: '研发部', value: '0-0' }] },
          { title: '分部', value: '1', children: [{ title: '销售部', value: '1-0' }] },
        ],
      },
    },
    job: {
      title: '岗位',
      type: 'string',
      required: false,
      placeholder: '请输入岗位名称',
    },
    role: {
      title: '角色',
      type: 'number',
      widget: 'select',
      required: true,
      props: {
        options: ROLE_OPTIONS,
      },
    },
    state: {
      title: '状态',
      type: 'number',
      widget: 'select',
      required: true,
      props: {
        options: STATE_TYPE_OPTIONS,
      },
    },
    userImg: {
      title: '头像',
      type: 'string',
      widget: 'AvatarUpload',
      required: false,
    },
  },
}
