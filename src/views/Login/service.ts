import request from "@/utils/request";

export const apiLogin = (data: { username?: string; password?: string }): Promise<string> => {
  return request.post("/api/login", data).then(res => res.data.token);
}
export default { apiLogin }