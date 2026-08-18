<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
import LogoApp from '../common/LogoApp.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config.js'
import { formatFreeShip } from '@/utils/formatCurrency'
import { useCategoryStore } from '@/stores/caterory.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const DiscoverYOU = '/banners/DiscoverYOU.svg'
const BASE_URL = import.meta.env.VITE_BACKEND
const categoryStore = useCategoryStore()
const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)
const { categories } = storeToRefs(categoryStore)
const currentIndex = ref(0)
const direction = ref('next')
let timer

onMounted(async () => {
  await systemConfigStore.getForUser()
  await categoryStore.fetchCategoriesForUser()

  timer = setInterval(() => {
    nextMessage()
  }, 3000)
})

const messages = computed(() => [
  `Miễn phí vận chuyển cho đơn hàng từ ${formatFreeShip(systemConfig.value?.freeShippingThreshold)}`,
  'Đổi trả trong vòng 30 ngày - bảo hành 2 năm',
  'Khám phá bộ sưu tập mới nhất',
  'Săn sale cùng Shin nào!!!',
])

const nextMessage = () => {
  direction.value = 'next'
  currentIndex.value = (currentIndex.value + 1) % messages.value.length
}
const prevMessage = () => {
  direction.value = 'prev'
  currentIndex.value = (currentIndex.value - 1 + messages.value.length) % messages.value.length
}

const activeMenu = ref(null)

const handleMenu = (categoryId) => {
  activeMenu.value = activeMenu.value === categoryId ? null : categoryId
}

const routerDiscoverYou = () => {
  router.push({ name: ROUTE_NAMES.DISCOVER_YOU })
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <header class="header-box">
    <div class="header-box-inner container-custom">
      <LogoApp
        class="header-logo"
        color-icon="var(--color-23)"
        color-text="var(--color-23)"
        size-text="35px"
        size="50px"
      />
      <div class="category-box">
        <template v-for="(category, index) in categories" :key="category._id">
          <div class="category">
            <div
              class="category-title"
              @click="handleMenu(category._id)"
              :class="{ 'click-menu': activeMenu === category._id }"
            >
              {{ category.name }}

              <i
                v-if="category.children?.length || category.megaMenu?.enabled"
                class="fa-solid"
                :class="activeMenu === category._id ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </div>
            <!-- MENU THƯỜNG: children -->
            <div
              v-if="category.children?.length"
              :class="{
                'category-dropdown': activeMenu === category._id,
              }"
            >
              <div
                class="category-dropdown-innert"
                :class="{
                  'show-menu': activeMenu === category._id,
                }"
              >
                <div v-for="child in category.children" :key="child._id" class="category-child">
                  <img v-if="child.image" :src="`${BASE_URL}/${child.image}`" :alt="child.name" />

                  <span>{{ child.name }}</span>
                </div>

                <p>
                  Mọi người thường gọi chúng tôi là
                  <span>Dứa</span>!
                </p>
              </div>
            </div>
            <!-- MEGA MENU -->
            <div
              v-if="category.megaMenu?.enabled"
              class="mega-menu"
              :class="{ 'show-menu': activeMenu === category._id }"
            >
              <div class="mega-menu-inner">
                <div
                  v-for="section in category.megaMenu.sections"
                  :key="section.type"
                  class="mega-menu-section"
                >
                  <h3>
                    {{ section.title }}
                  </h3>
                  <div v-for="item in section.items" :key="item._id" class="mega-menu-item">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="index < categories.length - 1" class="border"></div>
        </template>
        <div class="border"></div>
        <div class="discover-you" @click="routerDiscoverYou">
          <img :src="DiscoverYOU" alt="DiscoverYOU" />
        </div>
      </div>

      <div class="box-search">
        <input class="search" type="text" placeholder="Tìm kiếm" />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  </header>
  <div class="title-animation">
    <!-- Nút trái -->
    <button class="arrow" @click="prevMessage">
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <!-- Nội dung -->
    <div class="message-wrapper">
      <Transition :name="direction">
        <div :key="currentIndex" class="message">
          {{ messages[currentIndex] }}
        </div>
      </Transition>
    </div>

    <!-- Nút phải -->
    <button class="arrow" @click="nextMessage">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<style scoped>
.header-logo {
  transform: translateY(8px);
}
/* mega menu */
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 30px 0;
  background-color: var(--bg-footer-color);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: none;
}

/* c */

.box-search {
  width: 280px;
  height: 42px;
  box-sizing: border-box;
  border: 1px solid var(--color-7);
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.border {
  width: 2px;
  height: 25px;
  background-color: var(--color-7);
  flex-shrink: 0;
}

.discover-you {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.discover-you img {
  display: block;
  height: 60px;
  width: auto;
}

.click-menu {
  color: var(--color-23);
  position: relative;
}

.click-menu::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-23);
}

.mega-menu.show-menu {
  display: block;
}

.mega-menu-inner {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  max-width: var(--max-width);
}

.mega-menu-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 2px dashed var(--border-gray);
}

.mega-menu-section h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}

.mega-menu-item {
  font-size: 15px;
  color: var(--text-bg);
  cursor: pointer;
}

.mega-menu-item:hover {
  color: var(--color-23);
}

.category-dropdown p {
  /* Kéo dài qua cả 4 cột */
  grid-column: 1/-1;
  text-align: center;
  color: #ccc;
  margin: 5px 0 0;
  text-transform: uppercase;
  font-style: italic;
}

.category-dropdown p span {
  color: var(--color-23);
  font-weight: 600;
}

.category-box {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.category {
  display: flex;
  align-items: flex-end;
}

.category-title {
  height: auto;
  padding: 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;
}

.category-title:hover {
  color: var(--color-23);
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 25px;
  box-sizing: border-box;
  background: var(--bg-footer-color);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.category-dropdown-innert {
  width: var(--max-width);
  margin: 0 auto;
  display: none;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-dropdown-innert.show-menu {
  display: grid;
}

.category-child {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
}

.category-child img {
  width: 280px;
  object-fit: cover;
  opacity: 0.7;
}

.category-child span {
  color: white;
  font-weight: 500;
  font-size: 22px;
}

.category-child:hover img {
  opacity: 1;
}

.category-child:hover span {
  color: var(--color-23);
}

.header-box-inner {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr 280px;
  align-items: end;
  gap: 30px;
}

.header-box {
  position: relative;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
}

.box-search i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 100%;
  cursor: pointer;
  color: var(--text-gray-3);
}

.title-animation {
  background-color: var(--color-10);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 5px 100px;
}

.message-wrapper {
  position: relative;
  width: 550px;
  height: 24px;
  overflow: hidden;
  text-align: center;
}

.message {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--text-gray-4);
}

.next-enter-active,
.next-leave-active {
  transition:
    transform 1s ease,
    opacity 1s ease;
}

.next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.prev-enter-active,
.prev-leave-active {
  transition:
    transform 1s ease,
    opacity 1s ease;
}

.prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
