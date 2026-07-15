<script setup>
import { storeToRefs } from 'pinia' //biến state của store thành ref giữ reactive
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const { message, type, show } = storeToRefs(toastStore)

const closeToast = () => {
  toastStore.show = false
}
</script>

<template>
  <div v-if="show" class="app-toast" :class="type">
    <span>
      {{ message }}
    </span>

    <i class="fa-solid fa-xmark close-toast" @click="closeToast"></i>
  </div>
</template>

<style>
.app-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  z-index: 999999999;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: slide 0.3s ease;
}

.app-toast.success {
  background: #22c55e;
}

.app-toast.error {
  background: #ef4444;
}
.app-toast.warning {
  background: #f59e0b;
}

.close-toast {
  cursor: pointer;

  font-size: 18px;
}

.close-toast:hover {
  transform: rotate(90deg);
  transition: 0.3s;
}

@keyframes slide {
  from {
    transform: translateX(100px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
