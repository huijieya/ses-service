<script setup lang="ts">
import { Box } from 'lucide-vue-next';
import BaseNode from './BaseNode.vue';

defineProps<{
  selected?: boolean;
  data: any;
}>();
</script>

<template>
  <BaseNode title="格口操作" :icon="Box" :selected="selected" :status="data.status">
    <div class="text-xs font-medium">{{ data.label }}</div>
  </BaseNode>
</template>
