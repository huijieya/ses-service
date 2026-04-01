<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';
import BaseNode from './BaseNode.vue';

defineProps<{
  selected?: boolean;
  data: any;
}>();
</script>

<template>
  <BaseNode title="结束" :icon="LogOut" :selected="selected" :status="data.status">
    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-400 italic">返回变量</span>
    </div>
  </BaseNode>
</template>
