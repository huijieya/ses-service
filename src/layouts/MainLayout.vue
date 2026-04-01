<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { auth } from '../firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth'
import { 
  Zap, Workflow, Cpu, Database, FileText, 
  Settings, Layout, Bell, User, ChevronRight,
  Monitor, BarChart3, Package, LogOut
} from 'lucide-vue-next'

const route = useRoute()
const currentPath = computed(() => route.path)

const user = ref<any>(null)
const isAuthReady = ref(false)

const login = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (e) {
    console.error('Login failed', e)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (e) {
    console.error('Logout failed', e)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u
    isAuthReady.value = true
  })
})

const menuItems = [
  { name: '系统概览', path: '/', icon: BarChart3 },
  { name: '工作流管理', path: '/flows', icon: Workflow },
  { name: '设备管理', path: '/devices', icon: Cpu },
  { name: '运行监控', path: '/monitor', icon: Monitor },
  { name: '数据字典', path: '/data', icon: Database },
]

const flows = ref([
  { id: 'f1', name: '正向分拣主流程' },
  { id: 'f2', name: '格口异常处理' },
  { id: 'f3', name: 'PDA 扫描播种' },
])
</script>

<template>
  <div class="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div class="p-4 border-b flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[#2ec6d6] flex items-center justify-center text-white">
          <Zap :size="20" fill="currentColor" />
        </div>
        <h1 class="font-bold text-lg tracking-tight">SES 系统 v3.0</h1>
      </div>
      
      <nav class="flex-1 overflow-y-auto p-2 space-y-1">
        <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">主菜单</div>
        <router-link 
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all text-left"
          :class="currentPath === item.path ? 'bg-[#2ec6d6]/10 text-[#2ec6d6] font-medium' : 'text-slate-600 hover:bg-slate-50'"
        >
          <component :is="item.icon" :size="16" />
          {{ item.name }}
        </router-link>

        <div class="pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">快速访问</div>
        <router-link 
          v-for="f in flows"
          :key="f.id"
          :to="`/designer/${f.id}`"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all text-left text-slate-600 hover:bg-slate-50"
        >
          <FileText :size="16" />
          <span class="truncate">{{ f.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t space-y-2">
        <button class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 transition-colors text-sm">
          <Settings :size="16" />
          系统设置
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0">
      <!-- Header -->
      <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 text-sm">SES /</span>
          <span class="font-medium text-sm">{{ route.meta.title || '工作台' }}</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button v-if="!user" @click="login" class="px-4 py-1.5 bg-[#2ec6d6] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#25b1c0] transition-all">
            登录
          </button>
          <template v-else>
            <button class="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell :size="18" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div class="h-6 w-px bg-slate-200"></div>
            <div class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors group relative">
              <img v-if="user.photoURL" :src="user.photoURL" class="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              <div v-else class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User :size="18" />
              </div>
              <div class="hidden sm:block">
                <div class="text-xs font-bold text-slate-700">{{ user.displayName || '用户' }}</div>
                <div class="text-[10px] text-slate-400 truncate max-w-[100px]">{{ user.email }}</div>
              </div>
              
              <!-- Dropdown -->
              <div class="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                <button @click="logout" class="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <LogOut :size="14" />
                  退出登录
                </button>
              </div>
            </div>
          </template>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>
