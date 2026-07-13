<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { useToastStore } from '@/stores/toast'
import router from '@/router'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
import { useCollectionStore } from '@/stores/collection'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const showForm = ref(false)
const collecionStore = useCollectionStore()
const { collections, loading, error } = storeToRefs(collecionStore)

onMounted(async () => {
  if (collecionStore.collections.length > 0) {
    // Không làm gì vì UI đang lấy từ Pinia
  }
  await collecionStore.fetchForAdmin()
})

const openAddForm = () => {
  showForm.value = true
  collecionStore.clearError()
}

const fields = [
  {
    name: 'name',
    label: 'Tên bộ sưu tập sản phẩm',
    type: 'text',
    placeholder: 'Nhập tên bộ sưu tập sản phẩm',
  },
  {
    name: 'description',
    label: 'Mô tả bộ sưu tập sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô tả bộ sưu tập sản phẩm...',
  },
]

const openEdit = (collecion) => {
  router.push({
    name: ROUTE_NAMES.COLLECTION_DETAIL,
    params: {
      slug: collecion.slug,
    },
  })
}

const confirmDelete = async () => {
  const res = await collecionStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
  } else {
    const message =
      Object.values(collecionStore.error.errors)[0] ||
      collecionStore.error.general ||
      'Xóa bộ sưu tập sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const addCollection = async (data) => {
  const res = await collecionStore.create(data)

  if (res?.code === 200) {
    showForm.value = false
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(collecionStore.error.errors)[0] ||
      collecionStore.error.general ||
      'Lỗi thêm dữ liệu bộ sưu tập sản phẩm'

    toastStore.showToast(message, 'error')
  }
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
      :items="collections"
      :error="error"
     
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
      count-label="Sản phẩm"
      :show-add-card="false"
      :show-card-item="false"
      :fields="[
        {
          name: 'name',
          label: 'Tên bộ sưu tập',
          type: 'title',
          width: '1.5fr',
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
          width: '2.5fr',
        },
        {
          name: 'productCount',
          label: 'Số SP',
          type: 'count',
          width: '80px',
        },
        {
          name: 'createdAt',
          label: 'Ngày tạo',
          type: 'createdAt',
          width: '120px',
        },
        {
          name: 'isActive',
          type: 'isActive',
        },
      ]"
    />
  </div>
  <DialogForm
    :show="showForm"
    title="Thêm bộ sưu tập sản phẩm"
    :fields="fields"
    @submit="addCollection"
    @close="showForm = false"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="collecionStore.clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa bộ sưu tập sản phẩm"
    message="Bạn có chắc chắn muốn xóa bộ sưu tập sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
  />
</template>
