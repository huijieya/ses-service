<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search, MoreVertical, Play, Edit2, Trash2, Copy } from 'lucide-vue-next'

const flows = ref([
  { id: 'f1', name: '正向分拣主流程', version: 'v3.0', status: 'ACTIVE', type: 'STANDARD', updated: '2026-04-01 10:00' },
  { id: 'f2', name: '格口异常处理', version: 'v1.2', status: 'ACTIVE', type: 'CUSTOM', updated: '2026-03-28 15:30' },
  { id: 'f3', name: 'PDA 扫描播种', version: 'v2.1', status: 'DRAFT', type: 'STANDARD', updated: '2026-03-30 09:15' },
])
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">工作流管理</h2>
        <p class="text-sm text-slate-500">编排与管理系统的业务逻辑节点</p>
      </div>
      <router-link 
        to="/designer"
        class="flex items-center gap-2 px-4 py-2 bg-[#2ec6d6] text-white rounded-lg hover:bg-[#25b1c0] transition-all font-bold shadow-sm"
      >
        <Plus :size="18" />
        新建工作流
      </router-link>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索工作流名称或 ID..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2ec6d6]/20 focus:border-[#2ec6d6]"
          />
        </div>
        <select class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none">
          <option>所有状态</option>
          <option>活跃</option>
          <option>草稿</option>
          <option>已禁用</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th class="px-6 py-4">名称</th>
              <th class="px-6 py-4">类型</th>
              <th class="px-6 py-4">版本</th>
              <th class="px-6 py-4">状态</th>
              <th class="px-6 py-4">最后更新</th>
              <th class="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="f in flows" :key="f.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#2ec6d6] transition-colors">
                    <Workflow :size="16" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-700">{{ f.name }}</div>
                    <div class="text-[10px] font-mono text-slate-400">{{ f.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-[10px] font-bold" :class="f.type === 'STANDARD' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'">
                  {{ f.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500 font-mono">{{ f.version }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold" :class="f.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'">
                  {{ f.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-400 text-xs">{{ f.updated }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="`/designer/${f.id}`" class="p-2 text-slate-400 hover:text-[#2ec6d6] hover:bg-[#2ec6d6]/5 rounded-lg transition-all" title="编辑">
                    <Edit2 :size="16" />
                  </router-link>
                  <button class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="复制">
                    <Copy :size="16" />
                  </button>
                  <button class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="删除">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
