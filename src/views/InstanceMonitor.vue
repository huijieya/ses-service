<script setup lang="ts">
import { ref } from 'vue'
import { 
  Activity, Clock, CheckCircle2, AlertCircle, 
  Search, Filter, Play, Pause, RotateCcw, MoreVertical
} from 'lucide-vue-next'

const instances = ref([
  { id: 'INST-001', flow: '正向分拣主流程', status: 'RUNNING', progress: 65, start: '10:24:15', duration: '2m 15s', node: 'chute_assign' },
  { id: 'INST-002', flow: '格口异常处理', status: 'COMPLETED', progress: 100, start: '10:20:00', duration: '45s', node: 'End' },
  { id: 'INST-003', flow: 'PDA 扫描播种', status: 'FAILED', progress: 40, start: '10:15:30', duration: '1m 10s', node: 'pda_distribute' },
  { id: 'INST-004', flow: '正向分拣主流程', status: 'SUSPENDED', progress: 20, start: '10:10:00', duration: '15m 0s', node: 'order_parse' },
])
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

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th class="px-6 py-4">实例 ID</th>
              <th class="px-6 py-4">工作流</th>
              <th class="px-6 py-4">当前进度</th>
              <th class="px-6 py-4">当前节点</th>
              <th class="px-6 py-4">开始时间</th>
              <th class="px-6 py-4">耗时</th>
              <th class="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="inst in instances" :key="inst.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ inst.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-700">{{ inst.flow }}</td>
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
                <span class="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-500">{{ inst.node }}</span>
              </td>
              <td class="px-6 py-4 text-slate-400 text-xs">{{ inst.start }}</td>
              <td class="px-6 py-4 text-slate-400 text-xs">{{ inst.duration }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="inst.status === 'RUNNING'" class="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="暂停">
                    <Pause :size="16" />
                  </button>
                  <button v-if="inst.status === 'SUSPENDED'" class="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all" title="恢复">
                    <Play :size="16" />
                  </button>
                  <button v-if="inst.status === 'FAILED'" class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="重试">
                    <RotateCcw :size="16" />
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
