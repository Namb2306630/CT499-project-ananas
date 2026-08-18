<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useSystemConfigStore } from '@/stores/system-config'

const systemConfigStore = useSystemConfigStore()
const BASE_URL = import.meta.env.VITE_BACKEND
const router = useRouter()
const route = useRoute() //xem đang ở trang nào
const form = ref({
  notFoundImage: '',
})

onMounted(async () => {
  await systemConfigStore.get()

  Object.assign(form.value, systemConfigStore.systemConfig)
})

const goHome = () => {
  if (route.path.startsWith('/admin')) {
    router.push('/admin/dashboard')
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="not-found">
    <img :src="`${BASE_URL}/${form.notFoundImage}`" alt="Ảnh Not Found" />

    <button class="btn" @click="goHome">QUAY LẠI TRANG CHỦ</button>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.not-found img {
  width: 600px;
  max-width: 90%;
}

.btn {
  margin-top: 50px;
  padding: 22px 65px;
  border: none;
  border-radius: 8px;
  background-color: var(--color-bg-orange);
  font-weight: var(--font-width-lg);
  color: var(--text-white);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-10px);
  color: var(--text-white);
  box-shadow: var(--shadow-black);
}
</style>
