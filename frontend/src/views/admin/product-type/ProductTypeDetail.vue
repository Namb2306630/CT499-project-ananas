<script setup>
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import { useProductType } from '@/stores/product-type'
import { useToastStore } from '@/stores/toast'
import { ref, onMounted, watch, computed } from 'vue'
import { useDelete } from '@/composables/useDelete'
import { createSlug } from '@/utils/slug'
import { useRoute, useRouter } from 'vue-router'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
import { storeToRefs } from 'pinia'
import { ROUTE_NAMES } from '@/constants/routes'

const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const toastStore = useToastStore()

const productTypeStore = useProductType()
const { loading, error } = storeToRefs(productTypeStore)
const route = useRoute()
const router = useRouter()
const errors = computed(() => error.value.errors)

const productType = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  isActive: true,
  createdAt: '',
  productCount: 0,
})

onMounted(async () => {
  try {
    const slug = route.params.slug

    // if (productTypeStore.productType?.slug === slug) {
    //   Object.assign(productType.value, productTypeStore.productType)
    // }
    const data = await productTypeStore.getBySlug(slug)

    //thêm dữ liệu và productLine

    //copy data[0] qua productLine.value
    Object.assign(productType.value, data)
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.PRODUCT_TYPES })
  }
})

const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await productTypeStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    productTypeStore.clearError()
    toastStore.showToast(res.message, 'success')

    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productTypeStore.error.errors)[0] ||
      productTypeStore.error.general ||
      'Xóa loại sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

watch(
  () => productType.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      productType.value.slug = createSlug(newName)
    }
  },
)
const saveProductType = async () => {
  const res = await productTypeStore.update(productType.value._id, productType.value)

  if (res?.code === 200) {
    errors.value = {}
    productTypeStore.clearError()
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productTypeStore.error.errors)[0] ||
      productTypeStore.error.general ||
      'Cập nhật loại sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
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
  // toastStore.showToast('Đã hủy thay đổi', 'warning')
}
</script>

<template>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-delete="Xóa loại sản phẩm"
      title-go-back="Chi tiết loại sản phẩm"
      @delete="openDelete(productType)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản của loại sản phẩm">
        <div class="top-info">
          <div class="form">
            <!-- name -->
            <div class="form-group">
              <label for="name" class="mt-0">Tên loại sản phẩm</label>
              <input type="text" name="name" id="name" v-model="productType.name" />
              <p v-if="errors.name" class="p-0 m-0 error">{{ errors.name }}</p>
            </div>

            <!-- slug -->
            <div class="form-group">
              <label for="slug">Đường dẫn thân thiện (Slug)</label>
              <input type="text" name="" id="slug" v-model="productType.slug" readonly />
              <p v-if="errors.slug" class="p-0 m-0 error">{{ errors.slug }}</p>
            </div>

            <!-- mô tả -->
            <div class="form-group">
              <label for="description">Mô tả thêm</label>
              <textarea
                id="description"
                v-model="productType.description"
                rows="5"
                maxlength="500"
                class="description"
                placeholder="Thêm mô tả cho loại sản phẩm..."
              ></textarea>
              <div class="char-count">{{ productType.description.length }}/500</div>

              <p v-if="errors.description" class="p-0 m-0 error">
                {{ errors.description }}
              </p>
            </div>
          </div>
        </div>
      </DetailLayout>
      <div class="row info-card-2">
        <DetailStats
          count-label="Sản phẩm hiện có"
          :created-at="productType.createdAt"
          :count="productType.productCount"
        />
        <DetailStatus
          v-model="productType.isActive"
          title="Trạng thái"
          label="Hiển thị trên website"
          description="Khách hàng có thể thấy các sản phẩm của loại sản phẩm này"
        />
      </div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @cancel="cancelEdit"
        @save="saveProductType"
      />
    </div>
  </div>
  <ConfirmDialog
    title="Xóa loại sản phẩm"
    message="Bạn có chắc muốn xóa loại sản phẩm này?"
    :show="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
