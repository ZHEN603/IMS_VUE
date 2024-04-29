import request from '@/utils/request'

export function getOutboundList(params) {
  return request({
    url: '/inventory/order/page',
    params
  })
}

export function addOutbound(data) {
  return request({
    url: '/inventory/order',
    method: 'post',
    data
  })
}

export function updateOutbound(data) {
  return request({
    url: `/inventory/order/${data.id}`,
    method: 'put',
    data
  })
}

export function delOutbound(id) {
  return request({
    url: `/inventory/order/${id}`,
    method: 'delete'
  })
}

export function getOutboundDetail(id) {
  return request({
    url: `/inventory/order/${id}`
  })
}

