<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  icon: any;
  selected?: boolean;
  status?: 'success' | 'error' | 'running' | null;
}>();

const statusClasses = computed(() => {
  if (props.status === 'success') return 'border-green-500 bg-green-50';
  if (props.status === 'error') return 'border-red-500 bg-red-50';
  if (props.status === 'running') return 'border-blue-500 animate-pulse';
  return '';
});

const headerClasses = computed(() => {
  return props.status ? 'bg-transparent' : 'bg-slate-50';
});
</script>

<template>
  <div 
    class="min-w-[180px] bg-white rounded-lg border-2 shadow-sm transition-all overflow-hidden"
    :class="[
      selected ? 'border-[#2ec6d6] ring-2 ring-[#2ec6d6]/20' : 'border-slate-200',
      statusClasses
    ]"
  >
    <div class="px-3 py-2 border-b flex items-center gap-2" :class="headerClasses">
      <component :is="icon" size="14" class="text-slate-500" />
      <span class="text-xs font-semibold text-slate-700 uppercase tracking-wider">{{ title }}</span>
    </div>
    <div class="p-3 text-sm text-slate-600">
      <slot />
    </div>
    <Handle type="target" :position="Position.Left" class="w-2 h-2 !bg-slate-400" />
    <Handle type="source" :position="Position.Right" class="w-2 h-2 !bg-slate-400" />
  </div>
</template>
