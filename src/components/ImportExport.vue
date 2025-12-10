<template>
  <div class="import-export">
    <el-button type="success" icon="el-icon-download" @click="handleExport">
      导出Excel
    </el-button>

    <el-upload
      class="upload-btn"
      action="#"
      :auto-upload="false"
      :on-change="handleFileChange"
      :show-file-list="false"
      accept=".xlsx"
    >
      <el-button type="warning" icon="el-icon-upload">
        导入Excel
      </el-button>
    </el-upload>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportContacts, importContacts } from '@/api/excelApi'

// 选中的文件
const selectedFile = ref(null)

// 导出Excel
const handleExport = async () => {
  try {
    const res = await exportContacts()
    // 创建下载链接
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '地址簿联系人.xlsx'
    a.click()
    // 释放URL
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
    console.error(error)
  }
}

// 选择导入文件
const handleFileChange = (file) => {
  selectedFile.value = file.raw
  confirmImport()
}

// 确认导入
const confirmImport = async () => {
  if (!selectedFile.value) return

  try {
    await ElMessageBox.confirm(
      '确定要导入该Excel文件吗？导入前请确保格式正确',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const res = await importContacts(selectedFile.value)
    if (res.data.success) {
      const { successCount, failCount, failReasons } = res.data.data
      let msg = `导入完成：成功${successCount}条，失败${failCount}条`
      if (failCount > 0) {
        msg += `\n失败原因：${failReasons.join('；')}`
      }
      ElMessage.success(msg)
      // 通知父组件刷新列表
      emit('refreshList')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导入失败')
      console.error(error)
    }
  } finally {
    selectedFile.value = null
  }
}

// 定义事件（通知父组件刷新）
const emit = defineEmits(['refreshList'])
</script>

<style scoped>
.import-export {
  display: flex;
  gap: 10px;
}

.upload-btn {
  display: inline-block;
}
</style>