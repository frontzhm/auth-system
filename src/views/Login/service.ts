import request from "@/utils/request";

export const apiLogin = (data: { username?: string; password?: string }): Promise<string> => {
  // @ts-ignore
  return request.post<{ token: string }>("/api/login", data, { isHideError: true }).then(response => response.token || '');
}
export default { apiLogin }