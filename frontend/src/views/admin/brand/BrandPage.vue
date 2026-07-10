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
const router = useRouter()

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const brandStore = useBrandStore()
const { brands, loading, error } = storeToRefs(brandStore)
const showForm = ref(false)
const title = ref('Thêm thương hiệu mới mới')

const loadData = async () => {
  await brandStore.fetchAdminBrands()
}
onMounted(async () => {
  // Hiển thị cache ngay
  if (brandStore.brands.length > 0) {
    // Không làm gì vì UI đang lấy từ Pinia
  }

  // Luôn gọi API ở nền để cập nhật
  await loadData()
})

defineProps({
  showSidebar: Boolean,
})

const fields = [
  {
    name: 'name',
    label: 'Tên thương hiệu *',
    type: 'text',
    placeholder: 'Nhập tên thương hiệu',
  },
  {
    name: 'description',
    label: 'Mô tả danh mục',
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
    showForm.value = false

    toastStore.showToast(result.message, 'success')

    await loadData()
  } else {
    const message =
      Object.values(brandStore.error.errors)[0] ||
      brandStore.error.general ||
      'Thêm thương hiệu sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
}

const confirmDelete = async () => {
  const res = await brandStore.delete(deleteItem.value._id)
  if (res) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
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
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Thương Hiệu"
      description="Quản lý các thương hiệu sản phẩm của bạn"
      place-holder="Nhập tên thương hiệu cần tìm..."
      :filters="[
        {
          label: 'Chọn trạng thái',
          options: ['Hoạt động', 'Đang ẩn'],
        },
      ]"
      button-text="Thêm thương hiệu"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm thương hiệu"
      @add="openAddForm"
      :items="brands"
      :error="error"
      :loading="loading"
      :show-sidebar="showSidebar"
      @edit="openEdit"
      @delete="openDelete"
      count-label="Dòng sản phẩm"
      object-fit="cover"
      :fields="[
        {
          name: 'logo',
          type: 'image',
        },
        {
          name: 'name',
          type: 'title',
        },
        {
          name: 'productLines',
          type: 'count',
        },
        {
          name: 'productLineNames',
          type: 'tags',
        },
        {
          name: 'isActive',
          type: 'status',
        },
      ]"
    />
  </div>
  <DialogForm
    :show="showForm"
    :showImage="true"
    title-img="Thêm logo thương hiệu"
    content-img="Thêm logo thương hiệu"
    title="Thêm thương hiệu"
    :fields="fields"
    @close="showForm = false"
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
    @cancel="showConfirm = false"
  />
</template>
