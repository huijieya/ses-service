<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { 
  Plus, Cpu, MoreVertical, 
  Clock, Settings, Trash2, X, RefreshCw
} from 'lucide-vue-next'

const devices = ref<any[]>([])
const isLoading = ref(true)
const showModal = ref(false)
let unsubscribe: any = null

const newDevice = ref({
  name: '',
  type: 'SORTER',
  ip: '',
  chutes: 0
})

const fetchDevices = () => {
  isLoading.value = true
  const q = query(collection(db, 'devices'), orderBy('name'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    devices.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    isLoading.value = false
  }, (error) => {
    console.error('Failed to fetch devices', error)
    isLoading.value = false
  })
}

const registerDevice = async () => {
  if (!newDevice.value.name) return
  try {
    await addDoc(collection(db, 'devices'), {
      ...newDevice.value,
      status: 'ONLINE',
      lastHeartbeat: new Date().toISOString()
    })
    showModal.value = false
    newDevice.value = { name: '', type: 'SORTER', ip: '', chutes: 0 }
  } catch (e) {
    console.error('Failed to register device', e)
  }
}

const deleteDevice = async (id: string) => {
  if (!confirm('确定要删除该设备吗？')) return
  try {
    await deleteDoc(doc(db, 'devices', id))
  } catch (e) {
    console.error('Failed to delete device', e)
  }
}

onMounted(fetchDevices)
onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">设备管理</h2>
        <p class="text-sm text-slate-500">管理物理硬件、格口映射与连接状态</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="showModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-[#2ec6d6] text-white rounded-lg hover:bg-[#25b1c0] transition-all font-bold shadow-sm"
        >
          <Plus :size="18" />
          注册设备
        </button>
      </div>
    </div>

    <!-- Device Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
    </div>
    
    <div v-else-if="devices.length === 0" class="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
      <Cpu :size="48" class="mx-auto mb-4 opacity-20" />
      <p>暂无连接设备，请点击右上角注册</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="d in devices" :key="d.id" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
        <div class="flex items-start justify-between mb-4">
          <div :class="[
            'p-3 rounded-lg',
            d.status === 'ONLINE' ? 'bg-[#2ec6d6]/10 text-[#2ec6d6]' : 'bg-slate-100 text-slate-400'
          ]">
            <Cpu :size="24" />
          </div>
          <div class="relative group/menu">
            <button class="p-1 text-slate-300 hover:text-slate-600">
              <MoreVertical :size="18" />
            </button>
            <div class="absolute right-0 top-full mt-1 hidden group-hover/menu:block bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button @click="deleteDevice(d.id)" class="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">删除设备</button>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-slate-800 truncate">{{ d.name }}</h3>
            <div :class="[
              'w-2 h-2 rounded-full',
              d.status === 'ONLINE' ? 'bg-green-500' : 'bg-slate-300'
            ]"></div>
          </div>
          <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{{ d.id }}</div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">类型</div>
            <div class="text-xs font-medium text-slate-600">{{ d.type }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">格口数</div>
            <div class="text-xs font-medium text-slate-600">{{ d.chutes }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP 地址</div>
            <div class="text-xs font-mono text-slate-500">{{ d.ip }}</div>
          </div>
          <div class="space-y-1">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">心跳</div>
            <div class="text-xs font-mono text-slate-500">{{ d.lastHeartbeat ? new Date(d.lastHeartbeat).toLocaleTimeString() : '-' }}</div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button class="text-xs font-bold text-[#2ec6d6] hover:underline">查看详情</button>
          <button class="text-xs font-bold text-slate-400 hover:text-slate-600">格口配置</button>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 class="font-bold text-slate-800">注册新设备</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <X :size="20" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">设备名称</label>
            <input v-model="newDevice.name" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2ec6d6]/20 focus:border-[#2ec6d6]" placeholder="例如：分拣机-B" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">设备类型</label>
            <select v-model="newDevice.type" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
              <option value="SORTER">分拣机 (SORTER)</option>
              <option value="CHUTE_CONTROLLER">格口控制器 (CHUTE_CONTROLLER)</option>
              <option value="PDA">PDA 终端</option>
              <option value="PRINTER">打印机 (PRINTER)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP 地址</label>
              <input v-model="newDevice.ip" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" placeholder="192.168.1.x" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">格口数量</label>
              <input v-model.number="newDevice.chutes" type="number" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
        </div>
        <div class="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button @click="showModal = false" class="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">取消</button>
          <button @click="registerDevice" class="flex-1 py-2 text-sm font-bold bg-[#2ec6d6] text-white rounded-lg hover:bg-[#25b1c0] transition-colors shadow-sm">确认注册</button>
        </div>
      </div>
    </div>
  </div>
</template>
