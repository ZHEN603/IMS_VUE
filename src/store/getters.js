const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  roles: state => state.user.userInfo.roles,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  email: state => state.user.userInfo.email,
  mobile: state => state.user.userInfo.mobile,
  routes: state => state.user.routes
}
export default getters
