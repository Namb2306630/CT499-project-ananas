<script setup>
import { ref, computed } from 'vue'

import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { useCategoryStore } from '@/stores/caterory'
import { storeToRefs } from 'pinia' // giúp giữ tính reactive - tự cập nhật giao diện khi lấy dl từ pinia như ref
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const toastStore = useToastStore()
const categoryStore = useCategoryStore()
const { categories, loading, error } = storeToRefs(categoryStore)
const showForm = ref(false)
const showConfirm = ref(false)
const deleteItem = ref(null)

const loadData = async () => {
  await categoryStore.fetchCategories()
}

loadData()

defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  showForm.value = !showForm.value
}

const fields = computed(() => [
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
])

const addCategory = async (data) => {
  const result = await categoryStore.createCategories(data)
  if (result) {
    showForm.value = false

    toastStore.showToast('Thêm danh mục thành công', 'success')

    await loadData()
  } else {
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Thêm danh mục thất bại!'

    toastStore.showToast(message, 'error')
  }
}

const openDelete = (item) => {
  deleteItem.value = item
  showConfirm.value = true
}

const confirmDelete = async () => {
  const result = await categoryStore.deleteCategory(deleteItem.value._id)
  if (result) {
    toastStore.showToast('Xóa danh mục thành công', 'success')
  } else {
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Xóa danh mục thất bại'

    toastStore.showToast(message, 'error')
  }
  showConfirm.value = false
}
const clearError = () => {
  categoryStore.error = {}
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
      :loading="loading"
      :error="error"
      :showAddCard="true"
      :showSidebar="showSidebar"
      :fields="[
        {
          name: 'image',
          type: 'image',
        },

        {
          name: 'name',
          type: 'title',
        },
        {
          name: 'productCount',
          type: 'count',
        },
        {
          name: 'parent',
          type: 'ref',
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'isActive',
          type: 'status',
        },
      ]"
      @add="openAddForm"
      @delete="openDelete"
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
    :errors="error.errors"
    :general-error="error.general"
    @clearError="clearError"
  />
  <ConfirmDialog
    :show="showConfirm"
    title="Xóa danh mục"
    message="Bạn có chắc muốn xóa danh mục này?"
    note="Không thể hoàn tác dữ liệu sau khi xóa"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
    :name="deleteItem?.name"
  />
</template>
