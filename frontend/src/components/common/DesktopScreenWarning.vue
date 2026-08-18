<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  minWidth: {
    type: Number,
    default: 1024,
  },
})

const show = ref(false)

const checkScreenSize = () => {
  show.value = window.innerWidth < props.minWidth
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div v-if="show" class="screen-warning">
    <div class="screen-warning-content">
      <i class="fa-solid fa-desktop"></i>

      <h3>Màn hình quá nhỏ</h3>

      <p>Vui lòng sử dụng máy tính hoặc thiết bị có màn hình lớn hơn để có trải nghiệm tốt nhất.</p>

      <span> Kích thước đề nghị: từ {{ minWidth }}px </span>
    </div>
  </div>
</template>

<style scoped>
.screen-warning {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: #fff;
}

.screen-warning-content {
  max-width: 420px;

  text-align: center;
}

.screen-warning-content i {
  margin-bottom: 20px;

  font-size: 48px;
  color: #666;
}

.screen-warning-content h3 {
  margin-bottom: 10px;

  font-size: 22px;
  font-weight: 600;
}

.screen-warning-content p {
  margin-bottom: 10px;

  color: #666;
  line-height: 1.6;
}

.screen-warning-content span {
  font-size: 13px;
  color: #999;
}
</style>
