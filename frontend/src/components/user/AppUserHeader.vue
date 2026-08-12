<script setup>
import { ROUTE_NAMES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const toastStore = useToastStore()
const handleLogout = async () => {
  const res = await authStore.logout()
  if (res.code === 200) {
    router.push({ name: ROUTE_NAMES.HOME })
  } else {
    toastStore.showToast("Lỗi đăng xuất, vui lòng thử lại!!", 'error')
  }
}
</script>

<template>
  <header class="header-box">
    <div class="header-box-inner">
      <RouterLink to="#">
        <i class="fa-solid fa-cube"></i>
        <p>Tra cứu đơn hàng</p>
      </RouterLink>
      <RouterLink to="#">
        <i class="fa-solid fa-location-dot"></i>
        <p>Tìm cửa hàng</p>
      </RouterLink>
      <RouterLink to="#">
        <i class="fa-solid fa-heart"></i>
        <p>Yêu thích</p>
      </RouterLink>
      <RouterLink v-if="!user" :to="{ name: ROUTE_NAMES.LOGIN }">
        <i class="fa-solid fa-user"></i>
        <p>Đăng nhập</p>
      </RouterLink>

      <div v-else>
        <i class="fa-solid fa-right-from-bracket"></i>
        <p>Đăng xuất</p>
      </div>
      <RouterLink to="#">
        <i class="fa-brands fa-shopify"></i>
        <p>Giỏ hàng</p>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header-box {
  background-color: var(--bg-footer-color);

}

.header-box-inner {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  gap: 10px;
  margin: 0 60px 0 0;
}

.header-box-inner a,
.header-box-inner div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  text-decoration: none;
}

.header-box-inner a:hover i,
.header-box-inner a:hover p {
  color: var(--color-23);

}

.header-box-inner a:hover {
  cursor: pointer;
}

.header-box-inner a i {
  color: white;
  font-size: 15px;
}

.header-box-inner p {
  margin: 0;
  color: white;
  padding: 5px;
  font-size: 15px;
}
</style>