import request from '@/utils/request'

export function getCompanyList(params) {
  return request({
    url: '/company/page',
    params
  })
}

export function addCompany(data) {
  return request({
    url: '/company',
    method: 'post',
    data
  })
}

export function getCompanyDetail(id) {
  return request({
    url: `/company/${id}`
  })
}

export function getCompanyType() {
  return request({
    url: `/company/list`
  })
}

export function updateCompany(data) {
  return request({
    method: 'put',
    url: `/company/${data.id}`,
    data
  })
}

export function delCompany(id) {
  return request({
    method: 'delete',
    url: `/company/${id}`
  })
}

export function updateCompanyState(id, state) {
  return request({
    method: 'put',
    url: `/company/updateState/${id}`,
    data: {
      state
    }
  })
}
