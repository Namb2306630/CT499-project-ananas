<script setup>
import { ref } from 'vue'

import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'

const categories = ref([])
const showForm = ref(false)

const openAddForm = () => {
  showForm.value = !showForm.value
}

const fields = [
  {
    name: 'name',
    label: 'Tên danh mục *',
    type: 'text',
    placeholder: 'Nhập tên danh mục',
  },

  {
    name: 'parent',
    label: 'Danh mục cha',
    type: 'select',
    options: categories.value,
  },
]

const addCategory = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Danh Mục"
      description="Quản lý và sắp xếp cấu trúc danh mục sản phẩm của bạn"
      button-text="THÊM DANH MỤC"
      place-holder="Tìm danh mục..."
      :filters="[
        {
          label: 'Chọn trạng thái',
          options: ['Hoạt động', 'Đã ẩn'],
        },
      ]"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm danh mục"
      :items="categories"
      :showAddCard="true"
      @add="openAddForm"
    />
  </div>
  <DialogForm
    :show="showForm"
    :showImage="true"
    title="Thêm danh mục mới"
    :fields="fields"
    @submit="addCategory"
    @close="showForm = false"
    title-img="Ảnh danh mục (nếu có)"
    content-img="Thêm ảnh danh mục"
  />
</template>
