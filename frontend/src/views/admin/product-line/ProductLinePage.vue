<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import { useBrandStore } from '@/stores/brand'
import { useProductLineStore } from '@/stores/product-line'
import { useToastStore } from '@/stores/toast'
import router from '@/router'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
import ProductLineListItem from '@/components/common/lists/product-line/ProductLineListItem.vue'
import AppLoading from '@/components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const brandStore = useBrandStore()
const productLineStore = useProductLineStore()
const { brands } = storeToRefs(brandStore)
const { productLines, loading, error } = storeToRefs(productLineStore)
const showForm = ref(false)
const pageLoading = ref(true)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  // if (productLineStore.productLines.length > 0) {
  //   // Không làm gì vì UI đang lấy từ Pinia
  // }
  // await loadData()
  pageLoading.value = true
  try {
    await Promise.all([productLineStore.fetchForAdmin(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})
defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  showForm.value = true
  productLineStore.clearError()
}

//AddCard
const fields = [
  {
    name: 'name',
    label: 'Tên dòng sản phẩm',
    type: 'text',
    placeholder: 'Nhập tên dòng sản phẩm',
  },
  {
    name: 'brand',
    label: 'Tên thương hiệu',
    placeholder: '>-- Chọn thương hiệu --<',
    type: 'select',
    options: brands.value,
  },
  {
    name: 'description',
    label: 'Mô tả dòng sản phẩm',
    type: 'textarea',
    placeholder: 'Nhập mô dòng sản phẩm',
  },
]

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await productLineStore.delete(deleteItem.value._id)
  if (res?.code === 200) {
    clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(productLineStore.error.errors)[0] ||
      productLineStore.error.general ||
      'Xóa dòng sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const clearError = () => {
  productLineStore.clearError()
}

const openEdit = (productLine) => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_LINE_DETAIL,
    params: {
      slug: productLine.slug,
    },
  })
}

const save = async (data) => {
  const result = await productLineStore.create(data)

  if (result?.code === 200) {
    clearError()
    showForm.value = false
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(productLineStore.error.errors)[0] ||
      productLineStore.error.general ||
      'Lỗi thêm dữ liệu dòng sản phẩm'

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
      title="Quản Lý Dòng Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc dòng sản phẩm của bạn"
      button-text="THÊM DÒNG SẢN PHẨM"
      place-holder="Tìm dòng sản phẩm..."
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
      content="Thêm dòng sản phẩm"
      :items="productLines"
      :show-sidebar="showSidebar"
      :error="error"
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
      count-label="Sản phẩm"
      :show-add-card="false"
      :show-card-item="false"
      :headers="[
        { label: 'Tên dòng SP', width: '1.5fr' },
        { label: 'Mô tả', width: '2.5fr' },
        { label: 'Hãng', width: '1.5fr' },
        { label: 'Số SP', width: '80px' },
        { label: 'Ngày tạo', width: '120px' },
      ]"
      :list-component="ProductLineListItem"
    />
  </div>

  <DialogForm
    :show="showForm"
    title="Thêm dòng sản phẩm"
    :fields="fields"
    @submit="save"
    @close="cancelDialogForm"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa dòng sản phẩm"
    message="Bạn có chắc chắn muốn xóa dòng sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
