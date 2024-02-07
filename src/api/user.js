import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/profile',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: '/user/page',
    params
  })
}

export function getUser(id) {
  return request({
    url: `/user/${id}`
  })
}

export function delUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function addUser(data) {
  return request({
    url: `/user`,
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: 'put',
    data
  })
}

export function assignRoles(data) {
  return request({
    url: `/user/assignRoles`,
    method: 'put',
    data
  })
}
