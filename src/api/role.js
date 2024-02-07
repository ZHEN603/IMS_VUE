import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/user/role/page',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/user/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/user/role/${data.id}`,
    method: 'put',
    data
  })
}

export function delRole(id) {
  return request({
    url: `/user/role/${id}`,
    method: 'delete'
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/user/role/${id}`
  })
}

export function assignPerm(data) {
  return request({
    url: '/user/role/assignPerm',
    method: 'put',
    data
  })
}

export function getRoles() {
  return request({
    url: '/user/role/list'
  })
}

export function getRolesByUserId(id) {
  return request({
    url: `/user/role/userId/${id}`
  })
}
