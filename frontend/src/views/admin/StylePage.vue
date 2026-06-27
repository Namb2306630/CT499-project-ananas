<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { ref } from 'vue'

const styles = ref([])
const showForm = ref(false)
const errors = ref({})

const openAddForm = () => {
  showForm.value = !showForm.value
}

const fields = [
  {
    name: 'name',
    label: 'Tên kiểu dáng sản phẩm *',
    type: 'text',
    placeholder: 'Nhập tên kiểu dáng sản phẩm',
  },
  {
    name: 'description',
    label: 'Mô tả kiểu dáng sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô tả kiểu dáng sản phẩm...',
  },
]

const addStyle = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Kiểu Dáng Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc kiểu dáng sản phẩm của bạn"
      button-text="THÊM KIỂU DÁNG SẢN PHẨM"
      place-holder="Tìm tên kiểu dáng sản phẩm..."
      @click="openAddForm"
    />

    <AdminToolbar content="Thêm kiểu dáng sản phẩm" :items="styles" @add="openAddForm" />
  </div>
  <DialogForm
    :show="showForm"
    title="Thêm kiểu dáng cho sản phẩm"
    :fields="fields"
    @submit="addStyle"
    @close="showForm = false"
  />
</template>

<style scoped></style>
