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

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()
const productTypeStore = useProductType()
const { productTypes, loading, error } = storeToRefs(productTypeStore)
const showForm = ref(false)

const loadData = async () => {
  await productTypeStore.fetchForAdmin()
}

onMounted(async () => {
  if (productTypeStore.productTypes.length > 0) {
    // Không làm gì vì UI đang lấy từ Pinia
  }
  await loadData()
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

const confirmDelete = async () => {
  const res = await productTypeStore.delete(deleteItem.value._id)
  if (res) {
    toastStore.showToast(res.message, 'success')
    closeDelete()
  } else {
    const message =
      Object.values(productTypeStore.error.errors)[0] ||
      productTypeStore.error.general ||
      'Xóa loại sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const clearError = () => {
  productTypeStore.clearError()
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
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Loại Sản Phẩm"
      description="Quản lý và sắp xếp cấu trúc loại sản phẩm của bạn"
      button-text="THÊM LOẠI SẢN PHẨM"
      place-holder="Tìm loại sản phẩm..."
      @click="openAddForm"
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
      :fields="[
        {
          name: 'name',
          label: 'Tên loại SP',
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
    title="Thêm loại sản phẩm"
    :fields="fields"
    @submit="save"
    @close="showForm = false"
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
    @cancel="showConfirm = false"
  />
</template>
