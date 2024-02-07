import request from '@/utils/request'

export function getPermissionList(params) {
  return request({
    url: '/user/permission/list',
    params
  })
}

export function addPermission(data) {
  return request({
    url: '/user/permission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: `/user/permission/${data.id}`,
    method: 'put',
    data
  })
}

export function delPermission(id) {
  return request({
    url: `/user/permission/${id}`,
    method: 'delete'
  })
}

export function getPermissionDetail(id) {
  return request({
    url: `/user/permission/${id}`
  })
}

export function updatePermissionState(id, state) {
  return request({
    method: 'put',
    url: `/user/permission/updateState/${id}`,
    data: {
      state
    }
  })
}
