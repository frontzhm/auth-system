import request from "@/utils/request";
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/user/userList', {
    method: 'GET',
    params,
  });
}
export function apiUpdate(params: IUpdateParams) {
  return request('/api/user/update', {
    method: 'POST',
    data: params,
  });
}
export function apiDelete(params: any) {
  return request('/api/user/delete', {
    method: 'POST',
    data: params,
  });
}


export function apiQueryDetail(params: any) {
  return request('/api/user/detail', {
    method: 'GET',
    params,
  });
}
