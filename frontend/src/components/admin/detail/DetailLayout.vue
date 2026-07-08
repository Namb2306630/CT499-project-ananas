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
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="info-card-1">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.basic-info-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--border-gray-3);
  box-shadow: var(--shadow-gray);
}

.card-header {
  padding: 18px 30px;
  border-bottom: 1px solid var(--border-gray-2);
}

.card-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-gray-4);
  border-left: 4px solid var(--color-bule);
  padding-left: 12px;
}

.info-card-1 {
  padding: 30px;
}
</style>
