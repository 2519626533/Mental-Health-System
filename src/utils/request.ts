import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  withCredentials: true,
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})
// 响应拦截器
instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default instance
