<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { ref } from 'vue'

const users = ref([])
const errors = ref([])
const showForm = ref(false)

const fields = [
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    placeholder: 'Nhập số điện thoại',
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    placeholder: '*****',
  },

  {
    name: 'confirmPassword',
    label: 'Nhập lại mật khẩu',
    type: 'password',
    placeholder: '*****',
  },
]

const openAddForm = () => {
  showForm.value = !showForm.value
}

const addUser = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Nhân Viên"
      description="Quản lý và sắp xếp cấu trúc nhân sự của bạn"
      button-text="THÊM NHÂN VIÊN"
      place-holder="Tìm nhân viên..."
      @click="openAddForm"
    />
    <AdminToolbar content="Thêm tài khoản nhân viên" :items="users" @add="openAddForm" />
  </div>

  <DialogForm
    :show="showForm"
    title="Thêm tài khoản nhân viên"
    :errors="errors"
    :fields="fields"
    @close="showForm = false"
    @submit="addUser"
  />
</template>

<style scoped></style>
