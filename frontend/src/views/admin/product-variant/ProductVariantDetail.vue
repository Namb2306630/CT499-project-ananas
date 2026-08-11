<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductVariant } from '@/stores/product-variant'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { ROUTE_NAMES } from '@/constants/routes'
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import VariantImageManager from '@/components/admin/forms/VariantImageManager.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import DetailStats from '@/components/admin/detail/DetailStats.vue'
import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
const productVariantStore = useProductVariant()
const productStore = useProductStore()
const toastStore = useToastStore()
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const { loading, error } = storeToRefs(productVariantStore)
const { productOptions } = storeToRefs(productStore)
const route = useRoute()
const router = useRouter()
const productVariant = ref({
  _id: '',
  product: '',
  colorName: '',
  colorCode: '',
  mainImage: '',
  hoverImage: '',
  images: [],
  status: '',
  variantItemCount: 0,
  createdAt: '',
  displayName: '',
})

onMounted(async () => {
  try {
    const id = route.params.id

    // if (productVariantStore.productVariant?.id === id) {
    //   Object.assign(productVariant.value, productVariantStore.productVariant)
    // }

    const data = await productVariantStore.getById(id)
    await productStore.fetchOptions()
    Object.assign(productVariant.value, {
      ...data,
      product: data.product?._id || '',
    })
  } catch (error) {
    toastStore.showToast(error.general, 'error')
    router.replace({ name: ROUTE_NAMES.PRODUCT_VARIANTS })
  }
})

const errors = computed(() => error.value.errors)

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}
const confirmDelete = async () => {
  if (!deleteItem.value) return

  const res = await productVariantStore.delete(deleteItem.value._id)

  if (res?.code === 200) {
    productVariantStore.clearError()
    toastStore.showToast(res.message, 'success')

    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productVariantStore.error.errors)[0] ||
      productVariantStore.error.general ||
      'Xóa biến thể sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
}

const saveProductVariant = async () => {
  const res = await productVariantStore.update(productVariant.value._id, productVariant.value)
  if (res?.code === 200) {
    // errors.value = {}
    productVariantStore.clearError()
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productVariantStore.error.errors)[0] ||
      productVariantStore.error.general ||
      'Lỗi, không thể câp nhật dữ liệu biến thể sản phẩm!!!'

    toastStore.showToast(message, 'error')
  }
}

const colorCodeRef = ref('#000000')
const updateColor = (e) => {
  let value = e.target.value

  if (!value.startsWith('#')) {
    value = '#' + value
  }

  colorCodeRef.value = value
}
</script>
<template>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-go-back="Chi tiết biến thể sản phẩm"
      title-delete="Xóa biến thể sản phẩm"
      @delete="openDelete(productVariant)"
    />
    <div class="detail-grid">
      <DetailLayout title="Thông tin cơ bản của biến thể sản phẩm">
        <div class="top-info">
          <div class="form">
            <!-- tên sp -->
            <label for="name" class="mt-0">Tên biến thể</label>
            <input
              type="text"
              name="name"
              id="name"
              readonly
              v-model="productVariant.displayName"
            />

            <!-- màu -->
            <div class="color-box">
              <div>
                <label for="colorName">Màu sản phẩm</label>
                <input
                  type="text"
                  name="colorName"
                  id="colorName"
                  v-model="productVariant.colorName"
                />
                <p v-if="errors.colorName" class="p-0 m-0 error">{{ errors.colorName }}</p>
              </div>

              <div>
                <label for="colorCode">Code color</label>
                <div class="color-picker">
                  <input id="" type="color" v-model="productVariant.colorCode" />

                  <input
                    id="colorCode"
                    class="hex-input"
                    type="text"
                    v-model="productVariant.colorCode"
                    @input="updateColor"
                    placeholder="#000000"
                  />
                </div>
                <p v-if="errors.colorName" class="p-0 m-0 error">{{ errors.colorName }}</p>
              </div>
            </div>

            <!-- select -->
            <div class="select-box">
              <label for="product">Sản phẩm</label>
              <div class="select-box">
                <select name="product" id="product" v-model="productVariant.product">
                  <option v-for="item in productOptions" :value="item._id" :key="item._id">
                    {{ item.name }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
      </DetailLayout>
      <br />
      <DetailLayout title="Quản lý hình ảnh biến thể sản phẩm" icon="image">
        <VariantImageManager
          v-model="productVariant"
          :readonly="false"
          :errors="errors"
          height="250px"
          :show-content-in-image="false"
          title-main-image="Ảnh chính sản phẩm"
          title-hover-image="Ảnh hover sản phẩm"
        />
      </DetailLayout>
      <div class="row info-card-2">
        <DetailStats
          count-label="Tổng số size:"
          :count="productVariant.variantItemCount"
          :created-at="productVariant.createdAt"
          icon-type="fa"
          icon="fa-solid fa-diagram-project"
        />
        <DetailLayout
          title="Trạng thái của sản phẩm"
          icon-type="fa"
          icon="fa-solid fa-check-double"
          size-title="20px"
        >
          <div class="select-box">
            <label for="status">Trạng thái của sản phẩm</label>
            <div class="select-box">
              <select id="status" v-model="productVariant.status">
                <option value="active">Đang bán</option>
                <option value="inactive">Ẩn</option>
                <option value="out_of_stock">Hết hàng</option>
                <!-- <option value="discontinued">Ngừng kinh doanh</option> -->
              </select>
              <i class="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </DetailLayout>
      </div>
    </div>
    <DetailActions @cancel="cancelEdit" @save="saveProductVariant" />
  </div>

  <ConfirmDialog
    title="Xóa biến thể sản phẩm"
    message="Bạn có chắc muốn xóa biến thể sản phẩm này?"
    :show="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.displayName"
  />
</template>
<style scoped>
@import '../../../assets/css/detail-form.css';
@import '../../../assets/css/swtich.css';
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.select-box label {
  color: var(--color-4);
  font-weight: 500;
  margin: 0 0 6px 0;
}

.color-picker input[type='color'] {
  width: 55px !important;
  height: 42px;
  padding: 3px;
  border: 1px solid var(--border-gray-3);
  border-radius: 10px;
  cursor: pointer;
  flex: none;
  margin: 0;
}

.hex-input {
  flex: 1;
  height: 42px;
  margin: 0;
}
</style>
