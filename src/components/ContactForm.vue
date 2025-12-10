<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="80px"
    style="max-width: 800px; margin: 0 auto"
  >
    <!-- 基础信息 -->
    <el-form-item label="姓名" prop="name" required>
      <el-input
        v-model="formData.name"
        placeholder="请输入联系人姓名"
        maxlength="50"
      />
    </el-form-item>

    <el-form-item label="收藏状态">
      <el-switch
        v-model="formData.isBookmarked"
        active-text="已收藏"
        inactive-text="未收藏"
      />
    </el-form-item>

    <!-- 联系方式列表 -->
    <el-form-item label="联系方式">
      <div v-for="(method, index) in formData.contactMethods" :key="index" class="method-item">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-select
              v-model="method.type"
              placeholder="选择类型"
              style="width: 100%"
            >
              <el-option label="手机号" value="phone" />
              <el-option label="邮箱" value="email" />
              <el-option label="社交媒体" value="social" />
              <el-option label="地址" value="address" />
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="method.value"
              placeholder="请输入联系方式"
              maxlength="100"
            />
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="method.remark"
              placeholder="备注（如：工作）"
              maxlength="50"
            />
          </el-col>
          <el-col :span="2">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeMethod(index)"
              :disabled="formData.contactMethods.length === 1"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 添加按钮 -->
      <el-button
        type="dashed"
        icon="el-icon-plus"
        size="small"
        @click="addMethod"
        style="margin-top: 10px"
      >
        添加联系方式
      </el-button>
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button @click="goBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createContact, getContactById, updateContact } from '@/api/contactApi'

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = ref({
  name: '',
  isBookmarked: false,
  contactMethods: [
    {
      type: '',
      value: '',
      remark: ''
    }
  ]
})

// 联系人ID（编辑模式）
const contactId = ref(route.params.id || null)

// 初始化表单（编辑模式）
const initForm = async () => {
  if (contactId.value) {
    try {
      const res = await getContactById(contactId.value)
      if (res.data.success) {
        const data = res.data.data
        formData.value = {
          name: data.name,
          isBookmarked: data.isBookmarked,
          contactMethods: data.contactMethods.length > 0 ? data.contactMethods : [
            { type: '', value: '', remark: '' }
          ]
        }
      }
    } catch (error) {
      ElMessage.error('加载联系人信息失败')
      console.error(error)
    }
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newVal) => {
    contactId.value = newVal || null
    initForm()
  },
  { immediate: true }
)

// 添加联系方式
const addMethod = () => {
  formData.value.contactMethods.push({
    type: '',
    value: '',
    remark: ''
  })
}

// 移除联系方式
const removeMethod = (index) => {
  formData.value.contactMethods.splice(index, 1)
}

// 提交表单
const submitForm = async () => {
  // 表单校验
  if (!formRef.value) return
  try {
    await formRef.value.validate()

    // 提交数据
    let res
    if (contactId.value) {
      // 编辑模式
      res = await updateContact(contactId.value, formData.value)
    } else {
      // 添加模式
      res = await createContact(formData.value)
    }

    if (res.data.success) {
      ElMessage.success(contactId.value ? '更新成功' : '创建成功')
      router.push('/') // 返回列表页
    }
  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error(contactId.value ? '更新失败' : '创建失败')
      console.error(error)
    }
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  // 重置联系方式为1行
  formData.value.contactMethods = [
    { type: '', value: '', remark: '' }
  ]
}

// 返回列表页
const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.method-item {
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.el-form {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>