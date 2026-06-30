<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { ref } from 'vue'

const products = ref([])
const showForm = ref(false)
const errors = ref([])
const productLines = ref([])
const productCollections = ref([])
const categories = ref([])
const fields = [
  {
    name: 'name',
    type: 'text',
    label: 'Tên sản phẩm *',
    placeholder: 'Nhập tên sản phẩm',
  },
  {
    name: 'productLine',
    type: 'select',
    label: 'Dòng sản phẩm *',
    placeholder: 'Chọn dòng sản phẩm',
    options: productLines,
  },
  {
    name: 'productCollection',
    type: 'select',
    label: 'Bộ sưu tập *',
    placeholder: 'Chọn bộ sưu tập',
    options: productCollections,
  },

  {
    name: 'categories',
    type: 'select',
    label: 'Danh mục *',
    placeholder: 'Chọn danh mục',
    options: categories,
  },
  {
    name: 'costPrice',
    type: 'text',
    label: 'Giá nhập *',
    placeholder: 'Giá nhập sản phẩm',
  },
  {
    name: 'gender',
    type: 'checkbox',
    label: 'Sản phẩm dành cho *',
    placeholder: 'Chọn loại sản phẩm',
    options: ['Nam', 'Nữ', 'Phi giới tính'],
  },
  {
    name: 'discountPercent',
    type: 'text',
    label: 'Giảm giá',
    placeholder: 'Nhập phần trăm giảm giá',
  },
  {
    name: 'styles',
    type: 'select',
    label: 'Kiểu dáng *',
    placeholder: 'Chọn kiểu dáng sản phẩm',
  },

  {
    name: 'status',
    type: 'checkbox',
    label: 'Trạng thái sản phẩm',
    options: ['Bán chạy', 'Sản phẩm mới', 'Sale'],
  },

  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả sản phẩm *',
    placeholder: 'Mô tả sản phẩm',
  },
]

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
      title="Quản Lý Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar content="Thêm sản phẩm" @add="openAddForm" :items="products" />
  </div>
  <DialogForm
    title="Thêm sản phẩm"
    :fields="fields"
    :show="showForm"
    @submit="addProduct"
    :errors="errors"
    @close="showForm = false"
  />
</template>
