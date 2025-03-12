// 查询请求的参数类型
export type IQueryParams = {
  menuName?: string;
  menuState?: number;
}
// 查询请求的formData类型  这里和IQueryParams一样 
export type IQueryFormData = IQueryParams

// 表格每条数据类型
export type IItemTable = {
  id: string;
  menuName: string;
  menuType: number;
  menuCode: string;
  path: string;
  createTime: string;
  orderBy: number;
  menuState: number;
  icon: string;
  parentId: string;
  component: string;
  children: IItemTable[];
}

// 查询返回的每条数据类型
export type IItemResponse = IItemTable & {
  updateTime: string;
}

// 新增请求的formData类型
export type ICreateFormData = {
  parentId?: string;
  menuType: number;
  menuName: string;
  icon?: string;
  path?: string;
  component?: string;
  menuCode?: string;
  orderBy?: number;
  menuState: number;

}

// 编辑请求的formData类型
export type IUpdateFormData = ICreateFormData & {
  id: string;
}

// 编辑请求的参数类型 这里和IUpdateFormData一样
export type IUpdateParams = IUpdateFormData