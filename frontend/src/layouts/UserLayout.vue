<script setup>
import AppFooter from '@/components/user/AppUserFooter.vue'
import AppHeader from '@/components/user/AppUserHeader.vue'
import AppSidebar from '@/components/user/AppUserSidebar.vue'
import AppNavigation from '@/components/user/AppNavigation.vue';
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes';

const route = useRoute()
const isHomePage = computed(() => {
  return route.name === ROUTE_NAMES.HOME
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

    <div class="layout-body">
      <aside v-if="!isHomePage" class="sidebar-wrapper" :class="{ hide: !showSidebar }">
        <AppSidebar />
      </aside>

      <main class="main-wrapper" :class="{ full: isHomePage || !showSidebar }">
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
</style>
