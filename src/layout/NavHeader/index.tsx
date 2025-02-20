import React from 'react'
import { useState } from 'react'
import { Breadcrumb, Dropdown, Switch } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import style from './index.module.less'
import { DownOutlined } from '@ant-design/icons'
import { Space } from 'antd'

type NavHeaderProps = {
  isOnlyIcon?: boolean
  onToggle?: () => void
}
const NavHeader: React.FC<NavHeaderProps> = ({ isOnlyIcon }) => {
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
      label: `邮箱：Jack@x.cn`,
      key: '0',
    },
    {
      label: '退出登录',
      key: '1',
    },
  ]

  return (
    <div className={style.header}>
      <div className={style.left}>
        {isOnlyIcon ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
              Jack
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
