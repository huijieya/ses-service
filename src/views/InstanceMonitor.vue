<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { 
  Activity, Clock, CheckCircle2, AlertCircle, 
  Search, Filter, Play, Pause, RotateCcw, MoreVertical, Terminal
} from 'lucide-vue-next'

const instances = ref<any[]>([])
const isLoading = ref(true)
let unsubscribe: any = null

const fetchInstances = () => {
  const q = query(collection(db, 'instances'), orderBy('startTime', 'desc'), limit(50))
  unsubscribe = onSnapshot(q, (snapshot) => {
    instances.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    isLoading.value = false
  }, (error) => {
    console.error('Failed to fetch instances', error)
    isLoading.value = false
  })
}

onMounted(fetchInstances)
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">运行监控</h2>
        <p class="text-sm text-slate-500">实时追踪工作流实例的执行状态与节点日志</p>
      </div>
      <div class="flex gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-bold shadow-sm">
          <Activity :size="18" />
          实时视图
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索实例 ID 或工作流..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2ec6d6]/20 focus:border-[#2ec6d6]"
          />
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Filter :size="16" />
            筛选
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="p-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ec6d6]"></div>
      </div>

      <div v-else-if="instances.length === 0" class="p-12 text-center text-slate-400">
        <Activity :size="48" class="mx-auto mb-4 opacity-20" />
        <p>暂无运行记录</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th class="px-6 py-4">实例 ID</th>
              <th class="px-6 py-4">工作流</th>
              <th class="px-6 py-4">当前进度</th>
              <th class="px-6 py-4">当前节点</th>
              <th class="px-6 py-4">开始时间</th>
              <th class="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="inst in instances" :key="inst.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ inst.id }}</td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-700">{{ inst.flowName || '未知工作流' }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ inst.flowId }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="w-32 space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{{ inst.progress }}%</span>
                    <span :class="[
                      inst.status === 'RUNNING' ? 'text-blue-500' : 
                      inst.status === 'COMPLETED' ? 'text-green-500' : 
                      inst.status === 'FAILED' ? 'text-red-500' : 'text-slate-400'
                    ]">{{ inst.status }}</span>
                  </div>
                  <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div :class="[
                      'h-full transition-all duration-500',
                      inst.status === 'RUNNING' ? 'bg-blue-500' : 
                      inst.status === 'COMPLETED' ? 'bg-green-500' : 
                      inst.status === 'FAILED' ? 'bg-red-500' : 'bg-slate-300'
                    ]" :style="{ width: inst.progress + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500">{{ inst.currentNode || '-' }}</span>
              </td>
              <td class="px-6 py-4 text-slate-400 text-xs">
                {{ inst.startTime ? new Date(inst.startTime).toLocaleString() : '-' }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="p-2 text-slate-400 hover:text-[#2ec6d6] hover:bg-[#2ec6d6]/5 rounded-lg transition-all" title="查看日志">
                    <Terminal :size="16" />
                  </button>
                  <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <MoreVertical :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
