/**
 * AuthButton
 * @description 该组件用于权限按钮的展示主要通过是auth属性实现，
 * 如果没有auth属性则跟普通按钮一样展示，如果有auth属性，那么根据用户拥有的按钮权限列表有没有该auth属性来展示或者隐藏按钮
 * @param {string} auth - 权限标识
 * @param {React.ReactNode} children - 按钮内容
 * @returns {React.FunctionComponent}
 * @example
 * import AuthButton from '@/components/AuthButton'
 * <AuthButton>查看</AuthButton> 这个按钮不受权限控制,就是一个Button
 * <AuthButton auth="user@add">添加用户</AuthButton> 这个按钮需要用户拥有user@add权限才能看到
 * @version 1.0.0
 */
import { Button } from 'antd'
import React from 'react'
import { useUserStore } from '@/store/user'

type AuthButtonProps = {
  auth?: string
  [key: string]: any
}
const AuthButton: React.FC<AuthButtonProps> = ({ authCode, ...otherProps }) => {
  if (!authCode) return <Button {...otherProps} />
  const user = useUserStore((state) => state.user)
  // 获取用户按钮权限列表
  const buttonAuthCodes = user.pathToButtonsMap ? [window.location.pathname] : []
  if (buttonAuthCodes.includes(authCode)) {
    return <Button {...otherProps} />
  }
  return null
}

AuthButton.displayName = 'AuthButton'
export default AuthButton
