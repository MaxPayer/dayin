import axios from 'axios'
import Cookies from 'js-cookie'

const service = axios.create({
  baseURL: 'https://www.schooldayin.com/schoolDaYin', // www.schooldayin.com
  timeout: 15000
})

service.interceptors.request.use(config => {
  if (Cookies.get('token')) {
    config.headers['token'] = Cookies.get('token')
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return false
    } else {
      return response
    }
  }, error => {
    return Promise.reject(error)
  }
)

export default service
