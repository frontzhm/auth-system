import request from "@/utils/request";
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/dept/deptList', {
    method: 'GET',
    params,
  });
}

export function apiUpdate(params: IUpdateParams) {
  return request('/api/dept/update', {
    method: 'POST',
    data: params,
  });
}
export function apiDelete(ids: string[]) {
  return request('/api/dept/delete', {
    method: 'POST',
    data: { ids },
  });
}

