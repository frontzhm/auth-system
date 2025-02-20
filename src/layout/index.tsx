import React from 'react'

import { Layout, theme } from 'antd'
import { Watermark } from 'antd'
import { Outlet } from 'react-router-dom'
import NavHeader from './NavHeader'
import SideMenu from './SideMenu'

const { Content } = Layout

const CusLayout: React.FC = () => {
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
              margin: 15,
              padding: 20,
              minHeight: 'calc(100vh - 90px)',
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
