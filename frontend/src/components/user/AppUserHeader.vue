<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { onMounted, computed, ref } from 'vue'
import LoadingState from '../common/LoadingState.vue'

const BASE_URL = import.meta.env.VITE_BACKEND
const authStore = useAuthStore()
const cartStore = useCartStore()
const { user } = storeToRefs(authStore)
const { cart } = storeToRefs(cartStore)
const router = useRouter()
const toastStore = useToastStore()
const isUserMenuOpen = ref(false)
const pageLoading = ref(false)
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  await authStore.getMe()

  if (authStore.user) {
    await cartStore.fetchCart()
  }
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
  pageLoading.value = true
  try {
    await delay(500)
    await authStore.logout()
    cartStore.cart = {
      items: [],
    }
    await router.replace({
      name: ROUTE_NAMES.HOME,
    })
  } catch {
    toastStore.showToast('Lỗi đăng xuất, vui lòng thử lại!!', 'error')
  } finally {
    pageLoading.value = false
  }
}
</script>

<template>
  <LoadingState
    v-if="pageLoading"
    :loading="pageLoading"
    :has-sidebar="false"
    :overlay="true"
    :show-text="false"
    width="30px"
  />
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
      <div class="cart-wrapper">
        <RouterLink :to="{ name: ROUTE_NAMES.YOU_CART }" class="cart-link">
          <i class="fa-brands fa-shopify"></i>
          <p>
            Giỏ hàng
            <span v-if="cart?.items?.length"> ({{ cart.items.length }}) </span>
          </p>
        </RouterLink>

        <div v-if="!cart?.items?.length" class="cart-dropdown">
          <div class="empty-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            <p>Giỏ hàng trống</p>
            <span>Chưa có sản phẩm nào trong giỏ hàng</span>
          </div>
        </div>
      </div>
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
          <RouterLink :to="{ name: ROUTE_NAMES.MY_ORDERS }">
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

/* .header-box-inner div:not(.user-dropdown):hover, */
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

.cart-wrapper {
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 5px 8px;
}

.cart-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  padding: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(5px);

  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
}

.cart-wrapper:hover .cart-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-cart i {
  font-size: 32px;
  color: #999;
  margin-bottom: 10px;
}

.empty-cart p {
  margin: 0 0 5px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.empty-cart span {
  color: #777;
  font-size: 13px;
}
</style>
