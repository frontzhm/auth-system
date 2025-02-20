import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import { Watermark } from 'antd'
import { Outlet } from 'react-router-dom'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'

const { Header, Sider, Content } = Layout

const CusLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <SideMenu />
      <Layout>
        <NavHeader />
        <Watermark content='Watermark'>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Watermark>
      </Layout>
    </Layout>
  )
}

export default CusLayout
