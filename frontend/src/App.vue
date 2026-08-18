<script setup>
import ToastMessage from '@/components/common/ToastMessage.vue'
import DesktopScreenWarning from '@/components/common/DesktopScreenWarning.vue'
</script>

<template>
  <ToastMessage />
  <DesktopScreenWarning />
  <RouterView />
</template>
<style scoped>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
