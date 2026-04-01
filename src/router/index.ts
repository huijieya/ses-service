import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '系统概览' }
      },
      {
        path: 'flows',
        name: 'FlowList',
        component: () => import('../views/FlowList.vue'),
        meta: { title: '工作流管理' }
      },
      {
        path: 'designer/:id?',
        name: 'FlowDesigner',
        component: () => import('../views/FlowDesigner.vue'),
        meta: { title: '工作流编排' }
      },
      {
        path: 'devices',
        name: 'DeviceManager',
        component: () => import('../views/DeviceManager.vue'),
        meta: { title: '设备管理' }
      },
      {
        path: 'monitor',
        name: 'InstanceMonitor',
        component: () => import('../views/InstanceMonitor.vue'),
        meta: { title: '运行监控' }
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
