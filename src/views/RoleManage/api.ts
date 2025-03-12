import request from "@/utils/request";
import { IQueryParams, IItemResponse, IUpdateParams } from './typing'

export function apiQueryList(params: G_TableRequestParams<IQueryParams>): Promise<G_TableResponseData<IItemResponse>> {
  return request('/api/role/roleList', {
    method: 'GET',
    params,
  });
}

export function apiUpdate(params: IUpdateParams) {
  return request('/api/role/update', {
    method: 'POST',
    data: params,
  });
}
export function apiDelete(ids: string[]) {
  return request('/api/role/delete', {
    method: 'POST',
    data: { ids },
  });
}

