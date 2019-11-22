import request from './request.js'

export function lookPassword () {
  return request({
    url: '/lookPassword',
    method: 'get'
  })
}

export function setPassword (data) {
  return request({
    url: '/setPassword',
    method: 'post',
    data
  })
}

export function createOrder (data) {
  return request({
    url: '/createOrder',
    method: 'post',
    data
  })
}

export function checkPay (data) {
  return request({
    url: '/checkPay',
    method: 'post',
    data
  })
}

export function record () {
  return request({
    url: '/record',
    method: 'get'
  })
}

export function getpaymentInfo (params) {
  return request({
    url: '/getpaymentInfo',
    method: 'get',
    params
  })
}

export function payBalance (data) {
  return request({
    url: '/payBalance',
    method: 'post',
    data
  })
}

export function delPrint (params) {
  return request({
    url: '/delPrint',
    method: 'get',
    params
  })
}
