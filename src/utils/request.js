import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    config.url = `/api${config.url}`;
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async(response) => {
    const { data, message, success, code } = response.data // json
    if (success) {
      if (code === 10004) {
        Message({ type: 'warning', message: 'Please change your password'})
      }
      return data
    } else {
      if (code === 10002) {
        Message({ type: 'warning', message: 'Please login again' })
        await store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error(message))
      } else {
        Message({ type: 'error', message })
        return Promise.reject(new Error(message))
      }
    }
  },
  async(error) => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'Please login again' })
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)

export default service
