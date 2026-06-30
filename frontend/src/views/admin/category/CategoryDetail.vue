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

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

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

  console.log('parent:', category.value.parent)
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
      <div class="basic-info-card">
        <div class="info-card-1">
          <h3>Thông tin cơ bản</h3>

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
        </div>
      </div>

      <div class="row info-card-2">
        <div class="card stats">
          <div>
            <p class="p-0 m-0">Sản phẩm hiện có</p>

            <b>
              {{ category.productCount }}
            </b>
          </div>

          <div>
            <p class="p-0 m-0">Tạo lúc</p>

            <b>
              {{ formatDate(category.createdAt) }}
            </b>
          </div>
        </div>

        <div class="card status">
          <h3>Trạng thái</h3>

          <label class="switch-container">
            <div>
              <h5 class="p-0 m-0">Hiển thị trên website</h5>
              <p class="p-0 m-0">Khách hàng có thể thấy danh mục này</p>
            </div>

            <div class="switch">
              <input type="checkbox" v-model="category.isActive" />
              <span class="slider"></span>
            </div>
          </label>
        </div>
      </div>
      <div class="actions">
        <button class="cancel" @click="router.back()">Hủy bỏ</button>

        <button class="save" @click="saveCategory">Lưu thay đổi</button>
      </div>
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
.container-detail {
  background: var(--color-5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.basic-info-card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border-gray-3);
  box-shadow: var(--shadow-gray);
}

.info-card-1 {
  padding: 30px;
}

.info-card-2 {
  padding: 15px;
}

.detail-grid {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 30px 0 30px 0;
}
.card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-gray);
}

.top-info {
  display: flex;
  gap: 30px;
}

.image-box {
  position: relative;
}

.image-box img,
.no-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
}

.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.stats {
  display: flex;
  justify-content: space-between;
}

.actions {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  gap: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
}

.cancel {
  background: var(--color-6);
}

.cancel:hover {
  background: var(--color-7);
}
.save {
  background: var(--color-8);
  color: white;
  transition: 0.3s ease;
}
.save:hover {
  transform: translateY(-5px);
}
/* nút hiển thị website */
.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.switch {
  position: relative;
  width: 45px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background: var(--color-7);
  border-radius: 30px;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: var(--color-4);
}

.switch input:checked + .slider::before {
  transform: translateX(21px);
}

@media (max-width: 767px) {
  .top-info {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .info-card-2 {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .detail-grid {
    padding: 20px;
  }
}
</style>
