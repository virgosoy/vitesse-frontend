import axios from 'axios'

// TODO: according request and response, update your info properly

export const http = axios.create({
  baseURL: '/',
  transformRequest: [function (data) {
    if (data instanceof FormData) {
      // 如果是FormData对象则不处理
      return data
    }
    return JSON.stringify(data)
  }],
  headers: {
    // 如果是 FormData 的话实际的 Content-Type 会变 multipart/form-data; boundary=xxx
    'Content-Type': 'application/json; charset=utf-8',
  },
})

/**
 * 后端统一返回结果
 */
export interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

http.interceptors.response.use((response) => {
  const data: ResponseData = response.data
  if (data instanceof Blob) {
    // 一般下载文件，request.responseType 会设置为 blob，那么就会返回 Blob
    return Promise.resolve(data)
  } else if (data.code === 0) {
    return Promise.resolve(data.data)
  } else {
    const err = new Error(`[${data.code}] ${data.message}`)
    return Promise.reject(err)
  }
})
