import request from './request.js'

export function sign () {
  return request({
    url: '/signName',
    method: 'get'
  })
}

export function checkLogin (params) {
  return request({
    url: '/checkLogin',
    method: 'get',
    params
  })
}

export function deleteFile (params) {
  return request({
    url: '/delect',
    method: 'get',
    params
  })
}

export function submissionPrint (data) {
  return request({
    url: '/submissionPrint',
    method: 'post',
    data
  })
}
