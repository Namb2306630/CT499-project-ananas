<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { useToastStore } from '@/stores/toast'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
import router from '@/router'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import StyleListItem from '@/components/common/lists/style/StyleListItem.vue'
import AppLoading from '@/components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const styleStore = useStyleStore()
const toastStore = useToastStore()
const { styles, loading, error } = storeToRefs(styleStore)
const showForm = ref(false)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const pageLoading = ref(true)

onMounted(async () => {
  // if (styleStore.styles.length > 0) {
  //   //
  // }
  // await styleStore.fetchForAdmin()
  pageLoading.value = true
  try {
    await Promise.all([styleStore.fetchForAdmin(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})

const openAddForm = () => {
  showForm.value = true
  styleStore.clearError()
}

const clearError = () => {
  styleStore.clearError()
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

const openEdit = (style) => {
  router.push({
    name: ROUTE_NAMES.STYLE_DETAIL,
    params: {
      slug: style.slug,
    },
  })
}

const confirmDelete = async () => {
  const res = await styleStore.delete(deleteItem.value._id)

  if (res) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
  } else {
    const message =
      Object.values(styleStore.error.errors)[0] ||
      styleStore.error.general ||
      'Xóa kiểu dáng sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const addStyle = async (data) => {
  const res = await styleStore.create(data)
  if (res?.code === 200) {
    showForm.value = false
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(styleStore.error.errors)[0] ||
      styleStore.error.general ||
      'Lỗi thêm dữ liệu kiểu dáng sản phẩm'

    toastStore.showToast(message, 'error')
  }
}

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}
</script>

<template>
  <AppLoading v-if="loading" :loading="loading" :error="error.general" />
  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Kiểu Dáng Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc kiểu dáng sản phẩm của bạn"
      button-text="THÊM KIỂU DÁNG SẢN PHẨM"
      place-holder="Tìm tên kiểu dáng sản phẩm..."
      @click="openAddForm"
    />

    <AdminToolbar
      content="Thêm kiểu dáng sản phẩm"
      :items="styles"
      @add="openAddForm"
      :error="error"
      @delete="openDelete"
      @edit="openEdit"
      :show-add-card="false"
      :show-card-item="false"
      :list-component="StyleListItem"
      :headers="[
        {
          label: 'Kiểu dáng',
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
    title="Thêm kiểu dáng cho sản phẩm"
    :fields="fields"
    @submit="addStyle"
    @close="cancelDialogForm"
    :errors="error.errors"
    @clear-error="clearError"
    :general-error="error.general"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa kiểu dáng sản phẩm"
    message="Bạn có chắc chắn muốn xóa kiểu dáng sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
