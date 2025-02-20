import React, { Children } from 'react'
import { Layout } from 'antd'
import { Menu, theme } from 'antd'
import { UserOutlined, VideoCameraOutlined, UploadOutlined, DesktopOutlined, SettingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import style from './index.module.less'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

type SideMenuProps = {}
const SideMenu: React.FC<SideMenuProps> = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken()
  const { Sider } = Layout
  const [collapsed, setCollapsed] = useState(false)
  const items = [
    {
      label: '工作台',
      icon: <DesktopOutlined />,
      key: '1',
    },
    {
      label: '系统管理',
      icon: <SettingOutlined />,
      key: '2',
      children: [
        {
          label: '用户管理',
          icon: <UserOutlined />,
          key: '2-1',
        },
        {
          label: '角色管理',
          icon: <VideoCameraOutlined />,
          key: '2-2',
        },
      ],
    },
  ]

  return (
    <Sider className={style.sideMenu} trigger={null} collapsible collapsed={collapsed}>
      <div className={style.sideBox}>
        <div>
          <div className={style.logo}>
            <img src='https://uac.test.xdf.cn/static/logo.dbb35e10.svg' alt='logo' />
          </div>
          <Menu mode='inline' defaultSelectedKeys={['1']} items={items} />
        </div>
        <div
          onClick={() => {
            setCollapsed(!collapsed)
          }}
          className={style.footer}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </Sider>
  )
}

SideMenu.displayName = 'SideMenu'
export default SideMenu
