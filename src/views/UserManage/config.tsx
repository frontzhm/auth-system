import { Button, TableColumnsType } from 'antd'
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
    status: {
      title: '状态',
      type: 'string',
      widget: 'select',
      props: {
        placeholder: '请选择状态',
        options: [
          { label: '在职', value: 1 },
          { label: '离职', value: 2 },
        ],
      },
    },
  },
}
export const columns: TableColumnsType<any> = [
  { title: '用户ID', dataIndex: 'id', ellipsis: true, width: 100 },
  { title: '用户名', dataIndex: 'username' },
  { title: '用户邮箱', dataIndex: 'email' },
  { title: '用户角色', dataIndex: 'roleShow' },
  { title: '用户状态', dataIndex: 'statusShow' },
  { title: '注册时间', dataIndex: 'createTime', sorter: true },
  { title: '最后登录时间', dataIndex: 'lastLoginTime' },
  {
    title: '操作',
    // dataIndex: 'operation',
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
