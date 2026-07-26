<script setup>
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import { useProductLineStore } from '@/stores/product-line'
import { useBrandStore } from '@/stores/brand'
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
const productLineStore = useProductLineStore()
const brandStore = useBrandStore()
const { brands, loading: loadingBrand, errors: errorsBrand } = storeToRefs(brandStore)
const { error, loading } = storeToRefs(productLineStore)
const route = useRoute()
const router = useRouter()
const errors = computed(() => error.value.errors)

const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await productLineStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    productLineStore.clearError()
    toastStore.showToast(res.message, 'success')
    closeDelete()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productLineStore.error.errors)[0] ||
      productLineStore.error.general ||
      'Xóa dòng sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
    closeDelete()
  }
}

const productLine = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  brand: '',
  isActive: true,
  createdAt: '',
  productCount: 0,
})

onMounted(async () => {
  try {
    await brandStore.fetchAdminBrands()
    const slug = route.params.slug

    // if (productLineStore.productLine?.slug === slug) {
    //   Object.assign(productLine.value, productLineStore.productLine)
    // }
    const data = await productLineStore.getBySlug(slug)

    //thêm dữ liệu và productLine

    //copy data[0] qua productLine.value
    Object.assign(productLine.value, data)
    productLine.value.brand = data.brand._id
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.PRODUCT_LINES })
  }
})

watch(
  () => productLine.value.name,
  (newName) => {
    if (newName != null && newName !== '') {
      productLine.value.slug = createSlug(newName)
    }
  },
)

const saveProductLine = async () => {
  const res = await productLineStore.update(productLine.value._id, productLine.value)

  if (res?.code === 200) {
    errors.value = {}
    productLineStore.clearError()
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productLineStore.error.errors)[0] ||
      productLineStore.error.general ||
      'Cập nhật dòng sản phẩm thất bại!'

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
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}
</script>

<template>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-delete="Xóa dòng sản phẩm"
      title-go-back="Chi tiết dòng sản phẩm"
      @delete="openDelete(productLine)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản của dòng sản phẩm">
        <div class="top-info">
          <div class="form">
            <!-- name -->
            <div class="form-group">
              <label for="name" class="mt-0">Tên dòng sản phẩm</label>
              <input type="text" name="name" id="name" v-model="productLine.name" />
              <p v-if="errors.name" class="p-0 m-0 error">{{ errors.name }}</p>
            </div>

            <!-- slug -->
            <div class="form-group">
              <label for="slug">Đường dẫn thân thiện (Slug)</label>
              <input type="text" name="" id="slug" v-model="productLine.slug" readonly />
              <p v-if="errors.slug" class="p-0 m-0 error">{{ errors.slug }}</p>
            </div>

            <!-- brand -->
            <div class="form-group">
              <label for="brand">Thuộc thương hiệu</label>
              <div class="select-box">
                <select id="brand" v-model="productLine.brand">
                  <option v-for="brand in brands" :key="brand._id" :value="brand._id">
                    {{ brand.name }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
              <p v-if="errors.brand" class="error">
                {{ errors.brand }}
              </p>
            </div>

            <!-- mô tả -->
            <div class="form-group">
              <label for="description">Mô tả thêm</label>
              <textarea
                id="description"
                v-model="productLine.description"
                rows="5"
                maxlength="500"
                class="description"
                placeholder="Thêm mô tả cho dòng sản phẩm..."
              ></textarea>
              <div class="char-count">{{ productLine.description.length }}/500</div>

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
          :created-at="productLine.createdAt"
          :count="productLine.productCount"
        />
        <DetailStatus
          v-model="productLine.isActive"
          title="Trạng thái"
          label="Hiển thị trên website"
          description="Khách hàng có thể thấy các sản phẩm của thương hiệu này này"
        />
      </div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @cancel="cancelEdit"
        @save="saveProductLine"
      />
    </div>
  </div>
  <ConfirmDialog
    title="Xóa dòng sản phẩm"
    message="Bạn có chắc muốn xóa dòng sản phẩm này?"
    :show="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';
</style>
