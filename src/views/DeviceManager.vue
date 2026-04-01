<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, Cpu, Database, MoreVertical, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const devices = ref([
  { id: 'DEV-001', name: '分拣机-A', type: 'SORTER', status: 'ONLINE', ip: '192.168.1.10', chutes: 24, lastHeartbeat: '10:30:15' },
  { id: 'DEV-002', name: '格口控制器-01', type: 'CHUTE_CONTROLLER', status: 'ONLINE', ip: '192.168.1.11', chutes: 12, lastHeartbeat: '10:30:10' },
  { id: 'DEV-003', name: 'PDA-05', type: 'PDA', status: 'OFFLINE', ip: '192.168.1.55', chutes: 0, lastHeartbeat: '09:45:00' },
  { id: 'DEV-004', name: '打印机-01', type: 'PRINTER', status: 'ONLINE', ip: '192.168.1.20', chutes: 0, lastHeartbeat: '10:30:05' },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">设备管理</h2>
        <p class="text-sm text-slate-500">管理物理硬件、格口映射与连接状态</p>
      </div>
      <div class="flex gap-3">
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all font-bold shadow-sm">
          <RefreshCw :size="18" />
          刷新状态
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-[#2ec6d6] text-white rounded-lg hover:bg-[#25b1c0] transition-all font-bold shadow-sm">
          <Plus :size="18" />
          注册设备
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="d in devices" :key="d.id" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
        <div class="flex items-start justify-between mb-4">
          <div :class="[
            'p-3 rounded-lg',
            d.status === 'ONLINE' ? 'bg-[#2ec6d6]/10 text-[#2ec6d6]' : 'bg-slate-100 text-slate-400'
          ]">
            <Cpu :size="24" />
          </div>
          <button class="p-1 text-slate-300 hover:text-slate-600">
            <MoreVertical :size="18" />
          </button>
        </div>

        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-800 truncate">{{ d.name }}</h3>
            <div :class="[
              'w-2 h-2 rounded-full',
              d.status === 'ONLINE' ? 'bg-green-500' : 'bg-slate-300'
            ]"></div>
          </div>
          <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{{ d.id }}</div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">类型</div>
            <div class="text-xs font-medium text-slate-600">{{ d.type }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">格口数</div>
            <div class="text-xs font-medium text-slate-600">{{ d.chutes }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP 地址</div>
            <div class="text-xs font-mono text-slate-500">{{ d.ip }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">最后心跳</div>
            <div class="text-xs font-mono text-slate-500">{{ d.lastHeartbeat }}</div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button class="text-xs font-bold text-[#2ec6d6] hover:underline">查看详情</button>
          <button class="text-xs font-bold text-slate-400 hover:text-slate-600">格口配置</button>
        </div>
      </div>
    </div>
  </div>
</template>
