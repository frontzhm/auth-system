import { Button, TableColumnsType } from 'antd'
import { IItemTable } from './typing.d'
import dayjs from 'dayjs'
const STATE_TYPE = {
  WORK: 1,
  LEAVE: 2,
}
const STATE_TYPE_OPTIONS = [
  { label: '在职', value: STATE_TYPE.WORK },
  { label: '离职', value: STATE_TYPE.LEAVE },
]

const ROLE = {
  ADMIN: 1,
  USER: 2,
}
const ROLE_OPTIONS = [
  { label: '管理员', value: ROLE.ADMIN },
  { label: '用户', value: ROLE.USER },
]
export const schema = {
  type: 'object',
  displayType: 'row',
  properties: {
    // userId是字段名，也是字段的key
    userId: {
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

export const columns: TableColumnsType<IItemTable> = [
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
    render: (record: any) => (
      <>
        <Button type='primary' onClick={() => {}}>
          编辑
        </Button>
        <Button
          type='primary'
          onClick={() => {
            // deleteRecord([record.id])
          }}
          danger
          style={{ marginLeft: 10 }}
        >
          删除
        </Button>
      </>
    ),
  },
]
