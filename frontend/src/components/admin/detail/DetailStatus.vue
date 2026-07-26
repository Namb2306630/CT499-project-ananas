<script setup>
const model = defineModel({
  type: Boolean,
  default: false,
})

defineProps({
  title: {
    type: String,
    default: 'Trạng thái',
  },

  label: {
    type: String,
    default: 'Hiển thị trên website',
  },

  description: {
    type: String,
    default: 'Khách hàng có thể thấy dữ liệu này',
  },
  lists: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: 'fa-solid fa-check-double',
  },

  iconType: {
    type: String,
    default: 'fa', // material | fa
  },
  iconColor: {
    type: String,
    default: 'var(--color-bule)',
  },
})
</script>

<template>
  <div class="card status">
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
      <p>{{ title }}</p>
    </div>
    <div class="content-box">
      <label class="switch-container">
        <div class="content">
          <h5 class="p-0 m-0">
            {{ label }}
          </h5>

          <p class="p-0 m-0 description">
            {{ description }}
          </p>
        </div>

        <div class="switch">
          <input type="checkbox" v-model="model" />

          <span class="slider"></span>
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped>
@import '../../../assets/css/swtich.css';
@import '../../../assets/css/detail-card.css';

.switch-container {
  padding: 16px;
  border-radius: 12px;
  background: var(--bg-color-while-2);
  border: 1px solid var(--border-gray-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card {
  border-radius: 12px;
  box-shadow: var(--shadow-gray);
  background: white;
}

.description {
  margin-top: 6px;
  font-size: 13px;
  color: #8b8b8b;
  line-height: 1.5;
}
</style>
