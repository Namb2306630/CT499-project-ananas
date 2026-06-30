<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Cài Đặt"
      description="Quản lý cấu hình hệ thống của bạn"
      :show-button="false"
      :show-search="false"
      :show-filter="false"
      :show-sort="false"
    />
  </div>
</template>

<style scoped></style>
