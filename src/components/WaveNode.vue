<script setup lang="ts">
import { Workflow } from 'lucide-vue-next';
import BaseNode from './BaseNode.vue';

defineProps<{
  selected?: boolean;
  data: any;
}>();
</script>

<template>
  <BaseNode title="波次管理" :icon="Workflow" :selected="selected" :status="data.status">
    <div class="text-xs font-medium">{{ data.label }}</div>
  </BaseNode>
</template>
