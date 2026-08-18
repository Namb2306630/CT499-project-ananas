<script setup>
import AppFooter from '@/components/user/AppUserFooter.vue'
import AppHeader from '@/components/user/AppUserHeader.vue'
import AppSidebar from '@/components/user/AppUserSidebar.vue'
import AppNavigation from '@/components/user/AppNavigation.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
// onMounted(async () => {
//   await cartStore.fetchCart()
// })
const route = useRoute()
const isHomePage = computed(() => {
  return route.name === ROUTE_NAMES.HOME
})
const isDiscoverYouPage = computed(() => {
  return route.name === ROUTE_NAMES.DISCOVER_YOU
})
const isProductDetail = computed(() => {
  return route.name === ROUTE_NAMES.PRODUCT_VIEW
})

const isYouCart = computed(() => {
  return route.name === ROUTE_NAMES.YOU_CART
})

const isShipping = computed(() => {
  return route.name === ROUTE_NAMES.SHIPPING
})

const isOrderSuccess = computed(() => {
  return route.name === ROUTE_NAMES.ORDER_SUCCESS
})

const isOrder = computed(() => {
  return route.name === ROUTE_NAMES.MY_ORDERS
})

const isOrderDetail = computed(() => {
  return route.name === ROUTE_NAMES.MY_ORDER_DETAIL
})
const showSidebar = ref(true)

const handleClick = () => {
  showSidebar.value = !showSidebar.value
}
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <AppNavigation />

    <div class="layout-body mt-4 container-custom">
      <aside
        v-if="
          !isHomePage &&
          !isDiscoverYouPage &&
          !isProductDetail &&
          !isYouCart &&
          !isShipping &&
          !isOrderSuccess &&
          !isOrder &&
          !isOrderDetail
        "
        class="sidebar-wrapper"
        :class="{ hide: !showSidebar }"
      >
        <AppSidebar />
      </aside>

      <main class="main-wrapper" :class="{ full: isHomePage || isDiscoverYouPage || !showSidebar }">
        <div class="content-wrapper">
          <RouterView />
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
@import '../assets/css/lay-out.css';

/* .layout-body {
  max-width: var(--max-width);
  margin: 0 auto;
} */
</style>
