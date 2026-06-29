<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },

  error: {
    type: Object,
    default: () => ({}),
  },

  text: {
    type: String,
    default: 'Đang tải dữ liệu...',
  },
})
</script>

<template>
  <div class="container-state">
    <!-- lỗi -->
    <div v-if="error && Object.keys(error).length" class="error">
      {{ error.general }}
    </div>

    <!-- loading -->
    <div v-else-if="loading" class="loading">
      <div class="spinner"></div>

      <span>
        {{ text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.container-state {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 25px;
  height: 25px;
  border: 3px solid #ddd;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.error {
  color: red;
  font-size: var(--font-size-md);
}

.loading span {
  font-size: var(--font-size-md);
}
</style>
