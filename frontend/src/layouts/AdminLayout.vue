<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import AppAdminFooter from '@/components/admin/AppAdminFooter.vue'
import AppAdminSidebar from '@/components/admin/AppAdminSidebar.vue'
import AppAdminHeader from '@/components/admin/AppAdminHeader.vue'
const showSidebar = ref(true)

const handleClick = () => {
  showSidebar.value = !showSidebar.value
}
</script>

<template>
  <div class="app-layout">
    <AppAdminHeader :is-show="showSidebar" :handle="handleClick" />

    <div class="layout-body">
      <aside class="sidebar-wrapper" :class="{ hide: !showSidebar }">
        <AppAdminSidebar :is-show="showSidebar" :handle="handleClick" />
      </aside>

      <main class="main-wrapper" :class="{ full: !showSidebar }">
        <div class="content-wrapper">
          <RouterView :showSidebar="showSidebar" />
        </div>
      </main>
    </div>
    <AppAdminFooter />
  </div>
</template>

<style scoped>
@import '../assets/css/lay-out.css';
</style>
