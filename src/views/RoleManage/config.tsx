import { TableColumnsType } from 'antd'
import { IItemTable } from './typing'
import { Button, Popconfirm, Flex } from 'antd'
import { IItemResponse } from './typing'
import dayjs from 'dayjs'

// 查询表单的schema
export const schemaQuery = {
  type: 'object',
  displayType: 'row',
  properties: {
    roleName: {
      // 标签名
      title: '角色名称',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入角色名称',
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
    { title: '角色ID', dataIndex: 'id', width: 150 },
    { title: '角色名称', dataIndex: 'roleName', width: 150 },
    { title: '角色编码', dataIndex: 'roleCode', width: 150 },
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
      title: '操作',
      key: 'action',
      render: (record: IItemResponse) => (
        <Flex>
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

    roleName: {
      title: '角色名称',
      type: 'string',
      widget: 'input',
      required: true,
      props: {
        placeholder: '请输入角色名称',
      },
    },
    roleCode: {
      title: '角色编码',
      type: 'string',
      widget: 'input',
      required: true,
      props: {
        placeholder: '请输入角色编码',
      },
    },
    authCodes: {
      title: '选择权限',
      type: 'array',
      widget: 'treeSelect',
      required: true,
      // treeData是树形选择器的数据, 这里是空数组。
      // multiple是是否多选，treeCheckable是是否显示多选框, treeDefaultExpandAll是是否默认展开所有节点
      props: { treeData: [], multiple: true, treeCheckable: true, treeDefaultExpandAll: true },
    },
  },
}
