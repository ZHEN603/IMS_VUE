import request from '@/utils/request'

export function getSupplierList(params) {
  return request({
    url: '/supplier/page',
    params
  })
}

export function addSupplier(data) {
  return request({
    url: '/supplier',
    method: 'post',
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: `/supplier/${data.id}`,
    method: 'put',
    data
  })
}

export function delSupplier(id) {
  return request({
    url: `/supplier/${id}`,
    method: 'delete'
  })
}

export function getSupplierDetail(id) {
  return request({
    url: `/supplier/${id}`
  })
}

export function getSupplier() {
  return request({
    url: '/supplier/list'
  })
}
