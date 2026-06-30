<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import ProductVariantItemForm from '@/components/admin/forms/ProductVariantItemForm.vue'
import { ref } from 'vue'

const variants = ref([])
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
      title="Quản Lý SKU"
      description="Quản lý tồn sản phẩm"
      button-text="thêm sản phẩm"
      place-holder="Tìm sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar content="Thêm sản phẩm" @add="openAddForm" :items="variants" />
  </div>
  <ProductVariantItemForm
    :show="showForm"
    @submit="addProduct"
    @close="showForm = false"
    :variants="variants"
  />
</template>

<style scoped></style>
