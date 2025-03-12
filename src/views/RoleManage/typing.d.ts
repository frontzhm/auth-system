// 查询请求的参数类型
export type IQueryParams = {
  roleName?: string;
}
// 查询请求的formData类型  这里和IQueryParams一样 
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string;
  roleName: string;
  createTime: string;
  authCodes: string[]
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  updateTime: string;
}

// 新增请求的formData类型
export type ICreateFormData = {
  roleName: string;
  authCodes: string[];
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string;
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData