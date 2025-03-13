import * as Icon from '@ant-design/icons'
import React from 'react'
import type { MenuProps } from 'antd'

type IPermission = {
  id: string
  menuName?: string
  menuType: number
  path?: string
  children?: IPermission[]
  icon?: string
}
type MenuItem = Required<MenuProps>['items'][number]
/**
 * 转换菜单结构
 * @param originalMenu 原始菜单数据
 * @returns 转换后的菜单结构
 */
export const transformPermissionsToMenus = (originalMenu: IPermission[]): MenuItem[] => {
  const MENU = 1
  return originalMenu
    .filter((item) => item.menuType === MENU) // 只处理 menuType=1 的菜单项
    .map((item: any) => {
      // 判断是否有子菜单，如果有则递归处理
      const hasChildren =
        item.children && item.children.length && item.children.some((child: any) => child.menuType === MENU)
      const icon = item.icon ? (Icon as any)[item.icon] : null
      return {
        label: item.menuName,
        key: item.authCode,
        icon: icon ? React.createElement(icon) : null, // 转换为图标组件
        ...(hasChildren && { children: transformPermissionsToMenus(item.children) }),
      }
    })
}
