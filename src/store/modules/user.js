import { login, logout, getInfo, updateOwnInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  username: '',
  avatarId: '',
  avatar: '',
  gender: '',
  birthday: '',
  mobile: '',
  email: '',
  description: '',
  roles: [],
  roleCnNames: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_COMMON_INFO: (state, user) => {
    state.name = user.name
    state.username = user.username
    state.avatarId = user.avatarId
    state.avatar = user.avatar
    state.gender = user.gender
    state.birthday = user.birthday
    state.mobile = user.mobile
    state.email = user.email
    state.description = user.description
    state.roleCnNames = user.roleCnNames
  },
  SET_UPDATE_INFO: (state, user) => {
    state.name = user.name
    state.gender = user.gender
    state.birthday = user.birthday
    state.mobile = user.mobile
    state.email = user.email
    state.description = user.description
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(data => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(data => {
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // roles must be a non-empty array
        if (!data.roles || data.roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', data.roles)
        commit('SET_COMMON_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 修改个人信息
  updateInfo({ commit, state }, userInfo) {
    return new Promise((resolve, reject) => {
      updateOwnInfo(userInfo).then(data => {
        commit('SET_UPDATE_INFO', userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

