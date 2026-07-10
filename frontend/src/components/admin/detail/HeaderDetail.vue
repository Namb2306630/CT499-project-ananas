<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

defineProps({
  titleGoBack: {
    type: String,
    default: 'Chi tiết',
  },
  titleDelete: {
    type: String,
    default: 'Xóa',
  },
})

const emit = defineEmits(['delete'])
</script>

<template>
  <div class="header-container">
    <div class="header-detail">
      <div class="back-link" @click="goBack">
        <i class="fa-solid fa-left-long"></i>
        {{ titleGoBack }}
      </div>

      <div class="delete-btn" @click="emit('delete')">
        <i class="fa-regular fa-trash-can"></i>
        {{ titleDelete }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0 15px;
}

.header-container {
  border-bottom: 1px solid var(--border-gray-3);
  padding: 20px;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-color-red);
  font-size: var(--font-size-md);
  font-weight: var(--font-width-lg);
  cursor: pointer;
  transition: 0.3s;
}

.delete-btn i {
  display: inline-block;
  transition: 0.3s;
}

.delete-btn:hover {
  color: var(--color-red-1);
}

.delete-btn:hover i {
  transform: rotate(20deg);
}

.back-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-grey);
  text-decoration: none;
  font-size: 20px;
  font-weight: var(--font-width-md);
  transition: 0.3s;
}

.back-link i {
  display: inline-block;
  transition: 0.3s;
}

.back-link:hover {
  color: var(--color-active);
  cursor: pointer;
}

.back-link:hover i {
  transform: translateX(-8px);
}

@media (max-width: 767px) {
  .header-detail {
    padding: 0;
  }

  .header-container {
    padding: 10px;
  }
}
</style>
