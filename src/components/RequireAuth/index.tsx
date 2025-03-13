// src/components/RequireAuth.tsx
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/user'

interface Props {
  children: React.ReactNode
}

const RequireAuth = ({ children }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    // 1. 检查用户信息是不是已经返回了，因为在 App.tsx 中已经调用了 fetchUser 方法，所以这里不需要再次调用
    // 没有这个判断，会导致在用户信息返回之前，就跳转到 403 页面
    if (!user?.name) {
      return
    }
    // 如果用户角色有 admin，直接返回，因为这里默认 admin 有所有权限，不需要再检查权限
    // 如果不是这样，可以根据实际情况，修改这里的逻辑，也可以去掉这个判断
    if (user.roles.includes('admin')) {
      return
    }

    // 2. 检查权限（根据当前菜单路径，来看下在不在权限的路径里）
    const permissions = user.permissions
    // 获取所有菜单路径
    const menuPaths: string[] = (() => {
      const paths: string[] = []
      // 递归查找所有菜单路径
      const findPaths = (menus: any[]) => {
        menus.forEach((menu) => {
          // 有 path 属性的，就是菜单路径
          menu.path && paths.push(menu.path)
          // 递归查找子菜单路径
          if (menu.children) {
            findPaths(menu.children)
          }
        })
      }
      findPaths(permissions)
      return paths
    })()
    // 如果当前路径不在菜单路径里，就跳转到 403 页面
    if (!menuPaths.includes(location.pathname)) {
      navigate('/403')
    }
  }, [user, navigate, location])
  // 3. 返回子组件
  return <>{children}</>
}

RequireAuth.displayName = 'RequireAuth'

export default RequireAuth
