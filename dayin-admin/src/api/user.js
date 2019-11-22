import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const register = (data) => {
  return axios.request({
    url: 'register',
    data,
    method: 'post'
  })
}

export const adminList = () => {
  return axios.request({
    url: 'admin_list',
    method: 'get'
  })
}

export const delectUser = (_id) => {
  return axios.request({
    url: 'delect_user',
    params: {
      _id
    },
    method: 'get'
  })
}

export const delectAdmin = (_id) => {
  return axios.request({
    url: 'delect_admin',
    params: {
      _id
    },
    method: 'get'
  })
}

export const changeUser = (data) => {
  return axios.request({
    url: 'change_user',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}
