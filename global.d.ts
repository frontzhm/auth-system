declare type G_IResponse<T = any> = {
  data: T;
  code: number;
  message: string;
  success: boolean;
}