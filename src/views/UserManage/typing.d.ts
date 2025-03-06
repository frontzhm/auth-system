// 查询请求的参数类型
export type IQueryParams = {
  userId?: string;
  username?: string;
  state?: boolean;
}
// 查询请求的formData类型  这里和IQueryParams一样
export type IQueryFormData = IQueryParams



// 表格每条数据类型
export type IItemTable = {
  id: number;
  username: string;
  email: string;
  role: string;
  state: string;
  createTime: string;
  lastLoginTime: string;
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  createId: number;
  deptId: string;
  deptName: string;
  roleList: string;
  userImg: string;
}