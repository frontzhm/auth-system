import React from 'react'
import type { FormProps } from 'antd'
import { Button, Form, Input, message } from 'antd'
import api from './service'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  username?: string
  password?: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const token = await api.apiLogin(values)
    // 登陆成功后将 token 存储到 localStorage
    localStorage.setItem('token', token)
    // 提示登陆成功
    message.success('登陆成功')
    // callback 用于登陆成功后跳转到之前的页面 全网址
    const callback = new URLSearchParams(window.location.search).get('callback')
    // 替换当前路由 去首页 这样用户就不能回到登陆页
    callback ? (location.href = callback) : navigate('/')
  }

  return (
    <Form
      name='basic'
      labelAlign='right'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 50 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
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
}

export default Login
