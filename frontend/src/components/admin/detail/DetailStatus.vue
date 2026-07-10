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

/* nút hiển thị website */
.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 16px;
  margin-top: 10px;
}

.content {
  flex: 1;
  min-width: 0;
}

.switch {
  flex-shrink: 0;
  width: 45px;
  height: 24px;
  position: relative;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background: var(--color-7);
  border-radius: 30px;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: var(--color-4);
}


/* nút tròn */
.switch input:checked + .slider::before {
  transform: translateX(21px);
}
</style>
