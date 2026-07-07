<script setup>
defineProps({
  title: {
    type: String,
    default: 'Thông tin cơ bản',
  },
})
</script>

<template>
  <div class="basic-info-card">
    <div class="info-card-1">
      <h3>{{ title }}</h3>

      <slot />
    </div>
  </div>
</template>

<style scoped>
.basic-info-card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border-gray-3);
  box-shadow: var(--shadow-gray);
}

.info-card-1 {
  padding: 30px;
}
</style>
