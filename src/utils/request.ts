import axios from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from '@/utils/loading'

// 扩展 AxiosRequestConfig 接口 用于自定义配置
declare module 'axios' {
  interface AxiosRequestConfig {
    isHideLoading?: boolean
    isHideError?: boolean
  }
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
    (!config.isHideLoading) && showLoading()
    // 添加通用请求头，例如 token
    const token = localStorage.getItem('token')
    if (token) {
      // Bearer是JWT的认证头部信息，后面加一个空格，然后加上token，这样后端就可以通过请求头部信息获取到token
      config.headers.Authorization = `Bearer ${token}`
      config.headers.authorization = `${token}`
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
      if (response.config.isHideError) {
        return Promise.reject({ code, msg, data })
      }
      switch (code) {
        case 401:
          message.error('请重新登录')
          if (location.pathname !== '/login') {
            location.href = '/login?callback=' + encodeURIComponent(location.href)
          }
          break

        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(msg || '请求失败，请稍后重试')
      }
      return Promise.reject(data)
    }
    return data.data // 直接返回响应数据，简化后续处理
  },
  (error) => {
    // 关闭加载状态
    hideLoading()

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {

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
