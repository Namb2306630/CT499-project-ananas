<script setup>
import ToastMessage from '@/components/common/ToastMessage.vue'
console.log(ToastMessage)
</script>

<template>
  <ToastMessage />
  <RouterView />
</template>
<style scoped>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
