const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  lastAuthTime: state => state.app.lastAuthTime,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
