<script setup>
defineProps({
  title: {
    type: String,
    default: 'Thông tin cơ bản',
  },
  sizeTitle: {
    type: String,
    default: '24px',
  },
  icon: {
    type: String,
    default: 'info',
  },

  iconType: {
    type: String,
    default: 'material', // material | fa
  },
  iconColor: {
    type: String,
    default: 'var(--color-bule)',
  },
})
</script>

<template>
  <div class="basic-info-card">
    <div class="card-header">
      <!-- Material -->
      <span
        v-if="iconType === 'material'"
        class="material-symbols-outlined"
        :style="{ color: iconColor }"
      >
        {{ icon }}
      </span>

      <!-- FontAwesome -->
      <i
        v-else-if="iconType === 'fa'"
        :class="icon"
        class="iconI"
        :style="{ color: iconColor }"
      ></i>

      <p :style="{ fontSize: sizeTitle }">{{ title }}</p>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.card-header p {
  margin: 0;
  font-weight: 700;
  color: var(--text-gray-4);
}

.card-header span {
  font-size: 25px;
}

.card-header .fa-solid {
  font-size: 20px;
  padding-left: 12px;
  margin-right: 13px;
}

.info-card-1 {
  padding: 10px 30px 30px 30px;
  margin-top: 0;
}
</style>
