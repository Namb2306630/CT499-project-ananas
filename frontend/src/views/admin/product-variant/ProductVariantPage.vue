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

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const productVariStore = useProductVariant()
const productStore = useProductStore()
const { productVariants, error, loading } = storeToRefs(productVariStore)
const { products } = storeToRefs(productStore)

const showForm = ref(false)

const clearError = () => {
  productVariStore.clearError()
}
onMounted(async () => {
  if ((productVariStore, productVariants.length > 0)) {
    //
  }
  await productVariStore.fetchForAdmin()
})

const openAddForm = () => {
  showForm.value = false
  productVariStore.clearError()
}

const addVariant = async (data) => {
  const res = await productVariStore.create(data)

  if (res?.code === 200) {
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
  const res = await productVariStore.delete(deleteItem.value._id)

  if (res) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
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
const opentEdit = () => {
  console.log('EDIT')
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Biến Thể Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc biến thể sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên biến thể sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm biến thể sản phẩm"
      @add="openAddForm"
      :items="productVariants"
      @delete="openDelete"
      @edit="opentEdit"
      object-fit="cover"
      :fields="[
        {
          name: '_id',
          type: 'id',
        },
        {
          name: 'mainImage',
          type: 'image',
        },

        {
          name: 'hoverImage',
          type: 'image-hover',
        },

        {
          name: 'displayName',
          type: 'title',
        },
        {
          name: 'colorName',
          type: 'title',
        },
        {
          name: 'colorCode',
          type: 'color',
        },
        {
          name: 'variantItemCount',
          type: 'count',
        },
        {
          name: 'status',
          type: 'status',
        },
      ]"
    />
  </div>
  <ProductVariantForm
    :show="showForm"
    @submit="addVariant"
    :general-error="error.general"
    :errors="error.errors"
    @close="cancelDialogForm"
    :products="products"
    @clear-error="clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa biến thể sản phẩm"
    message="Bạn có chắc muốn xóa biến thể sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
