<script setup>
defineProps({
  title: {
    type: String,
    default: 'Thông tin cơ bản',
  },
  icon: {
    type: String,
    default: 'info',
  },

  iconType: {
    type: String,
    default: 'material', // material | fa
  },
})
</script>

<template>
  <div class="basic-info-card">
    <div class="card-header">
      <!-- Material -->
      <span v-if="iconType === 'material'" class="material-symbols-outlined">
        {{ icon }}
      </span>

      <!-- FontAwesome -->
      <i v-else-if="iconType === 'fa'" :class="icon" class="iconI"></i>

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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.card-header span {
  color: var(--color-bule);
  font-size: 25px;
  /* border-left: 4px solid var(--color-bule);
  padding-left: 12px; */
}

.card-header .fa-solid {
  font-size: 20px;
  padding-left: 12px;
  color: rgb(230, 230, 20);
  margin-right: 13px;
}

.card-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-gray-4);
}

.info-card-1 {
  padding: 10px 30px 30px 30px;
}

.iconI {
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: start;
}
</style>
