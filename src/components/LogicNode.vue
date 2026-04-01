<script setup lang="ts">
import { Cpu } from 'lucide-vue-next';
import BaseNode from './BaseNode.vue';

defineProps<{
  selected?: boolean;
  data: any;
}>();
</script>

<template>
  <BaseNode title="逻辑判断" :icon="Cpu" :selected="selected" :status="data.status">
    <div class="text-xs font-medium">{{ data.label }}</div>
  </BaseNode>
</template>
