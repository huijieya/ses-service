<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { Plus, Search, Edit2, Trash2, Workflow } from 'lucide-vue-next'

const flows = ref<any[]>([])
const isLoading = ref(true)
let unsubscribe: any = null

const fetchFlows = () => {
  const q = query(collection(db, 'flows'), orderBy('updatedAt', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    flows.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    isLoading.value = false
  }, (error) => {
    console.error('Failed to fetch flows', error)
    isLoading.value = false
  })
}

const deleteFlow = async (id: string) => {
  if (!confirm('确定要删除该工作流吗？')) return
  try {
    await deleteDoc(doc(db, 'flows', id))
  } catch (e) {
    console.error('Failed to delete flow', e)
  }
}

onMounted(fetchFlows)
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
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
      </div>

      <div v-if="isLoading" class="p-12 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ec6d6]"></div>
      </div>

      <div v-else-if="flows.length === 0" class="p-12 text-center text-slate-400">
        <Workflow :size="48" class="mx-auto mb-4 opacity-20" />
        <p>暂无工作流定义，点击右上角新建</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th class="px-6 py-4">名称</th>
              <th class="px-6 py-4">版本</th>
              <th class="px-6 py-4">状态</th>
              <th class="px-6 py-4 text-nowrap">最后更新</th>
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
              <td class="px-6 py-4 text-slate-500 font-mono">{{ f.version || 'v1.0' }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600">
                  ACTIVE
                </span>
              </td>
              <td class="px-6 py-4 text-slate-400 text-xs text-nowrap">{{ f.updatedAt ? new Date(f.updatedAt).toLocaleString() : '-' }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="`/designer/${f.id}`" class="p-2 text-slate-400 hover:text-[#2ec6d6] hover:bg-[#2ec6d6]/5 rounded-lg transition-all" title="编辑">
                    <Edit2 :size="16" />
                  </router-link>
                  <button @click="deleteFlow(f.id)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="删除">
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
