import request from './request.js'

export function userInfo () {
  return request({
    url: '/userInfo',
    method: 'get'
  })
}
