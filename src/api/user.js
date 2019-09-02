import { get, postJson, post, downloadFile } from '@/utils/request'

const PREFIX = '/pms/user'

export function login(data) {
  return postJson('/auth/login', data)
}

export function logout() {
  return postJson('/auth/logout')
}

/**
 * 设置单个用户的角色信息
 * @param {*} data
 */
export function setUserRole(data) {
  return postJson('/pms/user-role/set-user', data)
}

/**
 * 获取个人信息
 */
export function getInfo() {
  return get(`${PREFIX}/own-info`)
}

/**
 * 添加新用户
 * @param {*} data
 */
export function registerUser(data) {
  return postJson(`${PREFIX}/register`, data)
}

/**
 * 重设用户名和密码
 * @param {*} data
 */
export function resetUsernameAndCipher(data) {
  return postJson(`${PREFIX}/reset-auth`, data)
}

/**
 * 修改自己个人信息
 * @param {*} data
 */
export function updateOwnInfo(data) {
  return postJson(`${PREFIX}/own-update`, data)
}

/**
 * 修改用户信息
 * @param {*} data
 */
export function updateUser(data) {
  return postJson(`${PREFIX}/update`, data)
}

/**
 * 删除用户信息
 * @param {*} data
 */
export function removeUser(id) {
  return post(`${PREFIX}/remove`, { id })
}

/**
 * 获取字典信息
 */
export function getDict() {
  return get(`${PREFIX}/dict`)
}

/**
 * 修改自己密码
 * @param {*} data
 */
export function changeOwnCipher(data) {
  return postJson(`${PREFIX}/own-change-cipher`, data)
}

/**
 * 获取用户分页列表
 * @param {*} queryData
 */
export function getPage(queryData) {
  return postJson(`${PREFIX}/page`, queryData)
}

/**
 * 设置用户状态
 * @param {*} data
 */
export function setUserStatus(data) {
  return postJson(`${PREFIX}/set-status`, data)
}

export function downloadUserExcel(data) {
  return downloadFile('/excel/user/download', data)
}

export function authSelf(password) {
  return post(`${PREFIX}/auth`, { password })
}
