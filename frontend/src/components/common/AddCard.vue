<script setup>
defineProps({
  content: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click']) //giửi dữ liệu ra ngoài

const openForm = () => {
  emit('click')
}
</script>
<template>
  <button class="card-add" @click="openForm">
    <div>
      <div class="box-icon"><i class="fa-solid fa-plus"></i></div>
      <p class="p-0 m-0">{{ content }}</p>
    </div>
  </button>
</template>
<style scoped>
.card-add {
  border: 3px dashed var(--border-gray-3);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  transition: all 0.3s ease;
  min-height: 370px;
}

.card-add i {
  color: var(--text-gray-3);
  font-size: var(--font-size-lg);
}

.card-add p {
  font-weight: var(--font-width-lg);
  color: var(--text-gray-3);
  font-size: var(--font-size-md);
}

.card-add:hover {
  box-shadow: var(--shadow-black-2);
  transform: translateY(-10px) scale(1.02);
}

.card-add div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.box-icon {
  background-color: var(--bg-color-4);
  border-radius: 5px;
  padding: 8px;
}
</style>
