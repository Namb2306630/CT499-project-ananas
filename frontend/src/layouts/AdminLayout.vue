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
main {
  flex: 1;
}
.app-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  display: flex;
  width: 100%;
  flex: 1;
  min-width: 0;
}
/* SIDEBAR */

.sidebar-wrapper {
  width: 300px;
  min-width: 300px;
  display: flex;
  transition:
    transform 1s ease,
    margin 1s ease;
}

.sidebar-wrapper.hide {
  transform: translateX(-100%);
  margin-left: -300px;
}

/* MAIN */
.main-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;

  min-width: 0;
}

.content-wrapper {
  width: 100%;
  max-width: var(--max-width);
  min-width: 0; 
}

.main-wrapper.full {
  width: 100%;
}

@media (max-width: 767px) {
  .app-layout {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .layout-body {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
  }

  .sidebar-wrapper.hide {
    transform: translateX(-100%);
    margin-left: 0;
  }

  .main-wrapper {
    width: 100%;
  }
}
</style>
