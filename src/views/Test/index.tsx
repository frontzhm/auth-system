import type { FormInstance } from '@ant-design/pro-components'
import { BetaSchemaForm } from '@ant-design/pro-components'
import { message } from 'antd'
import { useRef } from 'react'
import { columns } from './config'
import type { DataItem } from './config'

export default () => {
  const formRef = useRef<FormInstance>()

  return (
    <BetaSchemaForm<DataItem>
      layoutType='StepsForm'
      steps={[
        {
          title: '第一步',
        },
        {
          title: '第二步',
        },
        {
          title: '第三步',
        },
      ]}
      onCurrentChange={(current) => {
        console.log('current: ', current)
      }}
      formRef={formRef}
      onFinish={async (values) => {
        return new Promise((resolve) => {
          console.log(values)
          message.success('提交成功')
          setTimeout(() => {
            resolve(true)
            formRef.current?.resetFields()
          }, 2000)
        })
      }}
      columns={columns}
    />
  )
}
