declare type G_IResponse<T = any> = {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

declare type G_TableResponseData<T = any> = {
  list: T[];
  total: number;
}
declare type G_TableResponse<T = any> = G_IResponse<G_TableResponseData<T>>
declare type G_PageAndSort = {
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}


declare type G_TableRequestParams<T> = G_PageAndSort & T