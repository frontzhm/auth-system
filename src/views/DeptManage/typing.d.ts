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
  id: string;
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

// 新增请求的formData类型
export type ICreateFormData = {
  username: string;
  email: string;
  phone?: string;
  deptId?: string;
  job?: string;
  role: number;
  state: string;
  userImg?: string;
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string;
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData