<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdmiToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { ref } from 'vue'
import { data } from 'jquery'

const brands = ref([])
const errors = ref([])
const showForm = ref(false)

const fields = [
  {
    name: 'name',
    label: 'Tên thương hiệu *',
    type: 'text',
    placeholder: 'Nhập tên thương hiệu',
  },
  {
    name: 'description',
    label: 'Mô tả danh mục',
    type: 'textarea',
    placeholder: 'Thêm mô tả',
  },
]

const openAddForm = () => {
  showForm.value = !showForm.value
}

const addBrand = (data) => {
  console.log(data)
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Thương Hiệu"
      description="Quản lý các thương hiệu sản phẩm của bạn"
      place-holder="Nhập tên thương hiệu cần tìm..."
      :filters="[
        {
          label: 'Chọn trạng thái',
          options: ['Hoạt động', 'Đang ẩn'],
        },
      ]"
      button-text="Thêm thương hiệu"
      @click="openAddForm"
    />
    <AdmiToolbar content="Thêm thương hiệu" @add="openAddForm" :items="brands" />
  </div>
  <DialogForm
    :show="showForm"
    :showImage="true"
    title-img="Thêm logo thương hiệu"
    content-img="Thêm logo thương hiệu"
    title="Thêm thương hiệu"
    :fields="fields"
    @close="showForm = false"
    @submit="addBrand"
    :errors="errors"
  />
</template>

<style scoped></style>
