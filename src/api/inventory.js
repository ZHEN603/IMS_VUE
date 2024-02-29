import request from '@/utils/request'

export function getInventoryList(params) {
  return request({
    url: '/inventory/page',
    params
  })
}

export function getInventory(params) {
  return request({
    url: '/inventory/list',
    params
  })
}

export function addInventory(data) {
  return request({
    url: '/inventory',
    method: 'post',
    data
  })
}

export function updateInventory(data) {
  return request({
    url: `/inventory/${data.id}`,
    method: 'put',
    data
  })
}

export function delInventory(id) {
  return request({
    url: `/inventory/${id}`,
    method: 'delete'
  })
}

export function getInventoryDetail(id) {
  return request({
    url: `/inventory/${id}`
  })
}

