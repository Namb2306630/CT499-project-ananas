<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { ref } from 'vue'

const errors = ref({})
const collections = ref([])
const showForm = ref(false)

const openAddForm = () => {
  showForm.value = !showForm.value
}

const fields = [
  {
    name: 'name',
    label: 'Tên dòng sản phẩm *',
    type: 'text',
    placeholder: 'Nhập tên dòng sản phẩm',
  },
  {
    name: 'brand',
    label: 'Tên thương hiệu *',
    type: 'select',
    options: collections.value,
  },
  {
    name: 'description',
    label: 'Mô tả dòng sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô dòng sản phẩm',
  },
]

const addProductLine = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Dòng Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc dòng sản phẩm của bạn"
      button-text="THÊM DÒNG SẢN PHẨM"
      place-holder="Tìm dòng sản phẩm..."
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm dòng sản phẩm"
      :items="collections"
      :showAddCard="true"
      @add="openAddForm"
    />
  </div>

  <DialogForm
    :show="showForm"
    title="Thêm dòng sản phẩm"
    :fields="fields"
    @submit="addProductLine"
    @close="showForm = false"
  />
</template>

<style scoped></style>
