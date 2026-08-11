<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { useProductType } from '@/stores/product-type'
import { useToastStore } from '@/stores/toast'
import router from '@/router'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
import ProductTypeListItem from '@/components/common/lists/product-type/ProductTypeListItem.vue'
import AppLoading from '@/components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const productTypeStore = useProductType()
const { productTypes, loading, error } = storeToRefs(productTypeStore)
const showForm = ref(false)
const pageLoading = ref(true)
const deplay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([productTypeStore.fetchForAdmin(), deplay(200)])
  } finally {
    pageLoading.value = false
  }
})

defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  showForm.value = true
  productTypeStore.clearError()
}

//AddCard
const fields = [
  {
    name: 'name',
    label: 'Tên loại sản phẩm',
    type: 'text',
    placeholder: 'Nhập tên loại sản phẩm',
  },
  {
    name: 'description',
    label: 'Mô tả loại sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô loại sản phẩm',
  },
]
const clearError = () => {
  productTypeStore.clearError()
}
const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await productTypeStore.delete(deleteItem.value._id)
  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(productTypeStore.error.errors)[0] ||
      productTypeStore.error.general ||
      'Xóa loại sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const openEdit = (productType) => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_TYPE_DEAIL,
    params: {
      slug: productType.slug,
    },
  })
}

const save = async (data) => {
  const result = await productTypeStore.create(data)

  if (result?.code === 200) {
    clearError()
    showForm.value = false
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(productTypeStore.error.errors)[0] ||
      productTypeStore.error.general ||
      'Lỗi thêm dữ liệu loại sản phẩm'

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
      title="Quản Lý Loại Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc loại sản phẩm của bạn"
      button-text="THÊM LOẠI SẢN PHẨM"
      place-holder="Tìm loại sản phẩm..."
      @click="openAddForm"
      :filters="[
        {
          label: 'Lọc theo',
          options: ['Hoạt động', 'Đã ẩn'],
        },
        
      ]"
    />
    <!--  :show-sidebar="showSidebar"  để ẩn hiện cái sidebar thì số ccarrd thay đổi theo -->
    <AdminToolbar
      content="Thêm loại sản phẩm"
      :items="productTypes"
      :show-sidebar="showSidebar"
      :error="error"
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
      count-label="Sản phẩm"
      :show-add-card="false"
      :show-card-item="false"
      :list-component="ProductTypeListItem"
      :headers="[
        { label: 'Tên loại SP', width: '1.5fr' },
        {
          label: 'Mô tả',
          width: '2.5fr',
        },
        { label: 'Số SP', width: '80px' },
        {
          label: 'Ngày tạo',
          width: '120px',
        },
      ]"
    />
  </div>

  <DialogForm
    :show="showForm"
    title="Thêm loại sản phẩm"
    :fields="fields"
    @submit="save"
    @close="cancelDialogForm"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa loại sản phẩm"
    message="Bạn có chắc chắn muốn xóa loại sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
