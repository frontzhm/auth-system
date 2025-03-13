import React, { useEffect, useMemo } from 'react'
import { Layout } from 'antd'
import { Menu } from 'antd'
import { MenuProps } from 'antd'
import { useState } from 'react'
import style from './index.module.less'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { transformPermissionsToMenus } from './transformPermissionsToMenus'

type SideMenuProps = {}
const SideMenu: React.FC<SideMenuProps> = () => {
  const { Sider } = Layout
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['dashboard'])
  const [openKeys, setOpenKeys] = useState<string[]>(['system-manage'])
  // 获取路由
  const { pathname } = useLocation()
  useEffect(() => {
    // 路径改变时，设置选中的菜单项
    const key = pathname.split('/')[1]
    setSelectedKeys([key || 'dashboard'])
  }, [pathname])

  const navigate = useNavigate()
  const onClickMenu: MenuProps['onClick'] = ({ key }) => {
    navigate(`/${key}`)
  }
  const user = useUserStore((state) => state.user)
  const items = useMemo(() => {
    return transformPermissionsToMenus(user.permissions)
  }, [user])

  const onOpenChange = (openKeys: string[]) => {
    setOpenKeys(openKeys)
  }

  return (
    <Sider className={style.sideMenu} trigger={null} collapsible collapsed={collapsed}>
      <div className={style.sideBox}>
        <div>
          <div className={style.logo}>
            <img src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' alt='logo' />
          </div>
          <Menu
            mode='inline'
            items={items}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={onClickMenu}
          />
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
