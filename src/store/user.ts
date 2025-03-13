import { create } from 'zustand'
import { apiGetUser, type IUserInfo, type IPermission } from '@/service/user'

type IUserState = {
  user: IUserInfo

}
type IUserAction = {
  setUser: (user: IUserInfo) => void
  resetUser: () => void
  fetchUser: () => Promise<void>
}
type IUserStore = IUserState & IUserAction


// 初始状态
const userInit: IUserInfo = {
  name: '',
  email: '',
  roles: [],
  permissions: [],
  pathToButtonsMap: {},
}

// 创建 store
export const useUserStore = create<IUserStore>((set) => ({
  user: { ...userInit },
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: userInit }),
  fetchUser: async () => {
    try {
      const res = await apiGetUser()
      console.log('fetchUser:', res)
      res.pathToButtonsMap = convertMenuToButtonMap(res.permissions)
      set({ user: res })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  },
}))

/**
 * 使用的时候
 * import { useUserStore } from '@/store/user'
 * import { shallow } from 'zustand/shallow'
 * // 只订阅 user 状态
 * const user = useUserStore((state) => state.user)
 * // 只订阅 setUser 方法
 * const setUser = useUserStore((state) => state.setUser)
 * // 订阅多个状态，使用 shallow 避免不必要的重渲染
 * const { user, setUser } = useUserStore((state) => ({
 *   user: state.user,
 *   setUser: state.setUser,
 * }))
 * // 订阅所有状态
 * const state = useUserStore()
 */


/**
 * 将菜单数据转换为路径-按钮权限码的映射
 * @param menuList 原始菜单数据
 * @returns 形如 { '/user-manage': ['user-manage@add', 'user-manage@delete'] } 的映射
 */
function convertMenuToButtonMap(menuList: IPermission[]): Record<string, string[]> {
  // Step 1: 构建 ID -> 有效路径的映射表
  const idToPathMap: Record<number | string, string> = {};

  const buildIdToPath = (items: IPermission[]) => {
    items.forEach((item) => {
      // 只处理菜单项（menuType=1）且路径有效的情况
      if (item.menuType === 1 && item.path && item.path.trim() !== '') {
        idToPathMap[item.id] = item.path;
      }
      // 递归处理子菜单
      if (item.children) buildIdToPath(item.children);
    });
  };

  // Step 2: 收集按钮权限码到对应路径下
  const pathToButtonsMap: Record<string, string[]> = {};

  const collectButtons = (items: IPermission[]) => {
    items.forEach((item) => {
      if (item.menuType === 2) {
        // 查找按钮的父级路径
        const parentPath = idToPathMap[item.parentId!];
        if (parentPath) {
          // 将按钮权限码添加到对应路径下，如果路径不存在则创建
          if (!pathToButtonsMap[parentPath]) pathToButtonsMap[parentPath] = [];
          pathToButtonsMap[parentPath].push(item.authCode);
        }
      }
      // 递归处理子菜单
      if (item.children) collectButtons(item.children);
    });
  };

  // 执行转换
  buildIdToPath(menuList);
  collectButtons(menuList);
  return pathToButtonsMap;
}
