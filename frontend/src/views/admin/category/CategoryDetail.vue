<script setup>
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { useCategoryStore } from '@/stores/caterory'
import { useToastStore } from '@/stores/toast'
import router from '@/router'
import { createSlug } from '@/utils/slug'
import { useDelete } from '@/composables/useDelete'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'

import { ROUTE_NAMES } from '@/constants/routes'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const toastStore = useToastStore()
const route = useRoute()
const categoryStore = useCategoryStore()
const { categories, error, loading } = storeToRefs(categoryStore)
const errors = computed(() => error.value.errors)
const category = ref({
  _id: '',
  name: '',
  slug: '',
  image: '',
  parent: '',
  isActive: true,
  productCount: 0,
  createdAt: '',
})

onMounted(async () => {
  try {
    const slug = route.params.slug
    await categoryStore.fetchCategories()
    if (categoryStore.category?.slug === slug) {
      Object.assign(category.value, categoryStore.category)
    }
    const data = await categoryStore.getCategoryBySlug(route.params.slug)

    Object.assign(category.value, data)

    category.value = {
      ...data,
      parent: data.parent?._id || data.parent || '',
    }
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.CATEGORIES })
  }
})

watch(
  () => category.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      category.value.slug = createSlug(newName)
    }
  },
)

const handleUpload = (image) => {
  category.value.image = image
}

const saveCategory = async () => {
  const result = await categoryStore.updateCategory(category.value._id, category.value)
  if (result?.code === 200) {
    errors.value = {}
    toastStore.showToast(result.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    errors.value = categoryStore.error.errors
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Cập nhật danh mục thất bại!'
    toastStore.showToast(message, 'error')
  }
}

const parentCategories = computed(() => {
  return categories.value.filter((cate) => cate._id !== category.value._id)
})

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const result = await categoryStore.deleteCategory(deleteItem.value._id)
  if (result) {
    toastStore.showToast('Xóa danh mục thành công', 'success')
    closeDelete()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(categoryStore.error.errors)[0] ||
      categoryStore.error.general ||
      'Xóa danh mục thất bại'
    toastStore.showToast(message, 'error')
    closeDelete()
  }
}

const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
}

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}
</script>

<template>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-go-back="Chi tiết danh mục"
      title-delete="Xóa danh mục"
      @delete="openDelete(category)"
    />

    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản">
        <div class="top-info">
          <div class="image-box">
            <UploadImage
              :modelValue="category.image"
              @change="handleUpload"
              height="200px"
              width="200px"
              :show-content-in-image="false"
              :show-b-g-image="false"
            />
          </div>

          <div class="form">
            <div class="form-group">
              <label for="name" class="mt-0"> Tên danh mục </label>
              <input id="name" v-model="category.name" />
              <p v-if="errors.name" class="error p-0 m-0">
                {{ errors.name }}
              </p>
            </div>

            <div class="form-group">
              <label for="slug"> Đường dẫn thân thiện (Slug) </label>
              <input id="slug" v-model="category.slug" readonly />
              <p v-if="errors.slug" class="error p-0 m-0">
                {{ errors.slug }}
              </p>
            </div>

            <div class="form-group">
              <label for="cate"> Danh mục cha </label>
              <div class="select-box">
                <select id="cate" v-model="category.parent">
                  <option value="">Không có</option>

                  <option v-for="cate in parentCategories" :key="cate._id" :value="cate._id">
                    {{ cate.name }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>

              <p v-if="errors.parent" class="error p-0 m-0">
                {{ errors.parent }}
              </p>
            </div>
          </div>
        </div>
      </DetailLayout>

      <div class="row info-card-2">
        <DetailStats
          :count="category.productCount"
          :created-at="category.createdAt"
          count-label="Sản phẩm hiện có"
        />

        <DetailStatus
          v-model="category.isActive"
          title="Trạng thái"
          label="Hiển thị trên website"
          description="Khách hàng có thể thấy danh mục này"
        />
      </div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @save="saveCategory"
        @cancel="cancelEdit"
      />
    </div>
  </div>

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

<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
