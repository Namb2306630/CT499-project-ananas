<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Đơn Hàng"
      description="Quản lý và sắp xếp cấu trúc đơn hàng của bạn"
      place-holder="Tìm đơn hàng..."
      :show-button="false"
      :filters="[
        {
          label: 'Chọn trạng thái',
          options: ['Chờ xử lý', 'Đã giao', 'Đã hủy'],
        },
      ]"
    />
  </div>
</template>

<style scoped></style>
