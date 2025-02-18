import axios from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from '@/utils/loading'
export type IResponse<T = any> = {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

const BASE_URL = import.meta.env.VITE_BASE_URL
// const BASE_URL = config.baseURL

// 创建 Axios 实例
export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  timeoutErrorMessage: '请求超时，请稍后重试',
  withCredentials: true, // 跨域请求时是否需要使用凭证
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 显示加载状态
    showLoading()
    // 添加通用请求头，例如 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // 请求错误时关闭加载状态
    hideLoading()
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 关闭加载状态
    hideLoading()
    console.log('response', response)
    const { data } = response
    const { success, code, message: msg } = data
    if (!success) {
      switch (code) {
        case 400:
          message.error('未授权，请登录')
          break
        case 404:
          message.error('请求资源未找到')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(msg || '请求失败，请稍后重试')
      }
      return Promise.reject(data)
    }
    return data // 直接返回响应数据，简化后续处理
  },
  (error) => {
    // 关闭加载状态
    hideLoading()

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请登录')
          break
        case 404:
          message.error('请求资源未找到')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error('请求失败，请稍后重试')
      }
    } else if (error.message.includes('timeout')) {
      message.error('请求超时，请稍后重试')
    } else {
      message.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  },
)

export default request
