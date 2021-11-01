import $store from '@/store'
import Axios from 'axios'
import code from './code'
import { ElMessage } from 'element-plus'
import $router from '@/router'
// import { codeMsgEn, codeMsgCh } from '@/assets/api/codeMsg'

Axios.defaults.baseURL = ''
Axios.defaults.timeout = 20000
Axios.defaults.withCredentials = true
Axios.defaults.params = {}
Axios.defaults.validateStatus = () => true
Axios.defaults.headers = {}

// 请求拦截器
Axios.interceptors.request.use((config) => {
  const $state = $store.state
  const token = $state.token
  config.headers.common = {}
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  if (token) {
    config.headers['X-Access-Token'] = token
  }
  return config
}, error => Promise.reject(error))

// 响应拦截器
Axios.interceptors.response.use((response) => {
  // console.log('response xhr', JSON.stringify(response))
  // console.log('response xhr', response)
  // console.log('response', JSON.stringify(response.data))
  if (response.status !== 200) {
    ElMessage.error(response.statusText)
    return response
  }
  const data = response.data || {}
  const msg = data.message || data.msg
  // console.log('code', data.code, data.code === code.SUCCESS, response, response.data)
  // console.log('code', data.code, data.code === code.SUCCESS)
  if (response.config.url.indexOf('.json') !== -1) {
    return data
  }
  if (data.code === code.TOKENERR || data.code === code.EXPIRED) { // token失效
    $store.commit('setToken', '')
    $router.push({ name: 'login' })
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  }
  if (data.code !== code.SUCCESS && !data.isSuccess) {
    // const isCh = store.state.lang.lang === 'zh-cn'
    // let code = `${data.code}`
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  }
  return data
}, (error) => {
  console.log(error)
  ElMessage.error('网络错误')
  // Message.error('网络出错')
  return Promise.reject(error)
})

export default Axios
