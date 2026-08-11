<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import ProductVariantForm from '@/components/admin/forms/ProductVariantForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useDelete } from '@/composables/useDelete'
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { ROUTE_NAMES } from '@/constants/routes'
import router from '@/router'
import { useProductVariant } from '@/stores/product-variant'
import { useProductStore } from '@/stores/product'
import ProductVariantCard from '@/components/common/cards/product-variant/ProductVariantCard.vue'
import AppLoading from '../../../components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const productVariStore = useProductVariant()
const productStore = useProductStore()
const { productVariants, error, loading } = storeToRefs(productVariStore)
const { productOptions } = storeToRefs(productStore)
const pageLoading = ref(true)
const showForm = ref(false)

const clearError = () => {
  productVariStore.clearError()
}
//dùng loading dữ liệu từ local
// onMounted(async () => {
//   pageLoading.value = true
//   try {
//     const tasks = []
//     if (productVariStore.productVariants.length === 0) {
//       tasks.push(productVariStore.fetchForAdmin())
//     }
//     tasks.push(productStore.fetchOptions())

//     await Promise.all(tasks)
//   } finally {
//     pageLoading.value = false
//   }
// })
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([productVariStore.fetchForAdmin(), productStore.fetchOptions(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})

const openAddForm = () => {
  showForm.value = true
  productVariStore.clearError()
}

const addVariant = async (data) => {
  const res = await productVariStore.create(data)

  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
    showForm.value = false
  } else {
    const message =
      Object.values(productVariStore.error.errors)[0] ||
      productVariStore.error.general ||
      'Lỗi thêm dữ liệu biến thể sản phẩm'

    toastStore.showToast(message, 'error')
  }
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await productVariStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(productVariStore.error.errors)[0] ||
      productVariStore.error.general ||
      'Lỗi không thể xóa biến thể sản phẩm'
    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

const cancelDelete = () => {
  closeDelete()
  // toastStore.showToast('Đã hủy thay đổi', 'warning')
}
const opentEdit = (productVariant) => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_VARIANT_DETAIL,
    params: {
      id: productVariant._id,
    },
  })
}
</script>

<template>
  <AppLoading v-if="pageLoading" :loading="pageLoading" :error="error.general" />
  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Biến Thể Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc biến thể sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên biến thể sản phẩm"
      @click="openAddForm"
      :filters="[
        {
          label: 'Lọc theo',
          options: ['Đang bán', 'Đã ẩn', 'Hết hàng', 'Ngừng kinh doanh'],
        },
        
      ]"
    />
    <AdminToolbar
      content="Thêm biến thể sản phẩm"
      @add="openAddForm"
      :items="productVariants"
      @delete="openDelete"
      @edit="opentEdit"
      :card-component="ProductVariantCard"
    />
  </div>
  <ProductVariantForm
    :show="showForm"
    @submit="addVariant"
    :general-error="error.general"
    :errors="error.errors"
    @close="cancelDialogForm"
    :products="productOptions"
    @clear-error="clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa biến thể sản phẩm"
    message="Bạn có chắc muốn xóa biến thể sản phẩm này?"
    :name="deleteItem?.displayName"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
