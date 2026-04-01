<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import BaseNode from './BaseNode.vue';

defineProps<{
  selected?: boolean;
  data: any;
}>();
</script>

<template>
  <BaseNode title="开始" :icon="Play" :selected="selected" :status="data.status">
    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-400 italic">输入参数</span>
    </div>
  </BaseNode>
</template>
