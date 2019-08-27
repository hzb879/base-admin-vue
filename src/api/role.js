import { postJson, post, get } from '@/utils/request'

const PREFIX = '/pms/role'

/**
 * 获取角色分页列表
 * @param {*} queryData
 */
export function getPage(queryData) {
  return postJson(`${PREFIX}/page`, queryData)
}

export function getList() {
  return get(`${PREFIX}/list`)
}

export function create(data) {
  return postJson(`${PREFIX}`, data)
}

export function update(data) {
  return postJson(`${PREFIX}/update`, data)
}

export function remove(id) {
  return post(`${PREFIX}/remove`, { id })
}
