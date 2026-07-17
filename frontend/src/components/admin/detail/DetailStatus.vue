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
  border-left: 4px solid var(--bg-active);
  padding-left: 10px;
}
.card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-gray);
  background: white;
}

.description {
  color: var(--text-gray-3);
}
</style>
