import request from '@/utils/request'

export function getForecast(data) {
  return request({
    url: '/forecast',
    method: 'post',
    data
  })
}
