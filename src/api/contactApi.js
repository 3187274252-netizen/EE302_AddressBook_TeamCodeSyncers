import axios from 'axios'

// 基础路径
const baseUrl = '/api/contacts'

/**
 * 获取所有联系人
 */
export const getAllContacts = () => {
  return axios.get(baseUrl)
}

/**
 * 获取单个联系人
 * @param {number} id 联系人ID
 */
export const getContactById = (id) => {
  return axios.get(`${baseUrl}/${id}`)
}

/**
 * 创建联系人
 * @param {object} data 联系人数据
 */
export const createContact = (data) => {
  return axios.post(baseUrl, data)
}

/**
 * 更新联系人
 * @param {number} id 联系人ID
 * @param {object} data 联系人数据
 */
export const updateContact = (id, data) => {
  return axios.put(`${baseUrl}/${id}`, data)
}

/**
 * 切换收藏状态
 * @param {number} id 联系人ID
 */
export const toggleBookmark = (id) => {
  return axios.patch(`${baseUrl}/${id}/bookmark`)
}

/**
 * 删除联系人
 * @param {number} id 联系人ID
 */
export const deleteContact = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}