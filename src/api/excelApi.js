import axios from 'axios'

// 基础路径
const baseUrl = '/api/excel'

/**
 * 导出联系人
 */
export const exportContacts = () => {
  return axios({
    url: `${baseUrl}/export`,
    method: 'get',
    responseType: 'blob' // 二进制流
  })
}

/**
 * 导入联系人
 * @param {File} file Excel文件
 */
export const importContacts = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post(`${baseUrl}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}