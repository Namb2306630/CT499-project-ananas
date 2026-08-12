<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useBrandStore } from '@/stores/brand'
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDelete } from '@/composables/useDelete'
import { ROUTE_NAMES } from '@/constants/routes'
import BrandCard from '@/components/common/cards/brand/BrandCard.vue'
import AppLoading from '@/components/common/LoadingState.vue'
const router = useRouter()

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const brandStore = useBrandStore()
const { brands, loading, error } = storeToRefs(brandStore)
const showForm = ref(false)
const title = ref('Thêm thương hiệu mới mới')
const pageLoading = ref(true)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  // // Hiển thị cache ngay
  // if (brandStore.brands.length > 0) {
  //   // Không làm gì vì UI đang lấy từ Pinia
  // }

  // // Luôn gọi API ở nền để cập nhật
  // await brandStore.fetchAdminBrands()
  pageLoading.value = true
  try {
    await Promise.all([brandStore.fetchAdminBrands(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})

defineProps({
  showSidebar: Boolean,
})

const fields = [
  {
    name: 'name',
    label: 'Tên thương hiệu',
    type: 'text',
    placeholder: 'Nhập tên thương hiệu',
  },
  {
    name: 'description',
    label: 'Mô tả thương hiệu',
    type: 'textarea',
    placeholder: 'Thêm mô tả',
  },
]

const openAddForm = () => {
  title.value = 'Thêm thương hiệu mới'
  showForm.value = true
  brandStore.clearError()
}

const openEdit = (brand) => {
  router.push({
    name: ROUTE_NAMES.BRAND_DETAIL,
    params: {
      slug: brand.slug,
    },
  })
}

const saveBrand = async (data) => {
  let result

  result = await brandStore.createBrand(data)

  if (result?.code === 200) {
    brandStore.clearError()
    showForm.value = false

    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(brandStore.error.errors)[0] ||
      brandStore.error.general ||
      'Thêm thương hiệu sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await brandStore.delete(deleteItem.value._id)
  if (res?.code === 200) {
    brandStore.clearError()
    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(brandStore.error.errors)[0] ||
      brandStore.error.general ||
      'Xóa thương hiệu sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const clearError = () => {
  brandStore.clearError()
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
  <AppLoading v-if="pageLoading" :loading="pageLoading" :error="error.general" />
  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Thương Hiệu"
      description="Quản lý các thương hiệu sản phẩm của bạn"
      place-holder="Nhập tên thương hiệu cần tìm..."
      :filters="[
        {
         label: 'Lọc theo',
          options: ['Hoạt động', 'Đang ẩn'],
        },
      ]"
      button-text="Thêm thương hiệu"
      @click="openAddForm"
    />
    <!--  :loading="loading" -->
    <AdminToolbar
      content="Thêm thương hiệu"
      :items="brands"
      :card-component="BrandCard"
      :show-sidebar="showSidebar"
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>
  <DialogForm
    :show="showForm"
    :showImage="true"
    title-img="Thêm logo thương hiệu"
    content-img="Thêm logo thương hiệu"
    title="Thêm thương hiệu"
    :fields="fields"
    @close="cancelDialogForm"
    @submit="saveBrand"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
    :data="editData"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa thương hiệu sản phẩm"
    message="Bạn có chắc chắn muốn xóa thương hiệu sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
