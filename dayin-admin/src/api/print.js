import axios from '@/libs/api.request'

export const printList = (params) => {
  return axios.request({
    url: 'print-info-list',
    params,
    method: 'get'
  })
}

export const printStatus = (params) => {
  return axios.request({
    url: 'update-handle-status',
    params,
    method: 'get'
  })
}
