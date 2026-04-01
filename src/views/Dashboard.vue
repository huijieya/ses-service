<script setup lang="ts">
import { ref } from 'vue'
import { 
  Activity, Zap, Cpu, Database, 
  CheckCircle2, AlertCircle, Clock, ArrowUpRight 
} from 'lucide-vue-next'

const stats = [
  { name: '活跃工作流', value: '12', change: '+2', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: '在线设备', value: '48', change: '98%', icon: Cpu, color: 'text-[#2ec6d6]', bg: 'bg-[#2ec6d6]/10' },
  { name: '今日处理波次', value: '124', change: '+15%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: '系统健康度', value: '99.9%', change: '稳定', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
]

const recentInstances = ref([
  { id: 'INST-001', flow: '正向分拣主流程', status: 'running', start: '10:24:15', node: 'chute_assign' },
  { id: 'INST-002', flow: '格口异常处理', status: 'completed', start: '10:20:00', node: 'End' },
  { id: 'INST-003', flow: 'PDA 扫描播种', status: 'failed', start: '10:15:30', node: 'pda_distribute' },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="s in stats" :key="s.name" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div :class="['p-3 rounded-lg', s.bg, s.color]">
            <component :is="s.icon" :size="24" />
          </div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ s.change }}</span>
        </div>
        <div class="text-2xl font-bold text-slate-800">{{ s.value }}</div>
        <div class="text-sm text-slate-500">{{ s.name }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Instances -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-700">实时运行实例</h3>
          <router-link to="/monitor" class="text-xs text-[#2ec6d6] font-bold hover:underline">查看全部</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th class="px-6 py-3">实例 ID</th>
                <th class="px-6 py-3">工作流</th>
                <th class="px-6 py-3">当前节点</th>
                <th class="px-6 py-3">状态</th>
                <th class="px-6 py-3">开始时间</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="inst in recentInstances" :key="inst.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ inst.id }}</td>
                <td class="px-6 py-4 font-medium text-slate-700">{{ inst.flow }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500">{{ inst.node }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      inst.status === 'running' ? 'bg-blue-500 animate-pulse' : 
                      inst.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    ]"></div>
                    <span class="capitalize text-xs">{{ inst.status }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-400 text-xs">{{ inst.start }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 class="font-bold text-slate-700 mb-2">快速操作</h3>
        <router-link to="/designer" class="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[#2ec6d6]/5 border border-slate-100 hover:border-[#2ec6d6]/20 transition-all group">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded shadow-sm text-[#2ec6d6]">
              <Zap :size="18" />
            </div>
            <div>
              <div class="text-sm font-bold text-slate-700">新建工作流</div>
              <div class="text-[10px] text-slate-400">从零开始编排逻辑</div>
            </div>
          </div>
          <ArrowUpRight :size="16" class="text-slate-300 group-hover:text-[#2ec6d6] transition-colors" />
        </router-link>
        
        <router-link to="/devices" class="w-full flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 transition-all group">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded shadow-sm text-purple-500">
              <Cpu :size="18" />
            </div>
            <div>
              <div class="text-sm font-bold text-slate-700">注册新设备</div>
              <div class="text-[10px] text-slate-400">接入分拣机或工作站</div>
            </div>
          </div>
          <ArrowUpRight :size="16" class="text-slate-300 group-hover:text-purple-500 transition-colors" />
        </router-link>
      </div>
    </div>
  </div>
</template>
