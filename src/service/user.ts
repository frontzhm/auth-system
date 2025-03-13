import request from "@/utils/request";

export type IPermission = {
  parentId: string,
  id: string,
  menuName?: string,
  menuType: number,
  authCode: string,
  path?: string,
  children?: IPermission[]
}

export type IUserInfo = {
  id?: number
  name: string
  email: string
  role?: string
  _id?: string
  deptId?: string
  state?: number
  roleList?: string[]
  createId?: string
  deptName?: string
  mobile?: string
  job?: string
  avatar?: string
  introduction?: string
  username?: string
  roles: string[],
  permissions: IPermission[]
  pathToButtonsMap?: Record<string, string[]>
  [key: string]: any

}

export const apiGetUser = (): Promise<IUserInfo> => {
  return request.get("/api/userInfo")
}
export default {
  apiGetUser
}