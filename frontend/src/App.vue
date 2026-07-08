<script setup>
import ToastMessage from '@/components/common/ToastMessage.vue'
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
