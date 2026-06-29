<script setup>
import { useRoute } from 'vue-router'

import avatar from '@/assets/images/hinh-anh-avatar-ngau-nu-1.jpg'

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
</script>

<template>
  <Teleport to="body">
    <div class="sidebar-overlay" :class="{ show: isShow }" @click="closeMenu"></div>
  </Teleport>

  <div class="sidebar" :class="{ show: isShow }" @click="handleLinkClick">
    <router-link to="/admin/profile" class="text-decoration-none">
      <div class="profile">
        <img :src="avatar" alt="avatar" />
        <div>
          <p class="p-0 m-0">Admin</p>
          <p class="p-0 m-0">admin123@gmail.com</p>
        </div>
      </div>
    </router-link>

    <div class="title">
      <div>
        <router-link
          to="/admin/dashboard"
          :class="{
            active: route.path === '/admin' || route.path === '/admin/dashboard',
          }"
        >
          <span class="material-symbols-outlined"> dashboard </span>
          <p>Trang Chủ</p>
        </router-link>
      </div>

      <div>
        <router-link to="/admin/categories">
          <span class="material-symbols-outlined"> category </span>
          <p>Danh Mục</p>
        </router-link>
      </div>

      <div>
        <router-link to="/admin/users">
          <span class="material-symbols-outlined"> group </span>
          <p>Nhân viên</p>
        </router-link>
      </div>

      <div>
        <router-link to="/admin/brands">
          <i class="fa-regular fa-font-awesome" style="font-size: 20px"></i>
          <p>Thương Hiệu</p>
        </router-link>
      </div>

      <div>
        <router-link to="/admin/product-lines">
          <span class="material-symbols-outlined"> inventory_2 </span>
          <p>Dòng Sản Phẩm</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/styles">
          <span class="material-symbols-outlined" style="font-size: 25px"> style </span>
          <p>Kiểu Dáng</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/collections"
          ><span class="material-symbols-outlined"> collections_bookmark </span>
          <p>Bộ Sưu Tập</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/products">
          <span class="material-symbols-outlined"> inventory </span>
          <p>Sản Phẩm</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/product-variants">
          <span class="material-symbols-outlined"> format_color_fill </span>
          <p>Biến Thể Sản Phẩm</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/product-variant-items">
          <span class="material-symbols-outlined"> package_2 </span>
          <p>SKU</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/orders">
          <span class="material-symbols-outlined"> orders </span>
          <p>Đơn Hàng</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/404">
          <i class="fa-solid fa-link-slash" style="font-size: 20px"></i>
          <p>Lỗi Trang</p></router-link
        >
      </div>

      <div>
        <router-link to="/admin/settings">
          <i class="fa-solid fa-gears"></i>
          <p>Cài Đặt Hệ Thống</p></router-link
        >
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

.title div {
  margin-top: 4px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.title div:hover {
  background-color: var(--bg-hover);
  transform: translateX(6px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.title a .material-symbols-outlined,
.title a .fa-solid {
  transition: transform 0.3s ease;
}

.title div:hover .material-symbols-outlined,
.title div:hover .fa-solid {
  transform: translateX(5px);
}

.title a.router-link-active,
.title a.router-link-exact-active {
  background-color: var(--bg-active);
  border-radius: 8px;
  color: var(--text-white);
  font-weight: 600;
}

.title div:hover p {
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
  margin-top: auto;
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
