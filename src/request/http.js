import axios from 'axios'
import { Message } from 'element-ui'

let baseURL = ''

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://172.16.20.193:8085'
} else if (process.env.NODE_ENV === 'debug') {
  baseURL = 'http://172.16.20.193:8085'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://172.16.20.193:8080'
}

// 请求超时时间
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(config => {
  return config
}, () => {
  Message.error({ message: '请求超时!' })
})

// 响应拦截器
axios.interceptors.response.use(response => {
  if (response.status && response.status === 200) {
    if (response.data && response.data.success && response.data.message) {
      Message.success({ message: response.data.message })
    } else if (response.data && !response.data.success && response.data.message) {
      Message.error({ message: response.data.message })
    }
  }
  return response
}, error => {
  if (error.response.status === 504) {
    Message.error({message: '服务器异常'})
  } else if (error.response.status === 404) {
    Message.error({message: '请求不存在'})
  } else if (error.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else {
    Message.error({message: '未知错误!'})
  }
})

export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    params: params,
    url: `${baseURL}${url}`
  })
}

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${baseURL}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${baseURL}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${baseURL}${url}`
  })
}
