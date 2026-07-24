<script setup>
import { useBrandStore } from '@/stores/brand'
import { useToastStore } from '@/stores/toast'
import { useRoute, useRouter } from 'vue-router'
import { createSlug } from '@/utils/slug'
import { useDelete } from '@/composables/useDelete'
import { storeToRefs } from 'pinia'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
// import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { ROUTE_NAMES } from '@/constants/routes'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const toastStore = useToastStore()
const brandStore = useBrandStore()
const { error, loading } = storeToRefs(brandStore)
const errors = computed(() => error.value.errors)

const route = useRoute() // lấy params
const router = useRouter() // điều hướng

const brand = ref({
  _id: '',
  name: '',
  slug: '',
  logo: '',
  description: '',
  isActive: true,
  productLineCount: 0,
  productLines: '',
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
  try {
    const slug = route.params.slug

    //kt dữ liệu có trong pinia chưa
    if (brandStore.brand?.slug === slug) {
      Object.assign(brand.value, brandStore.brand)
    }

    const data = await brandStore.getBySlug(slug)

    Object.assign(brand.value, data)
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.BRANDS })
  }
})

const handleUpload = (image) => {
  brand.value.logo = image
}

const saveBrand = async () => {
  const res = await brandStore.updateBrand(brand.value._id, brand.value)

  if (res?.code === 200) {
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

const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
}

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy xóa thương hiệu sản phẩm', 'warning')
}
</script>

<template>
  <div v-if="!loading" class="container-detail">
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
              object-fit="contain"
            />
          </div>
          <div class="form">
            <div class="form-group">
              <label for="name" class="mt-0">Tên thương hiệu</label>
              <input name="" id="name" v-model="brand.name" />
              <p v-if="errors.name" class="p-0 m-0 error">{{ errors.name }}</p>
            </div>
            <div class="form-group">
              <label for="slug">Đường dẫn thân thiện (Slug)</label>
              <input name="" id="slug" v-model="brand.slug" readonly />
              <p v-if="errors.slug" class="p-0 m-0 error">{{ errors.slug }}</p>
            </div>

            <div class="form-group">
              <label for="description">Mô tả thêm</label>
              <textarea
                id="description"
                v-model="brand.description"
                rows="5"
                class="description"
                placeholder="Thêm mô tả cho thương hiệu..."
              ></textarea>

              <p v-if="errors.description" class="p-0 m-0 error">
                {{ errors.description }}
              </p>
            </div>
          </div>
        </div>
      </DetailLayout>

      <div class="row info-card-2">
        <DetailStats
          :count="brand.productLineCount"
          :created-at="brand.createdAt"
          count-label="Dòng sản phẩm hiện có"
          :lists="brand.productLines"
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
        @cancel="cancelEdit"
      />
    </div>
  </div>
  <ConfirmDialog
    :show="showConfirm"
    title="Xóa thương hiệu sản phẩm"
    message="Bạn có chắc muốn xóa thương hiệu sản phẩm này?"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>

<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
