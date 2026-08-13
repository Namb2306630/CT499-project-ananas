<script setup>
import { ROUTE_NAMES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toast';
import { onMounted, computed, ref } from 'vue';
const BASE_URL = import.meta.env.VITE_BACKEND
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const router = useRouter()
const toastStore = useToastStore()
const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}
onMounted(async () => {
  await authStore.getMe()
})

const avatarUrl = computed(() => {
  if (!user.value?.avatar) {
    return ''
  }
  // Avatar là URL đầy đủ
  if (user.value.avatar.startsWith('http')) {
    return user.value.avatar
  }

  // Avatar là đường dẫn file trên BE
  return `${BASE_URL}/${user.value.avatar}`
})
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
      <RouterLink to="#">
        <i class="fa-brands fa-shopify"></i>
        <p>Giỏ hàng</p>
      </RouterLink>
      <RouterLink v-if="!user" :to="{ name: ROUTE_NAMES.LOGIN }">
        <i class="fa-solid fa-user"></i>
        <p>Đăng nhập</p>
      </RouterLink>
      <div v-else class="user-menu-wrapper">
        <div class="auth-user" @click="toggleUserMenu" :class="{ 'user-menu': isUserMenuOpen }">
          <img :src="avatarUrl" alt="avatar" class="avatar" />
          <p>{{ user.userName }}</p>
        </div>
        <div v-if="isUserMenuOpen" class="user-dropdown">
          <RouterLink to="#">
            <i class="fa-solid fa-user"></i>
            <span>Tài khoản</span>
          </RouterLink>
          <RouterLink to="#">
            <i class="fa-solid fa-cube"></i>
            <span>Đơn mua</span>
          </RouterLink>
          <button @click="handleLogout" class="m-0">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
.user-menu-wrapper {
  position: relative;
}

.auth-user {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.auth-user:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.user-menu {
  background-color: rgba(0, 0, 0, 0.2);
}

.user-dropdown {
  position: absolute;
  min-width: 180px;
  background-color: var(--bg-footer-color);
  border-radius: 5px;
  padding: 5px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.user-dropdown a,
.user-dropdown button {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 8px;
  border: none;
  background: none;
  text-decoration: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
}



.user-dropdown i {
  width: 18px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.header-box {
  background-color: var(--bg-footer-color);

}

.header-box-inner {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin: 0 60px 0 0;
}

.header-box-inner a:hover i,
.header-box-inner a:hover p,
.user-dropdown a:hover,
.user-dropdown button:hover {
  color: var(--color-23);
}

.header-box-inner .auth-user,
.header-box-inner a {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  padding: 5px 8px;
  transition: background-color 0.2s ease;
}

.header-box-inner div:not(.user-dropdown):hover,
.header-box-inner a:hover,
.user-dropdown button:hover {
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.header-box-inner .auth-user:hover p {
  color: var(--color-23);
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