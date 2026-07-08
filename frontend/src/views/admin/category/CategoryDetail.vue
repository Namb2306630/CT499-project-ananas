<script setup>
import HeaderDetail from '@/components/common/HeaderDetail.vue'
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

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const toastStore = useToastStore()
const route = useRoute()
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const errors = ref({})

const category = ref({
  name: '',
  slug: '',
  image: '',
  parent: '',
  isActive: true,
  productCount: 0,
  createdAt: '',
})

watch(
  () => category.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      category.value.slug = createSlug(newName)
    }
  },
)
onMounted(async () => {
  const id = route.params.id
  await categoryStore.fetchCategories()
  const data = await categoryStore.getCategoryById(id)

  if (data) {
    category.value = {
      ...data,
      parent: data.parent?._id || data.parent || '',
    }
  }
})
const handleUpload = (image) => {
  category.value.image = image
}

const saveCategory = async () => {
  const id = route.params.id
  const result = await categoryStore.updateCategory(id, category.value)
  if (result?.success) {
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
</script>

<template>
  <div class="container-detail">
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
            <label class="p-0 m-0" for=""> Tên danh mục </label>

            <input id="" v-model="category.name" />
            <p v-if="errors.name" class="error p-0 m-0">
              {{ errors.name }}
            </p>

            <label class="p-0 m-0" for=""> Đường dẫn thân thiện (Slug) </label>

            <input id="" v-model="category.slug" />
            <p v-if="errors.slug" class="error p-0 m-0">
              {{ errors.slug }}
            </p>

            <div class="parent">
              <label for="" class="mr-3"> Danh mục cha </label>

              <select id="" v-model="category.parent">
                <option value="">Không có</option>

                <option v-for="cate in parentCategories" :key="cate._id" :value="cate._id">
                  {{ cate.name }}
                </option>
              </select>
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
        @cancel="router.back()"
      />
    </div>
  </div>

  <ConfirmDialog
    :show="showConfirm"
    title="Xóa danh mục"
    message="Bạn có chắc muốn xóa danh mục này?"
    note="Không thể hoàn tác dữ liệu sau khi xóa"
    @confirm="confirmDelete"
    @cancel="showConfirm.value = false"
    :name="deleteItem?.name"
  />
</template>

<style scoped>
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
select {
  padding: 10px;
  border: 1px solid var(--border-gray-4);
  border-radius: 8px;
}

.row {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
