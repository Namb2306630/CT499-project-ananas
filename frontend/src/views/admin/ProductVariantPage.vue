<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import ProductVariantForm from '@/components/admin/forms/ProductVariantForm.vue'
import { ref } from 'vue'

const products = ref([])
const showForm = ref(false)
const errors = ref([])


const openAddForm = () => {
  showForm.value = !showForm.value
}

const addProduct = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Biến Thể Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc biến thể sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar content="Thêm sản phẩm" @add="openAddForm" :items="products" />
  </div>
  <ProductVariantForm
    :show="showForm"
    @submit="addProduct"
    :errors="errors"
    @close="showForm = false"
  />
</template>

<style scoped></style>
