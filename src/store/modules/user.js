import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getInfo } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
  routes: constantRoutes
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  async login(context, data) {
    console.log(data)
    const token = await login(data)
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const result = await getInfo()
    context.commit('setUserInfo', result)
    return result
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
