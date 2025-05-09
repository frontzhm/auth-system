import type { ProFormColumnsType } from '@ant-design/pro-components'

export const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true,
  },
  processing: {
    text: '解决中',
    status: 'Processing',
  },
}

export type DataItem = {
  name: string
  state: string
}

export const columns: ProFormColumnsType<DataItem>[][] = [
  [
    {
      title: '标题',
      dataIndex: 'title',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      width: 'm',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum,
      width: 'm',
    },
  ],
  [
    {
      title: '标签',
      dataIndex: 'labels',
      width: 'm',
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createName',
      valueType: 'date',
    },
    {
      title: '分组',
      valueType: 'group',
      columns: [
        {
          title: '状态',
          dataIndex: 'groupState',
          valueType: 'select',
          width: 'xs',
          valueEnum,
        },
        {
          title: '标题',
          width: 'md',
          dataIndex: 'groupTitle',
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
        },
      ],
    },
  ],
  [
    {
      title: '列表',
      valueType: 'formList',
      dataIndex: 'list',
      initialValue: [{ state: 'all', title: '标题' }],
      columns: [
        {
          valueType: 'group',
          columns: [
            {
              title: '状态',
              dataIndex: 'state',
              valueType: 'select',
              width: 'xs',
              valueEnum,
            },
            {
              title: '标题',
              dataIndex: 'title',
              formItemProps: {
                rules: [
                  {
                    required: true,
                    message: '此项为必填项',
                  },
                ],
              },
              width: 'm',
            },
          ],
        },
      ],
    },
    {
      title: 'FormSet',
      valueType: 'formSet',
      dataIndex: 'formSet',
      columns: [
        {
          title: '状态',
          dataIndex: 'groupState',
          valueType: 'select',
          width: 'xs',
          valueEnum,
        },
        {
          title: '标题',
          dataIndex: 'groupTitle',
          tooltip: '标题过长会自动收缩',
          formItemProps: {
            rules: [
              {
                required: true,
                message: '此项为必填项',
              },
            ],
          },
          width: 'm',
        },
      ],
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        }
      },
    },
  ],
]
