<script setup>
import { useBrandStore } from '@/stores/brand'
import { useToastStore } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { createSlug } from '@/utils/slug'
import { useDelete } from '@/composables/useDelete'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import HeaderDetail from '@/components/common/HeaderDetail.vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const toastStore = useToastStore()
const brandStore = useBrandStore()
const { loading } = storeToRefs(brandStore)
const errors = ref({})

const route = useRoute() // lấy params
const router = useRouter() // điều hướng

const brand = ref({
  name: '',
  slug: '',
  logo: '',
  description: '',
  isActive: true,
  productLines: 0,
  productLineNames: '',
  createdAt: '',
})

watch(
  () => brand.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      brand.value.slug = createSlug(newName)
    }
  },
)

onMounted(async () => {
  const id = route.params.id

  //kt dữ liệu có trong pinia chưa
  if (brandStore.brand?._id === id) {
    Object.assign(brand.value, brandStore.brand)
  }

  const data = await brandStore.getById(id)

  if (data) {
    Object.assign(brand.value, data)
  }
})

const handleUpload = (image) => {
  brand.value.logo = image
}

const saveBrand = async () => {
  const id = route.params.id
  const res = await brandStore.updateBrand(id, brand.value)

  if (res?.success) {
    errors.value = {}
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    errors.value = brandStore.error.errors
    const message =
      Object.values(brandStore.error.errors)[0] ||
      brandStore.error.general ||
      'Cập nhật thương hiệu sản phẩm thất bại!'
    toastStore.showToast(message, 'error')
  }
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await brandStore.delete(deleteItem.value._id)

  if (res) {
    toastStore.showToast('Xóa thương hiệu sản phẩm thành công', 'success')
    closeDelete()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(brandStore.error.errors)[0] ||
      brandStore.error.general ||
      'Xóa thương hiệu sản phẩm thất bại!'
    toastStore.showToast(message, 'error')
    closeDelete()
  }
}
</script>

<template>
  <div class="container-detail">
    <HeaderDetail
      title-delete="Xóa thương hiệu sản phẩm"
      title-go-back="Chi tiết thương hiệu"
      @delete="openDelete(brand)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản của thương hiệu">
        <div class="top-info">
          <div class="image-box">
            <UploadImage
              :modelValue="brand.logo"
              @change="handleUpload"
              height="200px"
              width="200px"
              :show-content-in-image="false"
              :show-b-g-image="false"
            />
          </div>
          <div class="form">
            <label for="" class="p-0 m-0">Tên thương hiệu</label>
            <input name="" id="" v-model="brand.name" />
            <p v-if="errors.name" class="p-0 m-0 error">{{ errors.name }}</p>

            <label for="" class="p-0 m-0">Đường dẫn thân thiện (Slug)</label>
            <input name="" id="" v-model="brand.slug" />
            <p v-if="errors.name" class="p-0 m-0 error">{{ errors.slug }}</p>

            <label for="" class="p-0 m-0">Mô tả thêm</label>

            <textarea id="" v-model="brand.description" rows="5" class="description"></textarea>

            <p v-if="errors.description" class="p-0 m-0 error">
              {{ errors.description }}
            </p>
          </div>
        </div>
      </DetailLayout>

      <div class="row info-card-2">
        <DetailStats
          :count="brand.productLines"
          :created-at="brand.createdAt"
          count-label="Dòng sản phẩm hiện có"
          :product-line-names="brand.productLineNames"
        />

        <DetailStatus
          v-model="brand.isActive"
          title="Trạng thái"
          label="Hiển thị trên website"
          description="Khách hàng có thể thấy các sản phẩm của thương hiệu này này"
        />
      </div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @save="saveBrand"
        @cancel="router.back()"
      />
    </div>
  </div>
  <ConfirmDialog
    :show="showConfirm"
    title="Xóa thương hiệu sản phẩm"
    message="Bạn có chắc muốn xóa thương hiệu sản phẩm này?"
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

.description {
  min-height: 70px;
  max-height: 150px;
  resize: vertical;
}

input {
  padding: 10px;
  border: 1px solid var(--border-gray-4);
  border-radius: 8px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.row {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
