<script setup>
import AppFooter from '@/components/user/AppUserFooter.vue'
import AppHeader from '@/components/user/AppUserHeader.vue'
import AppSidebar from '@/components/user/AppUserSidebar.vue'
import AppNavigation from '@/components/user/AppNavigation.vue';
import { ref } from 'vue'


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
      <aside class="sidebar-wrapper" :class="{ hide: !showSidebar }">
        <AppSidebar />
      </aside>
      <main class="main-wrapper" :class="{ full: !showSidebar }">
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
