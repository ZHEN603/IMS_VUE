import request from '@/utils/request'

export function getInboundList(params) {
  return request({
    url: '/inventory/order/page',
    params
  })
}

export function addInbound(data) {
  return request({
    url: '/inventory/order',
    method: 'post',
    data
  })
}

export function updateInbound(data) {
  return request({
    url: `/inventory/order/${data.id}`,
    method: 'put',
    data
  })
}

export function delInbound(id) {
  return request({
    url: `/inventory/order/${id}`,
    method: 'delete'
  })
}

export function getInboundDetail(id) {
  return request({
    url: `/inventory/order/${id}`
  })
}

export function updateState(id, state) {
  return request({
    method: 'put',
    url: `/inventory/order/updateState/${id}`,
    data: {
      state
    }
  })
}

export function compInbound(id) {
  return request({
    url: `/inventory/order/complete/${id}`,
    method: 'put'
  })
}
