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
import { useProductType } from '@/stores/product-type'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import { ROUTE_NAMES } from '@/constants/routes'
import router from '@/router'
import ProductCard from '@/components/common/cards/product/ProductCard.vue'
import AppLoading from '../../../components/common/LoadingState.vue'

const toastStore = useToastStore()
const categoryStore = useCategoryStore()
const productLineStore = useProductLineStore()
const productTypeStore = useProductType()
const collectionStore = useCollectionStore()
const productStore = useProductStore()
const styleStore = useStyleStore()
const pageLoading = ref(true)

const { categories } = storeToRefs(categoryStore)
const { products, pagination, loading, error } = storeToRefs(productStore)
const { collectionOptions } = storeToRefs(collectionStore)
const { productLineOptions } = storeToRefs(productLineStore)
const { productTypeOptions } = storeToRefs(productTypeStore)
const { styleOptions } = storeToRefs(styleStore)

//phân trang
const changePage = async (page) => {
  if (page < 1 || page > pagination.value.totalPages || page === pagination.value.page) {
    return
  }
  await productStore.fetchForAdmin(page)
}
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const showForm = ref(false)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([
      productStore.fetchForAdmin(),
      categoryStore.fetchCategories(),
      productLineStore.fetchOptions(),
      collectionStore.fetchOptions(),
      productTypeStore.fetchOptions(),
      styleStore.fetchOptions(),
      delay(200),
    ])
  } finally {
    pageLoading.value = false
  }
})

defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  showForm.value = true
  productStore.clearError()
}

const clearError = () => {
  productStore.clearError()
}

const confirmDelete = async () => {
  if (deleteItem.value) return
  const res = await productStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
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
    clearError()
    showForm.value = false
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(productStore.error.errors)[0] ||
      productStore.error.general ||
      'Lỗi thêm dữ liệu sản phẩm!'

    toastStore.showToast(message, 'error')
  }
}

const opentEdit = (product) => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_DETAIL,
    params: {
      slug: product.slug,
    },
  })
}

const fields = computed(() => [
  {
    name: 'productType',
    type: 'select',
    label: 'Loại sản phẩm',
    placeholder: 'Chọn loại sản phẩm',
    options: productTypeOptions.value,
  },
  {
    name: 'productLine',
    type: 'select',
    label: 'Dòng sản phẩm',
    placeholder: 'Chọn dòng sản phẩm',
    options: productLineOptions.value,
  },
  {
    name: 'productCollection',
    type: 'select',
    label: 'Bộ sưu tập',
    placeholder: 'Chọn bộ sưu tập',
    options: collectionOptions.value,
  },
  {
    name: 'categories',
    type: 'multiselect',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    options: categories.value,
  },
  {
    name: 'style',
    type: 'select',
    label: 'Kiểu dáng',
    placeholder: 'Chọn kiểu dáng',
    options: styleOptions.value,
  },

  // 3. Thuộc tính
  {
    name: 'gender',
    type: 'radio',
    label: 'Giới tính',
    options: [
      { label: 'Nam', value: 'male' },
      { label: 'Nữ', value: 'female' },
      { label: 'Phi giới tính', value: 'unisex' },
    ],
  },

  // 4. Giá
  {
    name: 'costPrice',
    type: 'number',
    label: 'Giá nhập',
    placeholder: 'Giá nhập sản phẩm',
  },
  {
    name: 'discountPercent',
    type: 'number',
    label: 'Giảm giá (%)',
    placeholder: 'Nhập % giảm giá',
  },

  // 5. Trạng thái nổi bật
  {
    type: 'checkbox-group',
    label: 'Đánh dấu',
    options: [
      { name: 'isBestSeller', label: 'Bán chạy' },
      { name: 'isNewArrival', label: 'Sản phẩm mới' },
      { name: 'isSale', label: 'Sale' },
    ],
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả sản phẩm',
    placeholder: 'Mô tả sản phẩm',
  },
])

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
  <AppLoading v-if="pageLoading" :loading="pageLoading" :error="error.general" />

  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc sản phẩm của bạn"
      button-text="THÊM SẢN PHẨM"
      place-holder="Tìm tên sản phẩm"
      @click="openAddForm"
      :filters="[
        {
          label: 'Lọc theo',
          options: ['Đang bán', 'Đã ẩn','Sale', 'Bán chạy', 'Mới'],
        },
        
      ]"
    />
    <AdminToolbar
      content="Thêm sản phẩm"
      @add="openAddForm"
      :items="products"
      @delete="openDelete"
      @edit="opentEdit"
      :error="error"
      :show-sidebar="showSidebar"
      count-label="Dòng sản phẩm"
      object-fit="cover"
      :card-component="ProductCard"
    />
  </div>
  <DialogForm
    title="Thêm sản phẩm"
    :fields="fields"
    :show="showForm"
    @submit="addProduct"
    @close="cancelDialogForm"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
  />

  <!-- nút chuyển trang -->
  <AppPagination :pagination="pagination" @change-page="changePage" />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa sản phẩm"
    message="Bạn có chắc chắn muốn xóa sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.pagination button {
  width: 36px;
  height: 36px;
}

.pagination .active {
  background: #000;
  color: #fff;
}
</style>
