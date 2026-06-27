<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { ref } from 'vue'

const collestions = ref([])
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
    placeholder: 'Nhập tên kiểu dáng sản phẩm...',
  },
  {
    name: 'description',
    label: 'Mô tả kiểu dáng sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô tả kiểu dáng sản phẩm',
  },
]

const addCollection = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Bộ Sưu Tập"
      description="Quản lý và sắp xếp cấu trúc bộ sưu tập sản phẩm của bạn"
      button-text="THÊM BỘ SƯU TẬP"
      place-holder="Tìm bộ sưu tập sản phẩm..."
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm bộ sưu tập"
      :items="collestions"
      :showAddCard="true"
      @add="openAddForm"
    />
  </div>
  <DialogForm
    :show="showForm"
    title="Thêm bộ sưu tập sản phẩm"
    :fields="fields"
    @submit="addCollection"
    @close="showForm = false"
  />
</template>

<style scoped></style>
