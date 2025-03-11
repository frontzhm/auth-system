// 查询请求的参数类型
export type IQueryParams = {
  deptName?: string;
}
// 查询请求的formData类型  这里和IQueryParams一样 
export type IQueryFormData = IQueryParams


// 表格每条数据类型
export type IItemTable = {
  id: string;
  deptName: string;
  master: string;
  parentId: string;
  createTime: string;
  updateTime: string;
  children: IItemTable[];
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  createId: number;
  __v: number;
}

// 新增请求的formData类型
export type ICreateFormData = {
  deptName: string;
  master: string;
  parentId?: string;
}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string;
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData