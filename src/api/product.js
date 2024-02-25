import request from '@/utils/request'

export function getProductList(params) {
  return request({
    url: '/product/page',
    params
  })
}

export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: `/product/${data.id}`,
    method: 'put',
    data
  })
}

export function delProduct(id) {
  return request({
    url: `/product/${id}`,
    method: 'delete'
  })
}

export function getProductDetail(id) {
  return request({
    url: `/product/${id}`
  })
}

export function getProduct(data) {
  return request({
    url: '/product/ids',
    method: 'post',
    data
  })
}
