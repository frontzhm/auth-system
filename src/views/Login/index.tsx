import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input } from 'antd'

type FieldType = {
  username?: string
  password?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const Login: React.FC = () => (
  <Form
    name='basic'
    labelAlign='right'
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600, marginTop: 50 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete='off'
  >
    <Form.Item<FieldType> label='用户名' name='username' rules={[{ required: true, message: '请输入用户名!' }]}>
      <Input />
    </Form.Item>

    <Form.Item<FieldType> label='密码' name='password' rules={[{ required: true, message: '请输入密码' }]}>
      <Input.Password />
    </Form.Item>

    <Form.Item label={null}>
      <Button type='primary' htmlType='submit'>
        登陆
      </Button>
    </Form.Item>
  </Form>
)

export default Login
