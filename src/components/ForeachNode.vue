<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Repeat, ArrowRight } from 'lucide-vue-next'

defineProps<{
  data: {
    label: string
    iterator?: string
  }
  selected?: boolean
}>()
</script>

<template>
  <div 
    class="px-4 py-3 rounded-xl bg-white border-2 transition-all min-w-[160px] shadow-sm"
    :class="[selected ? 'border-indigo-500 shadow-indigo-100' : 'border-slate-200 hover:border-slate-300']"
  >
    <Handle type="target" :position="Position.Left" class="w-3 h-3 !bg-slate-400 border-2 border-white" />
    
    <div class="flex items-center gap-3">
      <div class="p-2 rounded-lg bg-indigo-50 text-indigo-600">
        <Repeat :size="18" />
      </div>
      <div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">循环遍历</div>
        <div class="text-sm font-bold text-slate-700">{{ data.label }}</div>
      </div>
    </div>

    <div class="mt-2 px-2 py-1 bg-indigo-50/50 rounded border border-indigo-100/50 flex items-center justify-between">
      <span class="text-[10px] text-indigo-400 font-mono">item in {{ data.iterator || 'list' }}</span>
      <ArrowRight :size="10" class="text-indigo-300" />
    </div>

    <Handle type="source" :position="Position.Right" class="w-3 h-3 !bg-indigo-400 border-2 border-white" />
  </div>
</template>
