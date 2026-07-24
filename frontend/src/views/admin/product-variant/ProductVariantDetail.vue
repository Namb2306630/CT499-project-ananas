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

    if (productVariantStore.productVariant?.id === id) {
      Object.assign(productVariant.value, productVariantStore.productVariant)
    }

    const data = await productVariantStore.getById(id)
    await productStore.fetchOptions()
    Object.assign(productVariant.value, data)
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
const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
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
    <HeaderDetail title-go-back="Chi tiết biến thể sản phẩm" title-delete="Xóa biến thể sản phẩm" />
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
                <label for="colorName" class="mt-0">Màu sản phẩm</label>
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
        />
      </DetailLayout>
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
@import '../../../assets/css/swtich.css';
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
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
.color-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.color-box > div:first-child {
  flex: 2;
}

.color-box > div:last-child {
  flex: 1;
}
</style>
