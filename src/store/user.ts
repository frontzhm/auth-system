import { create } from 'zustand'
import { apiGetUser, type IUserInfo } from '@/service/user'

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
}

// 创建 store
export const useUserStore = create<IUserStore>((set) => ({
  user: { ...userInit },
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: userInit }),
  fetchUser: async () => {
    try {
      const res = await apiGetUser()
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