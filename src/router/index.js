import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactEditView from '../views/ContactEditView.vue'

// 路由规则
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '联系人列表' }
  },
  {
    path: '/contact/edit/:id?',
    name: 'contactEdit',
    component: ContactEditView,
    meta: { title: '编辑联系人' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router