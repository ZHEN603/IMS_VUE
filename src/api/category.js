import request from '@/utils/request'

export function getCategoryList() {
  return request({
    url: '/product/category/list'
  })
}

export function addCategory(data) {
  return request({
    url: '/product/category',
    method: 'post',
    data
  })
}

export function getCategoryDetail(id) {
  return request({
    url: `/product/category/${id}`
  })
}

export function updateCategory(data) {
  return request({
    method: 'put',
    url: `/product/category/${data.id}`,
    data
  })
}

export function delCategory(id) {
  return request({
    method: 'delete',
    url: `/product/category/${id}`
  })
}
