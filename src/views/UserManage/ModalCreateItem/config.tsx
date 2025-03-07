import { ROLE_OPTIONS, STATE_TYPE_OPTIONS } from '../config'
export const schema = {
  type: 'object',
  // label和input放在一行
  displayType: 'row',
  properties: {
    // id是为了编辑时传递给后端的字段
    id: {
      type: 'number',
      hidden: true,
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
