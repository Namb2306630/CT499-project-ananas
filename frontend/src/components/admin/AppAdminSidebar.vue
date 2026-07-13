<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import avatar from '@/assets/images/hinh-anh-avatar-ngau-nu-1.jpg'
import { ROUTE_NAMES } from '@/constants/routes'
const route = useRoute()

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

const showSystemConfigMenu = ref(false)

const toggleSystemConfigMenu = () => {
  showSystemConfigMenu.value = !showSystemConfigMenu.value
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

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.ORDERS }"
          :class="{ active: route.name === ROUTE_NAMES.ORDERS }"
        >
          <span class="material-symbols-outlined"> orders </span>
          <p>Đơn Hàng</p></RouterLink
        >
      </div>

      <div>
        <RouterLink :to="{ name: ROUTE_NAMES.CATEGORIES }">
          <span class="material-symbols-outlined"> category </span>
          <p>Danh Mục</p>
        </RouterLink>
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.USERS }"
          :class="{ active: route.name === ROUTE_NAMES.USERS }"
        >
          <span class="material-symbols-outlined"> group </span>
          <p>Nhân viên</p>
        </RouterLink>
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.BRANDS }"
          :class="{ active: route.name === ROUTE_NAMES.BRANDS }"
        >
          <i class="fa-regular fa-font-awesome" style="font-size: 20px"></i>
          <p>Thương Hiệu</p>
        </RouterLink>
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.PRODUCT_LINES }"
          :class="{ active: route.name === ROUTE_NAMES.PRODUCT_LINES }"
        >
          <span class="material-symbols-outlined"> inventory_2 </span>
          <p>Dòng Sản Phẩm</p></RouterLink
        >
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.STYLES }"
          :class="{ active: route.name === ROUTE_NAMES.STYLES }"
        >
          <span class="material-symbols-outlined" style="font-size: 25px"> style </span>
          <p>Kiểu Dáng</p></RouterLink
        >
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.COLLECTIONS }"
          :class="{ active: route.name === ROUTE_NAMES.COLLECTIONS }"
        >
          <span class="material-symbols-outlined"> collections_bookmark </span>
          <p>Bộ Sưu Tập</p></RouterLink
        >
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.PRODUCTS }"
          :class="{ active: route.name === ROUTE_NAMES.PRODUCTS }"
        >
          <span class="material-symbols-outlined"> inventory </span>
          <p>Sản Phẩm</p></RouterLink
        >
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.PRODUCT_VARIANTS }"
          :class="{ active: route.name === ROUTE_NAMES.PRODUCT_VARIANTS }"
        >
          <span class="material-symbols-outlined"> format_color_fill </span>
          <p>Biến Thể Sản Phẩm</p></RouterLink
        >
      </div>

      <div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS }"
          :class="{ active: route.name === ROUTE_NAMES.PRODUCT_VARIANT_ITEMS }"
        >
          <span class="material-symbols-outlined"> package_2 </span>
          <p>SKU</p></RouterLink
        >
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
  min-height: 100%;
  height: 100%;
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
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
  max-height: 200px;
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
