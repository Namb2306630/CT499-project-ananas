<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
import LogoApp from '../common/LogoApp.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config.js'
import { formatFreeShip } from '@/utils/formatCurrency'
import { useCategoryStore } from '@/stores/caterory.js'
const BASE_URL = import.meta.env.VITE_BACKEND

const categoryStore = useCategoryStore()
const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)
const { categories } = storeToRefs(categoryStore)
let timer
onMounted(async () => {
  await systemConfigStore.get()
  await categoryStore.fetchCategoriesForUser()

  timer = setInterval(() => {
    nextMessage()
  }, 3000)
})
const currentIndex = ref(0)
const direction = ref('next')

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



onUnmounted(() => {
  clearInterval(timer)
})


</script>

<template>
  <header class="header-box">
    <div class="header-box-inner">
      <LogoApp color-icon="var(--color-23)" color-text="var(--color-23)" size-text="35px" size="50px" />
      <div class="category-box">
        <div v-for="category in categories" :key="category._id" class="category">
          <!-- CHA -->
          <div class="category-title">
            {{ category.name }}

            <i v-if="category.children?.length" class="fa-solid fa-chevron-down"></i>
          </div>

          <!-- CON -->
          <div v-if="category.children?.length" class="category-dropdown">
            <div v-for="child in category.children" :key="child._id" class="category-child">
              <img v-if="child.image" :src="`${BASE_URL}/${child.image}`" :alt="child.name" />

              <span>{{ child.name }}</span>
            </div>
          </div>
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
.category-box {
  display: flex;
  align-items: center;
  gap: 25px;
}

.category {
  position: relative;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 10px;
  cursor: pointer;

  white-space: nowrap;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 500px;
  padding: 25px;
  background: var(--bg-footer-color);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  z-index: 999;
}

.category:hover .category-dropdown {
  display: grid;
}

.category-child {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: px;
  cursor: pointer;
}

.category-child img {
  width: 200px;
  object-fit: cover;
  opacity: 0.7;
}

.category-child span {
  color: white;
  font-weight: 500;
}

.category-child:hover img {
  opacity: 1;
}

.category-child:hover span {
  color: var(--color-23)
}

.header-box-inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.header-box {
  padding: 40px 100px;
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
}

.box-search {
  border: 1px solid var(--color-7);
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
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
