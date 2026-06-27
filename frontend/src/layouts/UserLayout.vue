<script setup>
import AppFooter from '@/components/user/AppUserFooter.vue'
import AppHeader from '@/components/user/AppUserHeader.vue'
// import AppSidebar from '@/components/user/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="content">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
