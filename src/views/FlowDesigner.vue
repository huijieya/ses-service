<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  VueFlow, 
  useVueFlow, 
  Panel
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { 
  Save, Play, Plus, Search, Settings, 
  Layout, Clock, Terminal, CheckCircle2, AlertCircle,
  ChevronRight, Zap
} from 'lucide-vue-next'

// Import custom nodes
import StartNode from '../components/StartNode.vue'
import EndNode from '../components/EndNode.vue'
import WaveNode from '../components/WaveNode.vue'
import ChuteNode from '../components/ChuteNode.vue'
import LogicNode from '../components/LogicNode.vue'
import BaseNode from '../components/BaseNode.vue'

const nodeTypes = {
  start: markRaw(StartNode),
  end: markRaw(EndNode),
  wave: markRaw(WaveNode),
  chute: markRaw(ChuteNode),
  logic: markRaw(LogicNode),
  base: markRaw(BaseNode),
} as any

const route = useRoute()
const router = useRouter()
const { onConnect, addEdges, toObject } = useVueFlow()

const nodes = ref([
  { id: '1', type: 'start', position: { x: 100, y: 100 }, data: { label: '开始' } },
  { id: '2', type: 'wave', position: { x: 300, y: 100 }, data: { label: '创建波次' } },
  { id: '3', type: 'logic', position: { x: 500, y: 100 }, data: { label: '解析订单' } },
  { id: '4', type: 'chute', position: { x: 700, y: 100 }, data: { label: '分配格口' } },
  { id: '5', type: 'end', position: { x: 900, y: 100 }, data: { label: '结束' } },
])

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
])

const selectedNode = ref<any>(null)
const isRunning = ref(false)
const logs = ref<any[]>([])

const onNodeClick = (event: any) => {
  selectedNode.value = event.node
}

const onRun = async () => {
  isRunning.value = true
  logs.value = []
  
  const steps = ['start', 'wave_create', 'order_parse', 'chute_assign', 'end']
  for (const step of steps) {
    await new Promise(r => setTimeout(r, 800))
    logs.value.unshift({
      timestamp: new Date().toISOString(),
      node: step,
      status: 'success',
      output: { id: Math.random().toString(36).substr(2, 9) }
    })
  }
  isRunning.value = false
}

const onSave = () => {
  console.log('Saving flow:', toObject())
  alert('工作流已保存')
}

onConnect((params) => addEdges([params]))
</script>

<template>
  <div class="flex h-full flex-col relative min-w-0">
    <!-- Header -->
    <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
      <div class="flex items-center gap-2">
        <button @click="router.back()" class="p-1 hover:bg-slate-100 rounded text-slate-400">
          <ChevronRight :size="18" class="rotate-180" />
        </button>
        <span class="text-slate-400 text-sm">工作流 /</span>
        <span class="font-medium text-sm">正向分拣主流程</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="onSave"
          class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
        >
          <Save :size="14" />
          保存
        </button>
        <button 
          @click="onRun"
          :disabled="isRunning"
          class="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#2ec6d6] text-white hover:bg-[#25b1c0] transition-all text-sm font-bold shadow-sm disabled:opacity-50"
        >
          <Play :size="14" fill="currentColor" />
          试运行
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Canvas Area -->
      <div class="flex-1 relative">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          @node-click="onNodeClick"
          fit-view-on-init
        >
          <Background color="#cbd5e1" :gap="20" />
          <Controls />
          <MiniMap />
          
          <Panel position="top-left" class="bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-sm flex gap-2">
            <div class="flex items-center gap-2 px-2 py-1 bg-white rounded border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
              <Layout :size="12" />
              视图: 55%
            </div>
          </Panel>

          <Panel position="bottom-center" class="mb-4">
            <div class="bg-white rounded-full border border-slate-200 shadow-lg px-6 py-3 flex items-center gap-6">
              <button class="flex items-center gap-2 text-slate-600 hover:text-[#2ec6d6] transition-colors text-sm font-medium">
                <Plus :size="18" class="text-[#2ec6d6]" />
                添加节点
              </button>
              <div class="w-px h-4 bg-slate-200" />
              <button class="text-slate-400 hover:text-slate-600 transition-colors">
                <Search :size="18" />
              </button>
            </div>
          </Panel>
        </VueFlow>
      </div>

      <!-- Right Sidebar (Properties) -->
      <aside class="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
        <div class="p-4 border-b flex items-center justify-between">
          <h2 class="font-bold text-slate-700">节点配置</h2>
          <Settings :size="18" class="text-slate-400" />
        </div>
        
        <div v-if="selectedNode" class="p-4 space-y-6 overflow-y-auto flex-1">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">节点名称</label>
            <input 
              type="text" 
              v-model="selectedNode.data.label"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2ec6d6]/20 focus:border-[#2ec6d6]"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">节点类型</label>
            <div class="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500 font-mono">
              {{ selectedNode.type }}
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">输入参数 (JSON)</label>
            <textarea 
              class="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2ec6d6]/20 focus:border-[#2ec6d6]"
              placeholder='{"waveId": "W001"}'
            ></textarea>
          </div>

          <div class="pt-4 border-t">
            <button class="w-full py-2 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-colors">
              更新配置
            </button>
          </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-4">
          <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
            <Settings :size="32" class="text-slate-200" />
          </div>
          <p class="text-sm">选中画布上的节点以进行配置</p>
        </div>
      </aside>
    </div>

    <!-- Bottom Panel (Logs) -->
    <div class="h-64 bg-white border-t border-slate-200 flex flex-col shrink-0">
      <div class="px-4 py-2 border-b flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm font-bold text-slate-700">运行日志</span>
          <div class="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <Clock :size="12" />
            最近运行: {{ new Date().toLocaleTimeString() }}
          </div>
        </div>
        <button class="text-slate-400 hover:text-slate-600">
          <ChevronRight :size="18" class="rotate-90" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        <div v-if="logs.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
          <Terminal :size="32" />
          <span>暂无运行记录</span>
        </div>
        <div v-for="(log, i) in logs" :key="i" class="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
          <span class="text-slate-400 shrink-0">[{{ new Date(log.timestamp).toLocaleTimeString() }}]</span>
          <div class="flex items-center gap-2">
            <CheckCircle2 v-if="log.status === 'success'" :size="14" class="text-green-500" />
            <AlertCircle v-else :size="14" class="text-red-500" />
            <span class="font-bold text-slate-700">节点 {{ log.node }}</span>
            <span class="text-slate-500">执行成功</span>
          </div>
          <div v-if="log.output" class="ml-auto bg-slate-50 px-2 py-1 rounded border border-slate-100 text-[10px] text-slate-500">
            输出: {{ JSON.stringify(log.output) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
