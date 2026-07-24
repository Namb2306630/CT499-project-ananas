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
})
</script>

<template>
  <div class="card status">
    <h4>{{ title }}</h4>

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
</template>

<style scoped>
@import '../../../assets/css/swtich.css';

h4 {
  margin-bottom: 18px;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
  font-size: 18px;
}

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
  padding: 20px;
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
