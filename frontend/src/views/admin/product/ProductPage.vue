<script setup>
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { ref, onMounted, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useCategoryStore } from '@/stores/caterory'
import { useProductLineStore } from '@/stores/product-line'
import { useProductStore } from '@/stores/product'
import { useCollectionStore } from '@/stores/collection'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const toastStore = useToastStore()
const categoryStore = useCategoryStore()
const productLineStore = useProductLineStore()
const collectionStore = useCollectionStore()
const productStore = useProductStore()
const styleStore = useStyleStore()

const { error: errorCategory, loading: loadingCategory, categories } = storeToRefs(categoryStore)
const { error: errorProduct, loading: loadingProduct, products } = storeToRefs(productStore)
const {
  error: errorCollection,
  loading: loadingCollection,
  collections,
} = storeToRefs(collectionStore)
const {
  error: errorProductLine,
  loading: loadingProductLine,
  productLines,
} = storeToRefs(productLineStore)

const { error: errorStyle, loading: loadingStyle, styles } = storeToRefs(styleStore)

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const showForm = ref(false)

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    productLineStore.fetchProductLines(),
    collectionStore.fetchForAdmin(),
    styleStore.fetchForAdmin(),
    productStore.fetchForAdmin(),
  ])

  console.log('categories:', categories.value)
  console.log('productLines:', productLines.value)
  console.log('collections:', collections.value)
  console.log('styles:', styles.value)
  console.log('products:', products.value)
})

const openAddForm = () => {
  showForm.value = true
  productStore.clearError()
}
const clearError = () => {
  productStore.clearError()
}

const confirmDelete = async () => {
  const res = await productStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
  } else {
    const message =
      Object.values(productStore.error.errors)[0] ||
      productStore.error.general ||
      'Xóa sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }

  closeDelete()
}
const addProduct = async (data) => {
  const result = await productStore.create(data)

  if (result?.code === 200) {
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(productStore.error.errors)[0] ||
      productStore.error.general ||
      'Lỗi thêm dữ liệu sản phẩm!'

    toastStore.showToast(message, 'error')
  }
}

const fields = computed(() => [
  {
    name: 'name',
    type: 'text',
    label: 'Tên sản phẩm',
    placeholder: 'Nhập tên sản phẩm',
  },

  {
    name: 'productLine',
    type: 'select',
    label: 'Dòng sản phẩm',
    placeholder: 'Chọn dòng sản phẩm',
    options: productLines.value,
  },

  {
    name: 'collection',
    type: 'select',
    label: 'Bộ sưu tập',
    placeholder: 'Chọn bộ sưu tập',
    options: collections.value,
  },

  {
    name: 'categories',
    type: 'multiselect',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    options: categories.value,
  },

  {
    name: 'costPrice',
    type: 'text',
    label: 'Giá nhập',
    placeholder: 'Giá nhập sản phẩm',
  },

  {
    name: 'gender',
    type: 'radio',
    label: 'Sản phẩm dành cho',
    placeholder: 'Chọn loại sản phẩm',
    options: ['Nam', 'Nữ', 'Phi giới tính'],
  },

  {
    name: 'discountPercent',
    type: 'text',
    label: 'Giảm giá',
    placeholder: 'Nhập phần trăm giảm giá',
  },

  {
    name: 'styles',
    type: 'select',
    label: 'Kiểu dáng',
    placeholder: 'Chọn kiểu dáng sản phẩm',
    options: styles.value,
  },

  {
    name: 'status',
    type: 'checkbox',
    label: 'Trạng thái sản phẩm',
    options: ['Bán chạy', 'Sản phẩm mới', 'Sale'],
  },

  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả sản phẩm',
    placeholder: 'Mô tả sản phẩm',
  },
])
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên sản phẩm"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm sản phẩm"
      @add="openAddForm"
      :items="products"
      @delete="openDelete"
    />
  </div>
  <DialogForm
    title="Thêm sản phẩm"
    :fields="fields"
    :show="showForm"
    @submit="addProduct"
    :errors="errorProduct"
    @close="showForm = false"
    @clear-error="clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa sản phẩm"
    message="Bạn có chắc chắn muốn xóa sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
  />
</template>
