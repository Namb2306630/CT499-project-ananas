<script setup>
import { ref, computed, onMounted } from 'vue'
import { ROUTE_NAMES } from '@/constants/routes'
// ref = lưu dữ liệu
// computed = lấy dữ liệu đó rồi xử lý ra dữ liệu mới -> dữ liệu thay đổi thì nó chạy lại
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
import { useCategoryStore } from '@/stores/caterory'
import { storeToRefs } from 'pinia' // giúp giữ tính reactive - tự cập nhật giao diện khi lấy dl từ pinia như ref
import { useToastStore } from '@/stores/toast'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { useDelete } from '@/composables/useDelete'
import CategoryCard from '@/components/common/cards/category/CategoryCard.vue'
import AppLoading from '@/components/common/LoadingState.vue'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const router = useRouter()
const toastStore = useToastStore()
const categoryStore = useCategoryStore()
const { categories, loading, error } = storeToRefs(categoryStore)
const showForm = ref(false)
const pageLoading = ref(true)

const title = ref('Thêm danh mục mới')
const loadData = async () => {
  await categoryStore.fetchCategories()
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
onMounted(async () => {
  // await loadData()
  pageLoading.value = true
  try {
    await Promise.all([categoryStore.fetchCategories(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})

defineProps({
  showSidebar: Boolean,
})

const openAddForm = () => {
  title.value = 'Thêm danh mục mới'
  showForm.value = true
  categoryStore.clearError()
}

const openEdit = (category) => {
  router.push({
    name: ROUTE_NAMES.CATEGORY_DETAIL,
    params: {
      slug: category.slug,
    },
  })
}

const fields = computed(() => {
  let options = categories.value
  return [
    {
      name: 'name',
      label: 'Tên danh mục',
      type: 'text',
      placeholder: 'Nhập tên danh mục',
    },

    {
      name: 'parent',
      label: 'Danh mục cha',
      placeholder: '>-- Chọn danh mục cha (nếu có) --<',
      type: 'select',
      options,
    },
  ]
})

const saveCategory = async (data) => {
  let result

  result = await categoryStore.createCategories(data)

  if (result?.code === 200) {
    categoryStore.clearError()
    showForm.value = false

    toastStore.showToast(result.message, 'success')

    await loadData()
  } else {
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Thêm danh mục thất bại!'

    toastStore.showToast(message, 'error')
  }
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const result = await categoryStore.deleteCategory(deleteItem.value._id)
  if (result?.code === 200) {
    categoryStore.clearError()
    toastStore.showToast(result.message, 'success')
  } else {
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Xóa danh mục thất bại'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}
const clearError = () => {
  categoryStore.clearError()
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
      title="Quản Lý Danh Mục"
      description="Quản lý và sắp xếp cấu trúc danh mục sản phẩm của bạn"
      button-text="THÊM DANH MỤC"
      place-holder="Tìm danh mục..."
      :filters="[
        {
          label: 'Chọn trạng thái',
          options: ['Hoạt động', 'Đã ẩn'],
        },
      ]"
      @click="openAddForm"
    />
    <AdminToolbar
      content="Thêm danh mục"
      :items="categories"
      :card-component="CategoryCard"
      :show-sidebar="showSidebar"
      @add="openAddForm"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>
  <DialogForm
    :show="showForm"
    :showImage="true"
    :title="title"
    :fields="fields"
    :data="editData"
    @submit="saveCategory"
    @close="cancelDialogForm"
    title-img="Ảnh danh mục (nếu có)"
    content-img="Thêm ảnh danh mục"
    :errors="error.errors"
    :general-error="error.general"
    @clearError="clearError"
  />
  <ConfirmDialog
    :show="showConfirm"
    title="Xóa danh mục"
    message="Bạn có chắc muốn xóa danh mục này?"
    note="Không thể hoàn tác dữ liệu sau khi xóa"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>
