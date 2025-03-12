import { TableColumnsType } from 'antd'
import { IItemTable } from './typing'
import { Button, Popconfirm, Flex } from 'antd'
import { IItemResponse } from './typing'
import dayjs from 'dayjs'

// 菜单类型 1菜单 2按钮 3独立页面
export const MENU_TYPE = {
  MENU: 1,
  BUTTON: 2,
}

export const MENU_TYPE_OPTIONS = [
  { label: '菜单', value: MENU_TYPE.MENU },
  { label: '按钮', value: MENU_TYPE.BUTTON },
]

export const MENU_STATE = {
  ENABLE: 1,
  DISABLE: 0,
}
export const MENU_STATE_OPTIONS = [
  { label: '启用', value: MENU_STATE.ENABLE },
  { label: '禁用', value: MENU_STATE.DISABLE },
]
// 查询表单的schema
export const schemaQuery = {
  type: 'object',
  displayType: 'row',
  properties: {
    menuName: {
      // 标签名
      title: '菜单名称',
      // 字段类型
      type: 'string',
      // widget是字段的类型，input是输入框
      widget: 'input',
      // 字段的props
      props: {
        placeholder: '请输入菜单名称',
      },
    },
    menuState: {
      // 标签名
      title: '菜单状态',
      // widget是字段的类型，input是输入框
      widget: 'select',
      // 字段的props
      props: {
        options: MENU_STATE_OPTIONS,
        placeholder: '请选择菜单状态',
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
    { title: '菜单名称', dataIndex: 'menuName', width: 150 },
    { title: '图表', dataIndex: 'icon', width: 100 },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      width: 100,
      render: (menuType: number) => {
        return MENU_TYPE_OPTIONS.find((item) => item.value === menuType)?.label
      },
    },
    { title: '权限标识', dataIndex: 'authCode', width: 100 },
    { title: '路由地址', dataIndex: 'path', width: 100 },
    { title: '组件名称', dataIndex: 'component', width: 100 },
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
          {record.menuType === MENU_TYPE.MENU && (
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
              新增子菜单
            </Button>
          )}
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

const menuSchema = {
  menuName: {
    title: '菜单名称',
    type: 'string',
    required: true,
    placeholder: '请输入菜单名称',
    hidden: '{{formData.menuType === 2}}',
  },
  icon: {
    title: '菜单图标',
    type: 'string',
    required: false,
    placeholder: '请输入图标',
    hidden: '{{formData.menuType === 2}}',
  },
  path: {
    title: '路由地址',
    type: 'string',
    required: false,
    placeholder: '请输入路由地址',
    dependencies: ['menuType'],
    hidden: '{{formData.menuType === 2 }}',
  },
  orderBy: {
    title: '排序',
    type: 'number',
    required: false,
    placeholder: '请输入排序',
    hidden: '{{formData.menuType === 2}}',
  },
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
      title: '父级菜单',
      type: 'array',
      widget: 'treeSelect',
      required: false,
      // treeData是树形选择器的数据, 这里是空数组
      props: { treeData: [] },
    },
    menuType: {
      title: '菜单类型',
      type: 'number',
      widget: 'radio',
      required: true,
      props: {
        options: MENU_TYPE_OPTIONS,
      },
      default: MENU_TYPE.MENU,
    },
    authCode: {
      title: '权限标识',
      type: 'string',
      required: false,
      placeholder: '请输入权限标识',
    },
    ...menuSchema,

    menuState: {
      title: '权限状态',
      type: 'number',
      widget: 'radio',
      required: true,
      props: {
        options: MENU_STATE_OPTIONS,
      },
      default: MENU_STATE.ENABLE,
    },
  },
}
