<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore'
import { 
  Activity, Zap, Cpu, Package, 
  TrendingUp, Clock, AlertCircle, CheckCircle2,
  BarChart3, Layout, ArrowUpRight
} from 'lucide-vue-next'

const stats = ref({
  activeFlows: 0,
  onlineDevices: 0,
  runningInstances: 0,
  completedToday: 0
})

const recentInstances = ref<any[]>([])
let unsubFlows: any = null
let unsubDevices: any = null
let unsubInstances: any = null

const fetchStats = () => {
  // Active Flows
  unsubFlows = onSnapshot(collection(db, 'flows'), (snapshot) => {
    stats.value.activeFlows = snapshot.size
  })

  // Online Devices
  unsubDevices = onSnapshot(query(collection(db, 'devices'), where('status', '==', 'ONLINE')), (snapshot) => {
    stats.value.onlineDevices = snapshot.size
  })

  // Running Instances
  unsubInstances = onSnapshot(collection(db, 'instances'), (snapshot) => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    stats.value.runningInstances = docs.filter((d: any) => d.status === 'RUNNING').length
    stats.value.completedToday = docs.filter((d: any) => d.status === 'COMPLETED').length
    recentInstances.value = docs
      .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5)
  })
}

onMounted(fetchStats)
onUnmounted(() => {
  if (unsubFlows) unsubFlows()
  if (unsubDevices) unsubDevices()
  if (unsubInstances) unsubInstances()
})
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">系统概览</h2>
        <p class="text-sm text-slate-500">实时监控智能执行系统的运行状态与核心指标</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
        <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        系统运行正常
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(val, key) in {
        '活跃工作流': { val: stats.activeFlows, icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' },
        '在线设备': { val: stats.onlineDevices, icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
        '正在运行': { val: stats.runningInstances, icon: Activity, color: 'text-[#2ec6d6]', bg: 'bg-[#2ec6d6]/10' },
        '今日完成': { val: stats.completedToday, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' }
      }" :key="key" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-4">
          <div :class="['p-3 rounded-xl transition-colors', val.bg, val.color]">
            <component :is="val.icon" :size="24" />
          </div>
          <TrendingUp :size="16" class="text-slate-300 group-hover:text-slate-400 transition-colors" />
        </div>
        <div class="space-y-1">
          <div class="text-3xl font-bold text-slate-800">{{ val.val }}</div>
          <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ key }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Chart Area -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-bold text-slate-700 flex items-center gap-2">
              <BarChart3 :size="18" class="text-[#2ec6d6]" />
              执行效率趋势
            </h3>
            <select class="text-xs font-bold text-slate-400 bg-slate-50 border-none rounded-md px-2 py-1 focus:ring-0">
              <option>最近 7 天</option>
              <option>最近 24 小时</option>
            </select>
          </div>
          <div class="h-64 flex items-end gap-2 px-2">
            <div v-for="i in 12" :key="i" class="flex-1 bg-slate-50 rounded-t-lg relative group">
              <div 
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2ec6d6] to-[#4de1f1] rounded-t-lg transition-all duration-1000"
                :style="{ height: Math.random() * 80 + 20 + '%' }"
              ></div>
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ Math.floor(Math.random() * 100) }} 次执行
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link to="/designer" class="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-[#2ec6d6]/30 hover:shadow-md transition-all group">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-[#2ec6d6]/10 text-[#2ec6d6] rounded-lg">
                <Zap :size="20" />
              </div>
              <div>
                <div class="text-sm font-bold text-slate-700">新建工作流</div>
                <div class="text-[10px] text-slate-400">编排业务逻辑</div>
              </div>
            </div>
            <ArrowUpRight :size="16" class="text-slate-300 group-hover:text-[#2ec6d6] transition-colors" />
          </router-link>
          <router-link to="/devices" class="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:shadow-md transition-all group">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <Cpu :size="20" />
              </div>
              <div>
                <div class="text-sm font-bold text-slate-700">注册新设备</div>
                <div class="text-[10px] text-slate-400">接入硬件终端</div>
              </div>
            </div>
            <ArrowUpRight :size="16" class="text-slate-300 group-hover:text-purple-500 transition-colors" />
          </router-link>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
          <h3 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Clock :size="18" class="text-slate-400" />
            最近执行
          </h3>
          <div class="space-y-6 flex-1 overflow-y-auto pr-2">
            <div v-if="recentInstances.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
              <Activity :size="32" />
              <p class="text-xs">暂无执行记录</p>
            </div>
            <div v-for="i in recentInstances" :key="i.id" class="flex gap-4 relative group">
              <div class="shrink-0 relative z-10">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm',
                  i.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
                  i.status === 'RUNNING' ? 'bg-[#2ec6d6] text-white' : 'bg-red-500 text-white'
                ]">
                  <CheckCircle2 v-if="i.status === 'COMPLETED'" :size="14" />
                  <Activity v-else-if="i.status === 'RUNNING'" :size="14" class="animate-pulse" />
                  <AlertCircle v-else :size="14" />
                </div>
              </div>
              <div class="flex-1 pb-6 border-b border-slate-50 last:border-0">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-xs font-bold text-slate-700 truncate max-w-[120px]">{{ i.flowName || '工作流' }}</span>
                  <span class="text-[10px] font-mono text-slate-400">{{ i.startTime ? new Date(i.startTime).toLocaleTimeString() : '-' }}</span>
                </div>
                <p class="text-[10px] text-slate-400 font-mono mb-2">{{ i.id }}</p>
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#2ec6d6]" :style="{ width: i.progress + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500">{{ i.progress }}%</span>
                </div>
              </div>
              <!-- Timeline line -->
              <div class="absolute left-4 top-8 bottom-0 w-px bg-slate-100 -z-0 group-last:hidden"></div>
            </div>
          </div>
          <router-link to="/monitor" class="mt-6 w-full py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors text-center">
            查看全部运行记录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
