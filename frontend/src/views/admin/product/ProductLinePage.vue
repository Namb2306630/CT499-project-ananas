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

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const brandStore = useBrandStore()
const productLineStore = useProductLineStore()
const { brands } = storeToRefs(brandStore)
const { productLines, loading, error } = storeToRefs(productLineStore)
const showForm = ref(false)
const title = ref('Thêm thương hiệu mới mới')

const loadData = async () => {
  await productLineStore.fetchForAdmin()
}

onMounted(async () => {
  if (productLineStore.productLines.length > 0) {
    // Không làm gì vì UI đang lấy từ Pinia
  }
  await loadData()
})

const openAddForm = () => {
  title.value = 'Thêm dòng sản phẩm mới'
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
  const res = await productLineStore.delete(deleteItem.value._id)
  if (res) {
    toastStore.showToast('Xóa dòng sản phẩm thành công!')
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

  if (result?.success) {
    showForm.value = false
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(productLineStore.error.errors)[0] ||
      productLineStore.error.general ||
      'Lỗi tọa dữ liệu dòng sản phẩm'

    toastStore.showToast(message, 'error')
  }
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Dòng Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc dòng sản phẩm của bạn"
      button-text="THÊM DÒNG SẢN PHẨM"
      place-holder="Tìm dòng sản phẩm..."
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm dòng sản phẩm"
      :items="productLines"
      :show-sidebar="showSidebar"
      :error="error"
      :loading="loading"
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
      count-label="Sản phẩm"
      :show-add-card="false"
      :show-card-item="false"
      :fields="[
        {
          name: 'name',
          label: 'Tên',
          type: 'title',
          width: '1.5fr',
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
          width: '2.5fr',
        },
        {
          name: 'brand',
          label: 'Hãng',
          type: 'ref',
          width: '1.5fr',
        },
        {
          name: 'productCount',
          label: 'Số SP',
          type: 'count',
          width: '80px',
        },
        {
          name: 'createdAt',
          label: 'Ngày tạo',
          type: 'createdAt',
          width: '120px',
        },
        {
          name: 'isActive',
          type: 'isActive',
        },
      ]"
    />
  </div>

  <DialogForm
    :show="showForm"
    title="Thêm dòng sản phẩm"
    :fields="fields"
    @submit="save"
    @close="showForm = false"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
    :data="editData"
  />

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa dòng sản phẩm"
    message="Bạn có chắc chắn muốn xóa dòng sản phẩm này?"
    :name="deleteItem?.name"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
  />
</template>
