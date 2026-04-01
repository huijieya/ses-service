<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Split, ChevronRight } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    conditions?: Array<{ id: string; label: string }>
  }
  selected?: boolean
}>()
</script>

<template>
  <div 
    class="px-4 py-3 rounded-xl bg-white border-2 transition-all min-w-[180px] shadow-sm"
    :class="[selected ? 'border-amber-500 shadow-amber-100' : 'border-slate-200 hover:border-slate-300']"
  >
    <Handle type="target" :position="Position.Left" class="w-3 h-3 !bg-slate-400 border-2 border-white" />
    
    <div class="flex items-center gap-3">
      <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
        <Split :size="18" />
      </div>
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">条件路由</div>
        <div class="text-sm font-bold text-slate-700">{{ data.label }}</div>
      </div>
    </div>

    <div class="mt-3 space-y-1">
      <div v-for="cond in (data.conditions || [{id: 'default', label: '默认'}])" :key="cond.id" class="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-100 text-[10px] font-medium text-slate-500 relative">
        <span>{{ cond.label }}</span>
        <ChevronRight :size="12" />
        <Handle 
          type="source" 
          :position="Position.Right" 
          :id="cond.id"
          class="!right-[-12px] w-3 h-3 !bg-amber-400 border-2 border-white" 
        />
      </div>
    </div>
  </div>
</template>
