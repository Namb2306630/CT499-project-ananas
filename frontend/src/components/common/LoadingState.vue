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

  showText: {
    type: Boolean,
    default: true,
  },

  text: {
    type: String,
    default: 'Đang tải dữ liệu...',
  },
  hasSidebar: {
    type: Boolean,
    default: true,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '36px',
  },
})
</script>

<template>
  <div
    v-if="loading || (error && Object.keys(error).length)"
    class="container-state"
    :class="{ 'has-sidebar': hasSidebar, overlay }"
  >
    <!-- Error -->
    <div v-if="Object.keys(error).length" class="error-box">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ error.general || 'Đã xảy ra lỗi!' }}</span>
    </div>

    <!-- Loading -->
    <div v-else class="loading-box">
      <div class="spinner" :style="{ width: width, height: width }"></div>
      <span v-if="showText">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.container-state {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}
.container-state.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(2px);
}
/* Loading */
.loading-box {
  position: fixed;
  top: 0;

  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* Có sidebar */
.container-state.has-sidebar .loading-box {
  left: var(--sidebar-width);
  top: 20%;
}

/* Không có sidebar */
.container-state:not(.has-sidebar) .loading-box {
  left: 0;
  top: 0;
}

.spinner {
  border: 4px solid #ddd;
  border-top-color: var(--color-bule-2);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-box span {
  font-size: 14px;
  color: var(--text-gray-2);
}

/* Error */
.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--text-red);
  background: #fff;
  border-radius: 8px;
}

.error-box i {
  font-size: 18px;
}

.error-box span {
  font-size: 14px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 768px) {
  .loading-box {
    left: 0;
  }
}
</style>
