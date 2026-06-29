<script setup>
import Logo from '../../assets/images/ananas_logo.svg'

const props = defineProps({
  isShow: Boolean,
  handle: Function,
})
</script>

<template>
  <div class="header p-0 m-0">
    <div class="row p-0 m-0">
      <!-- Nút toggle -->
      <div class="logo">
        <Logo />
      </div>

      <div class="caption">
        <p class="p-0 m-0">Quản lý thông minh – Đột phá doanh thu</p>
      </div>

      <div class="toggle-global" @click="props.handle">
        <i v-if="isShow" class="fa-solid fa-bars"></i>
        <i v-if="!isShow" class="fa-solid fa-bars-staggered"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-color: var(--bg-footer-color);
  border-bottom: 1px solid var(--border-gray);
  width: 100%;
  display: flex;
  align-items: center;
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  width: 100px;
  margin-left: 10px;
}
.logo:hover {
  cursor: pointer;
}

.toggle-global {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: var(--text-white);
  font-size: 25px;
}

.toggle-global:hover {
  cursor: pointer;
  color: var(--text-hover);
}

.caption {
  font-style: italic;
  color: var(--text-white);
}

@media (max-width: 767px) {
  .caption {
    display: none;
  }
}
</style>
