<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import ProductVariantItemForm from '@/components/admin/forms/ProductVariantItemForm.vue'
import { ref, onMounted } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import router from '@/router'
import { useDelete } from '@/composables/useDelete'
import { useToastStore } from '@/stores/toast'
import { useProductVariItem } from '@/stores/product-variant-item'
import { useProductVariant } from '@/stores/product-variant'
import { storeToRefs } from 'pinia'
import { ROUTE_NAMES } from '@/constants/routes'
import ProductVariantItemList from '@/components/common/lists/product-variant-item/ProductVariantItemList.vue'
import AppLoading from '../../../components/common/LoadingState.vue'

const showForm = ref(false)
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const productVariantStore = useProductVariant()
const productVariantItemStore = useProductVariItem()
const loadingPage = ref(false)

const { productVariantOptions } = storeToRefs(productVariantStore)
const { productVariItems, error, loading } = storeToRefs(productVariantItemStore)
const deylay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  loadingPage.value = true
  try {
    await Promise.all([
      productVariantItemStore.fetchForAdmin(),
      productVariantStore.fetchOptions(),
      deylay(200),
    ])
  } finally {
    loadingPage.value = false
  }
})

const openAddForm = () => {
  showForm.value = true
}

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
  clearError()
}

const clearError = () => {
  productVariantItemStore.clearError()
}

const cancelDelete = () => {
  closeDelete()
  // toastStore.showToast('Đã hủy thay đổi', 'warning')
}
const addProduct = async (data) => {
  const res = await productVariantItemStore.create(data)
  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
    showForm.value = false
  } else {
    const message =
      Object.values(productVariantItemStore.error.errors)[0] ||
      productVariantItemStore.error.general ||
      'Lỗi tạo dữ liệu cho SKU sản phẩm!!!'

    toastStore.showToast(message, 'error')
  }
}
const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await productVariantItemStore.delete(deleteItem.value._id)
  if (res?.code === 200) {
    productVariantItemStore.clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(productVariantItemStore.error.errors)[0] ||
      productVariantItemStore.error.general ||
      'Lỗi xóa dữ liệu cho SKU sản phẩm'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const opentEdit = (productVariItem) => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_VARIANT_ITEM_DETAIL,
    params: {
      sku: productVariItem._id,
    },
  })
}
</script>

<template>
  <AppLoading v-if="loadingPage" :loading="loadingPage" :error="error.general" />
  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý SKU"
      description="Quản lý tồn sản phẩm"
      button-text="thêm sản phẩm"
      place-holder="Tìm sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm sản phẩm"
      @add="openAddForm"
      :items="productVariItems"
      @edit="opentEdit"
      @delete="openDelete"
      :list-component="ProductVariantItemList"
      :show-add-card="false"
      :show-card-item="false"
      :headers="[
        { label: 'Biến thể', width: '1.3fr' },
        { label: 'SKU', width: '2fr' },
        { label: 'Size', width: '60px' },
        { label: 'Số lượng', width: '70px' },
        { label: 'Tồn kho', width: '100px' },
        { label: 'Ngày tạo', width: '100px' },
      ]"
    />
  </div>
  <ProductVariantItemForm
    :show="showForm"
    @submit="addProduct"
    @close="cancelDialogForm"
    :variants="productVariantOptions"
    :general-error="error.general"
    :errors="error.errors"
  />
  <ConfirmDialog
    title="Xóa SKU sản phẩm"
    message="Bạn có chắc muốn xóa SKU sản phẩm này?"
    @cancel="cancelDelete"
    :name="deleteItem?.sku"
    @confirm="confirmDelete"
    :show="showConfirm"
  />
</template>
