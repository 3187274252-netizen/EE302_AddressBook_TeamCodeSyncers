<template>
  <div class="contact-list">
    <!-- 列表工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="goToAdd">添加联系人</el-button>
      <ImportExport />
    </div>

    <!-- 联系人列表 -->
    <el-table
      :data="contactList"
      border
      stripe
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column prop="name" label="姓名" min-width="100" />
      <el-table-column label="联系方式" min-width="200">
        <template #default="scope">
          <div v-for="method in scope.row.contactMethods" :key="method.id">
            <el-tag size="small" :type="getTagType(method.type)">
              {{ getTypeName(method.type) }}：{{ method.value }}
              <template v-if="method.remark">（{{ method.remark }}）</template>
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收藏状态" width="100">
        <template #default="scope">
          <el-icon
            :color="scope.row.isBookmarked ? '#f59e0b' : '#9ca3af'"
            @click="handleBookmark(scope.row.id, scope.row.isBookmarked)"
            style="cursor: pointer"
          >
            <Star />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" prop="createTime" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="goToEdit(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty
      v-if="contactList.length === 0"
      description="暂无联系人数据"
      style="margin-top: 50px"
    >
      <el-button type="primary" @click="goToAdd">添加联系人</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import {
  getAllContacts,
  toggleBookmark,
  deleteContact
} from '@/api/contactApi'
import ImportExport from './ImportExport.vue'

// 路由实例
const router = useRouter()

// 联系人列表
const contactList = ref([])

// 加载联系人列表
const loadContacts = async () => {
  try {
    const res = await getAllContacts()
    if (res.data.success) {
      contactList.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载联系人失败')
    console.error(error)
  }
}

// 初始化加载
onMounted(() => {
  loadContacts()
})

// 跳转到添加页面
const goToAdd = () => {
  router.push('/contact/edit')
}

// 跳转到编辑页面
const goToEdit = (id) => {
  router.push(`/contact/edit/${id}`)
}

// 切换收藏状态
const handleBookmark = async (id, isBookmarked) => {
  try {
    const res = await toggleBookmark(id)
    if (res.data.success) {
      ElMessage.success(isBookmarked ? '取消收藏成功' : '收藏成功')
      loadContacts() // 刷新列表
    }
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

// 删除联系人
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该联系人吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteContact(id)
    if (res.data.success) {
      ElMessage.success('删除成功')
      loadContacts() // 刷新列表
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 根据类型获取标签样式
const getTagType = (type) => {
  const typeMap = {
    phone: 'primary',
    email: 'success',
    social: 'info',
    address: 'warning'
  }
  return typeMap[type] || 'default'
}

// 获取类型中文名称
const getTypeName = (type) => {
  const typeMap = {
    phone: '手机号',
    email: '邮箱',
    social: '社交媒体',
    address: '地址'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.contact-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>