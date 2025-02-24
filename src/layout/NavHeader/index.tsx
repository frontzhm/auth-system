import React from 'react'
import { useState } from 'react'
import { Breadcrumb, Dropdown, Switch } from 'antd'
import type { MenuProps } from 'antd'
import style from './index.module.less'
import { DownOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { useUserStore } from '@/store/user'

type NavHeaderProps = {}
const NavHeader: React.FC<NavHeaderProps> = () => {
  const { user, resetUser } = useUserStore((state) => ({ user: state.user, resetUser: state.resetUser }))

  const [items, setItems] = useState([
    {
      title: 'Home',
    },
    {
      title: '工作台',
    },
  ])
  const menuItems: MenuProps['items'] = [
    {
      label: '退出登录',
      key: '1',
      onClick: () => {
        resetUser()
        localStorage.setItem('token', '')
        location.href = '/login?callback=' + encodeURIComponent(location.href)
      },
    },
  ]

  return (
    <div className={style.header}>
      <div className={style.left}>
        <Breadcrumb className={style.breadcrumb} items={items} />
      </div>
      <div className={style.right}>
        <Switch
          checkedChildren='默认'
          unCheckedChildren='暗黑'
          defaultChecked
          onChange={(checked) => {
            console.log(`switch to ${checked ? 'dark' : 'light'}`)
          }}
        />
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <a className={style.dropMenu} onClick={(e) => e.preventDefault()}>
            <Space>
              {user.name}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  )
}

NavHeader.displayName = 'NavHeader'
export default NavHeader
