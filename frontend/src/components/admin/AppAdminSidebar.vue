<script setup>
import { useRoute } from 'vue-router'
import avatar from '@/assets/images/hinh-anh-avatar-ngau-nu-1.jpg'
import { ROUTE_NAMES } from '@/constants/routes'
import { useUiStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
const route = useRoute()
const uiStore = useUiStore()
const props = defineProps({
  isShow: Boolean,
  handle: Function,
})

//đóng menu
const closeMenu = () => {
  if (props.isShow) {
    props.handle()
  }
}

const handleLinkClick = (e) => {
  if (window.innerWidth <= 767) {
    // cái click có nằm trong thẻ a ko
    if (e.target.closest('a')) {
      closeMenu()
    }
  }
}

const { showProductMenu, showOrderMenu, showUserMenu, showSystemConfigMenu } = storeToRefs(uiStore)

const toggleSystemConfigMenu = () => {
  showSystemConfigMenu.value = !showSystemConfigMenu.value
}
const toggleProductMenu = () => {
  showProductMenu.value = !showProductMenu.value
}
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
const toggleOrderMenu = () => {
  showOrderMenu.value = !showOrderMenu.value
}

const isActiveMenu = (menuName) => {
  return route.name === menuName || route.meta.activeMenu === menuName
}
</script>

<template>
  <Teleport to="body">
    <div class="sidebar-overlay" :class="{ show: isShow }" @click="closeMenu"></div>
  </Teleport>

  <div class="sidebar" :class="{ show: isShow }" @click="handleLinkClick">
    <RouterLink :to="{ name: ROUTE_NAMES.PROFILE }" class="text-decoration-none">
      <div class="profile">
        <img :src="avatar" alt="avatar" />
        <div>
          <p class="p-0 m-0">Admin</p>
          <p class="p-0 m-0">admin123@gmail.com</p>
        </div>
      </div>
    </RouterLink>

    <div class="title">
      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.DASHBOARD }"
          :class="{ active: route.name === ROUTE_NAMES.DASHBOARD }"
        >
          <span class="material-symbols-outlined"> dashboard </span>
          <p>Trang Chủ</p>
        </RouterLink>
      </div>

      <!-- QUẢN LÝ SẢN PHẨM -->
      <div class="menu-item">
        <div class="menu-parent" @click="toggleProductMenu">
          <div class="menu-title">
            <span class="material-symbols-outlined"> inventory_2 </span>
            <p>Quản Lý Sản Phẩm</p>
          </div>

          <i class="fa-solid fa-chevron-down" :class="{ rotate: showProductMenu }"></i>
        </div>

        <!--  :class="{ active: route.name === ROUTE_NAMES.PRODUCT_LINES }" -->
        <Transition name="slide">
          <div v-if="showProductMenu" class="submenu">
            <RouterLink
              :to="{ name: ROUTE_NAMES.CATEGORIES }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.CATEGORIES) }"
            >
              Danh Mục
            </RouterLink>
            <RouterLink
              :to="{ name: ROUTE_NAMES.BRANDS }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.BRANDS) }"
            >
              Thương Hiệu
            </RouterLink>
            <RouterLink
              :to="{ name: ROUTE_NAMES.PRODUCT_LINES }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.PRODUCT_LINES) }"
            >
              Dòng Sản Phẩm</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.PRODUCT_TYPES }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.PRODUCT_TYPES) }"
            >
              Loại Sản Phẩm</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.STYLES }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.STYLES) }"
            >
              Kiểu Dáng</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.COLLECTIONS }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.COLLECTIONS) }"
            >
              Bộ Sưu Tập</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.PRODUCTS }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.PRODUCTS) }"
            >
              Sản Phẩm</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.PRODUCT_VARIANTS }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.PRODUCT_VARIANTS) }"
            >
              Biến Thể Sản Phẩm</RouterLink
            >
            <RouterLink
              :to="{ name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS }"
              :class="{ active: isActiveMenu(ROUTE_NAMES.PRODUCT_VARIANT_ITEMS) }"
            >
              SKU</RouterLink
            >
          </div>
        </Transition>
      </div>

      <!-- Quản lý bán hàng -->
      <div class="menu-item">
        <div class="menu-parent" @click="toggleOrderMenu">
          <div class="menu-title">
            <span class="material-symbols-outlined"> receipt_long </span>
            <p>Quản Lý Bán Hàng</p>
          </div>

          <i class="fa-solid fa-chevron-down" :class="{ rotate: showOrderMenu }"></i>
        </div>

        <Transition name="slide">
          <div v-if="showOrderMenu" class="submenu">
            <RouterLink :to="{ name: ROUTE_NAMES.ORDERS }"> Đơn Hàng</RouterLink>
          </div>
        </Transition>
      </div>

      <!-- Quản lý người dùng -->
      <div class="menu-item">
        <div class="menu-parent" @click="toggleUserMenu">
          <div class="menu-title">
            <span class="material-symbols-outlined"> group </span>
            <p>Quản Lý Người Dùng</p>
          </div>

          <i class="fa-solid fa-chevron-down" :class="{ rotate: showUserMenu }"></i>
        </div>

        <Transition name="slide">
          <div v-if="showUserMenu" class="submenu">
            <RouterLink :to="{ name: ROUTE_NAMES.USERS }"> Nhân viên </RouterLink>
          </div>
        </Transition>
      </div>

      <div class="menu-item">
        <div class="menu-parent" @click="toggleSystemConfigMenu">
          <div class="menu-title">
            <i class="fa-solid fa-gears"></i>
            <p>Cài Đặt Hệ Thống</p>
          </div>

          <i class="fa-solid fa-chevron-down" :class="{ rotate: showSystemConfigMenu }"></i>
        </div>

        <Transition name="slide">
          <div v-if="showSystemConfigMenu" class="submenu">
            <RouterLink :to="{ name: ROUTE_NAMES.SYSTEM_CONFIG }"> Cấu hình chung </RouterLink>

            <RouterLink :to="{ name: ROUTE_NAMES.NOT_FOUND }"> Cấu hình trang lỗi </RouterLink>
          </div>
        </Transition>
      </div>
    </div>
    <div class="logout">
      <i class="fa-solid fa-right-from-bracket"></i>
      <p>Đăng xuất</p>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  background-color: var(--bg-sidebar-admin-color);

  width: 100%;
  flex: 1;

  padding: 15px 10px;

  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}

.sidebar::-webkit-scrollbar {
  display: none; /* Chrome */
}

.title {
  margin-top: 10px;
}

.title a {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-white);
  font-size: var(--font-size-md);
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.title p {
  margin: 0;
  padding: 0;
  transition: transform 0.3s ease;
}

.title > div:not(.menu-item) {
  margin-top: 4px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.title > div:not(.menu-item):hover {
  background-color: var(--bg-hover);
  transform: translateX(6px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.title a .material-symbols-outlined,
.title a .fa-solid {
  transition: transform 0.3s ease;
}

.title > div:not(.menu-item):hover .material-symbols-outlined,
.title > div:not(.menu-item):hover .fa-solid {
  transform: translateX(5px);
}

.title a.router-link-active,
.title a.router-link-exact-active {
  background-color: var(--bg-active);
  border-radius: 8px;
  color: var(--text-white);
  font-weight: 600;
}

.title > div:not(.menu-item):hover p {
  transform: translateX(3px);
}

.title a.active {
  background-color: var(--bg-active);
  border-radius: 8px;
  color: var(--text-white);
  font-weight: 600;
}

.menu-btn {
  display: none;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px;
  border-bottom: 1px solid var(--border-gray);

  border-radius: 18px;
  transition: all 0.25s ease;
}
.profile:hover {
  background: var(--bg-hover);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
.profile img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.profile p {
  margin: 0;
  padding: 0;
  max-width: 200px; /* giới hạn chiều ngang */
  white-space: nowrap; /* không xuống dòng */
  overflow: hidden; /* ẩn phần dư */
  text-overflow: ellipsis; /* ... */
  color: var(--text-white);
}

.profile div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logout {
  display: flex;
  border-radius: 8px;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  color: var(--text-red);
  cursor: pointer;
  font-size: var(--font-size-md);
  /* margin-top: auto; */
}

.logout:hover {
  background-color: var(--bg-hover-red);
}

.logout p {
  padding: 0;
  margin: 0;
  font-weight: var(--font-width-md);
}

.logout i {
  padding: 0;
  margin: 0;
  transition: all 0.3s ease;
}

.logout:hover i {
  transform: translateX(10px);
}

/* menu */

.menu-item {
  margin-top: 4px;
}

.menu-parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 8px;
  color: var(--text-white);
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.menu-parent:hover {
  background: var(--bg-hover);
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-title i {
  width: 20px;
  text-align: center;
  font-size: 18px;
}

.menu-title p {
  margin: 0;
  font-size: var(--font-size-md);
}

.menu-parent .fa-chevron-down {
  font-size: 13px;
  transition: transform 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

.submenu {
  margin-top: 4px;
  margin-left: 18px;
  padding-left: 18px;
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}

.submenu a {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  margin: 4px 0;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.25s ease;
}

.submenu a::before {
  content: '';
  width: 6px;
  height: 6px;
  margin-right: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  transition: background-color 0.25s ease;
}

.submenu a:hover {
  background: var(--bg-hover);
  color: #fff;
  transform: translateX(4px);
}

.submenu a:hover::before {
  background: var(--color-9);
}

.submenu .router-link-active,
.submenu .router-link-exact-active {
  background: var(--bg-active);
  color: #fff;
  font-weight: 600;
}

.submenu .router-link-active::before,
.submenu .router-link-exact-active::before {
  background: var(--color-9);
}

/* transion */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: auto;
}
@media (max-width: 767px) {
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
  }

  /* màu nềm  sau xám */
  .sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 260px;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
