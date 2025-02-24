import request from "@/utils/request";

export const apiLogin = (data: { username?: string; password?: string }): Promise<string> => {
  return request.post("/api/login", data, { isHideError: true }).then(data => data?.token || '');
}
export default { apiLogin }