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
import CollectionListItem from '@/components/common/lists/collection/CollectionListItem.vue'
import AppLoading from '@/components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const showForm = ref(false)
const collectionStore = useCollectionStore()
const { collections, loading, error } = storeToRefs(collectionStore)
const pageLoading = ref(true)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  // if (collectionStore.collections.length > 0) {
  //   // Không làm gì vì UI đang lấy từ Pinia
  // }
  // await collectionStore.fetchForAdmin()
  pageLoading.value = true
  try {
    await Promise.all([collectionStore.fetchForAdmin(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})
defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  showForm.value = true
  collectionStore.clearError()
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
  const res = await collectionStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    collectionStore.clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(collectionStore.error.errors)[0] ||
      collectionStore.error.general ||
      'Xóa bộ sưu tập sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const addCollection = async (data) => {
  const res = await collectionStore.create(data)

  if (res?.code === 200) {
    collectionStore.clearError()
    showForm.value = false
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(collectionStore.error.errors)[0] ||
      collectionStore.error.general ||
      'Lỗi thêm dữ liệu bộ sưu tập sản phẩm'

    toastStore.showToast(message, 'error')
  }
}

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

const cancelDelete = () => {
  closeDelete()
  // toastStore.showToast('Đã hủy thay đổi', 'warning')
}
</script>

<template>
  <AppLoading v-if="pageLoading" :loading="pageLoading" :error="error.general" />
  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Bộ Sưu Tập"
      description="Quản lý và sắp xếp cấu trúc bộ sưu tập sản phẩm của bạn"
      button-text="THÊM BỘ SƯU TẬP"
      place-holder="Tìm bộ sưu tập sản phẩm..."
      @click="openAddForm"
      :filters="[
        {
          label: 'Lọc theo',
          options: ['Hoạt động', 'Đã ẩn'],
        },
      ]"
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
      :list-component="CollectionListItem"
      :headers="[
        {
          label: 'Tên bộ sưu tập',
          width: '1.5fr',
        },
        {
          label: 'Mô tả',
          width: '2.5fr',
        },
        {
          label: 'Số SP',
          width: '80px',
        },
        {
          label: 'Ngày tạo',
          width: '120px',
        },
      ]"
    />
  </div>
  <DialogForm
    :show="showForm"
    title="Thêm bộ sưu tập sản phẩm"
    :fields="fields"
    @submit="addCollection"
    @close="cancelDialogForm"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="collectionStore.clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa bộ sưu tập sản phẩm"
    message="Bạn có chắc chắn muốn xóa bộ sưu tập sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
