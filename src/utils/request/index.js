import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Qs from 'qs'

const BASE_URL = process.env.VUE_APP_BASE_API
// create an axios instance
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
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
      config.headers['X-Token'] = getToken()
    }
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
  response => {
    const contentType = response.headers['content-type']
    if (contentType && !contentType.toLowerCase().includes('json')) {
      return response
    }

    let res = response.data
    if (response.config.responseType === 'arraybuffer') {
      res = JSON.parse(Buffer.from(res).toString('utf8'))
    }

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      if (res.code === 2) {
        MessageBox.confirm(res.message, '提示消息', {
          confirmButtonText: '确定',
          type: 'error',
          center: true
        }).then(() => {
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 40001: 未认证; 40002: 非法token; 40003: token超时;
      if (res.code === 40001 || res.code === 40002 || res.code === 40003) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log(error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

/* 下载方法 */
function downFile(blob, fileName) {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob) // 创建下载的链接
    link.download = fileName // 下载后文件名
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click() // 点击下载
    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
    document.body.removeChild(link) // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  }
}

export function downloadFile(path, requestData) {
  // 响应类型：arraybuffer, blob
  return service.request({
    url: path,
    method: 'post',
    data: requestData,
    responseType: 'arraybuffer'
  }).then(resp => {
    const headers = resp.headers
    const contentType = headers['content-type']
    const blob = new Blob([resp.data], { type: contentType })
    const contentDisposition = headers['content-disposition']
    const fileName = contentDisposition && window.decodeURI(contentDisposition.split('=')[1]) || 'unknown'
    downFile(blob, fileName)
  })
}

export function get(url, params) {
  return service.request({
    url: url,
    method: 'get',
    params: params
  })
}

export function post(url, params) {
  return service.request({
    url: url,
    method: 'post',
    data: Qs.stringify(params)
  })
}

export function postJson(url, data) {
  return service.request({
    url: url,
    method: 'post',
    data: data
  })
}

