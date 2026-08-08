<script setup>
import { useToastStore } from '@/stores/toast'
import { useProductStore } from '@/stores/product'
import { useProductLineStore } from '@/stores/product-line'
import { useCategoryStore } from '@/stores/caterory'
import { useCollectionStore } from '@/stores/collection'
import { useProductType } from '@/stores/product-type'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { useProductVariant } from '@/stores/product-variant'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import MultiSelect from '@/components/admin/forms/MultiSelect.vue'
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import { useSystemConfigStore } from '@/stores/system-config'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch, computed } from 'vue'
import {
  formatCurrency,
  formatProfit,
  calculateProfitPercent,
  calculateSellingPrice,
  calculateOriginalPrice,
} from '@/utils/formatCurrency'
import { ROUTE_NAMES } from '@/constants/routes'
import ProductVariantForm from '@/components/admin/forms/ProductVariantForm.vue'

const BASE_URL = import.meta.env.VITE_BACKEND
const productVariantStore = useProductVariant()
const toastStore = useToastStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const productLineStore = useProductLineStore()
const collectionStore = useCollectionStore()
const productTypeStore = useProductType()
const styleStore = useStyleStore()

const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)

const { productVariantOptions } = storeToRefs(productVariantStore)
const { loading, error } = storeToRefs(productStore)
const { collectionOptions } = storeToRefs(collectionStore)
const { productLineOptions } = storeToRefs(productLineStore)
const { productTypeOptions } = storeToRefs(productTypeStore)
const { styleOptions } = storeToRefs(styleStore)
const { categories } = storeToRefs(categoryStore)
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const showForm = ref(false)

const route = useRoute() // lấy params
const router = useRouter() // điều hướng
const errors = computed(() => error.value.errors)

const openAddForm = () => {
  showForm.value = true
  productVariantStore.clearError()
}

const product = ref({
  _id: '',
  name: '',
  slug: '',
  description: '',
  productType: {},
  productLine: {},
  productCollection: {},
  categories: [],
  costPrice: '',
  // sellingPrice: '',
  // originalPrice: '',
  gender: '',
  discountPercent: '',
  style: {},
  isBestSeller: false,
  isNewArrival: false,
  isSale: false,
  status: '',
  ratingAverage: '',
  ratingCount: '',
  variantCount: 0,
})

watch(
  () => product.value.discountPercent,
  (value) => {
    product.value.isSale = Number(value) > 0
  },
)

onMounted(async () => {
  try {
    const slug = route.params.slug
    //kt dữ liệu có trong pinia chưa
    // if (productStore.product?.slug === slug) {
    //   Object.assign(product.value, productStore.product)
    // }
    await Promise.all([
      productTypeStore.fetchOptions(),
      productLineStore.fetchOptions(),
      collectionStore.fetchOptions(),
      styleStore.fetchOptions(),
      categoryStore.fetchCategories(),
      systemConfigStore.get(),
    ])

    const data = await productStore.getBySlug(slug)

    await productVariantStore.fetchOptions(data._id)

    data.categories = data.categories.map((item) => item._id)
    data.productType = data.productType?._id
    data.productLine = data.productLine?._id
    data.productCollection = data.productCollection?._id ?? null
    data.style = data.style?._id ?? null
    data.defaultVariant = data.defaultVariant?._id ?? null

    Object.assign(product.value, data)
  } catch (error) {
    toastStore.showToast(error.general, 'error')

    await router.replace({
      name: ROUTE_NAMES.PRODUCTS,
    })
  }
})
// lấy
const selectedVariant = computed(() =>
  productVariantOptions.value.find((variant) => variant._id === product.value.defaultVariant),
)
// const selectedProductType = computed(() =>
//   productTypeOptions.value.find((i) => i._id === product.value.productType),
// )

// const selectedProductLine = computed(() =>
//   productLineOptions.value.find((i) => i._id === product.value.productLine),
// )

// const selectedCollection = computed(() =>
//   collectionOptions.value.find((i) => i._id === product.value.productCollection),
// )

// const selectedStyle = computed(() => styleOptions.value.find((i) => i._id === product.value.style))

const saveProduct = async () => {
  const res = await productStore.update(product.value._id, product.value)

  if (res?.code === 200) {
    productStore.clearError()
    errors.value = {}
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productStore.error.errors)[0] ||
      productStore.error.general ||
      'Cập nhật sản phẩm thất bại!'

    toastStore.showToast(message, 'error')
  }
}

const cancelEdit = () => {
  toastStore.showToast('Đã hủy thay đổi', 'warning')

  setTimeout(() => {
    router.back()
  }, 300)
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  const res = await productStore.delete(product.value._id)

  if (res?.code === 200) {
    toastStore.showToast(res.message, 'success')

    errors.value = {}
    productStore.clearError()
    setTimeout(() => {
      router.back()
    }, 500)
  } else {
    const message =
      Object.values(productStore.error.errors)[0] ||
      productStore.error.general ||
      'Lỗi xóa dữ liệu sản phẩm!!!'

    toastStore.showToast(message, 'error')
  }
  closeDelete()
}

const cancelDelete = () => {
  closeDelete()
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

// thêm variant trong product
const addProductVariant = async () => {
  console.log('TEST')
}

// product
const statuses = [
  { value: 'active', label: 'Đang bán' },
  { value: 'inactive', label: 'Ẩn' },
  { value: 'discontinued', label: 'Ngừng kinh doanh' },
]
const originalPrice = computed(() => {
  if (!systemConfig.value) return 0

  return calculateOriginalPrice(Number(product.value.costPrice), systemConfig.value)
})

const sellingPrice = computed(() => {
  return calculateSellingPrice(
    Number(product.value.costPrice),
    Number(product.value.discountPercent),
    systemConfig.value,
  )
})
</script>

<template>
  <pre>{{ product.value }}</pre>
  <div v-if="!loading" class="container-detail">
    <HeaderDetail
      title-delete="Xóa sản phẩm"
      title-go-back="Chi tiết sản phẩm"
      @delete="openDelete(product)"
    />
    <div class="detail-grid">
      <div class="detail-row">
        <div class="left-card">
          <DetailLayout title="Thông tin cơ bản của sản phẩm">
            <div class="top-info">
              <div class="form">
                <!-- <pre>{{ product }}</pre> -->
                <!-- name -->
                <label for="name" class="mt-0">Tên sản phẩm</label>
                <input type="text" name="name" id="name" readonly v-model="product.name" />

                <!-- slug -->
                <label for="slug">Đường dẫn thân thiện (Slug)</label>
                <input type="text" name="slug" id="slug" readonly v-model="product.slug" />

                <!-- mô tả -->
                <label for="description">Mô tả thêm</label>
                <textarea
                  id="description"
                  v-model="product.description"
                  rows="5"
                  class="description"
                  placeholder="Thêm mô tả cho sản phẩm..."
                  maxlength="500"
                ></textarea>
                <div class="char-count">{{ product.description.length }}/500</div>

                <p v-if="errors.description" class="p-0 m-0 error">
                  {{ errors.description }}
                </p>
              </div>
            </div>
          </DetailLayout>
          <br />
          <DetailLayout title="Quản lý hình ảnh" icon="image">
            <div class="top-info">
              <div class="form">
                <div class="image-guide">
                  <span class="material-symbols-outlined">info</span>

                  <div>
                    <p class="image-guide-title">Chọn một biến thể sản phẩm để làm ảnh đại diện.</p>
                    <p class="image-guide-desc">
                      Ảnh chính của biến thể sẽ được sử dụng làm ảnh hiển thị mặc định của sản phẩm.
                    </p>
                  </div>
                </div>
                <!-- Bộ sưu tập SP -->
                <div class="select-box mb-3">
                  <label for="variant" class="mr-3"> Biến thể (Variants) </label>
                  <div class="select-box">
                    <select id="variant" v-model="product.defaultVariant">
                      <option :value="null">Không có</option>

                      <option
                        v-for="productVariant in productVariantOptions"
                        :key="productVariant._id"
                        :value="productVariant._id"
                      >
                        {{ productVariant.colorName }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>
                <div class="product-image">
                  <template v-if="selectedVariant">
                    <img :src="`${BASE_URL}/${selectedVariant.mainImage}`" alt="Ảnh sản phẩm" />
                  </template>

                  <template v-else>
                    <span class="material-symbols-outlined">hide_image</span>
                    <p>Chưa chọn biến thể làm ảnh đại diện</p>
                  </template>
                </div>
              </div>
            </div>
          </DetailLayout>

          <br />
          <DetailLayout title="Biến thể sản phẩm (Variants)" icon="layers">
            <div class="top-info">
              <div class="form">
                <div class="variant-header">
                  <button class="btn-add-variant" @click="openAddForm">
                    <i class="fa-solid fa-plus"></i>
                    <span>Thêm biến thể</span>
                  </button>

                  <div class="variant-stock">
                    <span class="label">Số biến thể:</span>
                    <strong class="value">{{ product.variantCount }}</strong>
                  </div>
                </div>
                <div class="list-product-variant">
                  <p>Chú ý: Chổ để hiện danh sách các biến thể sản phẩm</p>
                </div>
              </div>
            </div>
          </DetailLayout>

          <br />
          <DetailLayout title="Dữ liệu tài chính">
            <div class="top-info">
              <div class="form">
                <!-- giá nhập -->
                <div class="form-group">
                  <label for="cost">Giá nhập</label>
                  <div class="input-icon">
                    <input
                      type="number"
                      name="cost"
                      id="cost"
                      v-model="product.costPrice"
                      min="0"
                      step="1"
                    />
                    <span class="suffix">{{ systemConfig.currency }}</span>
                  </div>
                </div>

                <!-- giá bán -->
                <div class="form-group">
                  <label for="selling">Giá bán</label>
                  <div class="input-icon">
                    <input
                      type="number"
                      name="selling"
                      id="selling"
                      readonly
                      :value="originalPrice"
                    />
                    <span class="suffix">{{ systemConfig.currency }}</span>
                  </div>
                </div>

                <!-- giảm giá -->
                <div class="form-group">
                  <label for="discount">Giảm giá (%)</label>
                  <div class="input-icon">
                    <input
                      type="number"
                      name="discount"
                      id="discount"
                      v-model="product.discountPercent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span class="suffix">%</span>
                  </div>
                </div>

                <!-- giá sau giảm-->
                <div class="form-group original-price">
                  <div class="profit">
                    <div class="profit-icon">
                      <span class="material-symbols-outlined"> finance_mode </span>
                    </div>
                    <div>
                      <p>LỢI NHUẬN ƯỚC TÍNH</p>
                      <div class="profit-box">
                        <span class="font-weight-bold">
                          {{ formatProfit(product.costPrice, sellingPrice, systemConfig.currency) }}
                        </span>
                        <span>
                          ({{ calculateProfitPercent(product.costPrice, sellingPrice) }}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>Giá sau khi giảm</p>
                    <span class="font-weight-bold">
                      {{ formatCurrency(sellingPrice, systemConfig.currency) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DetailLayout>
        </div>
        <div class="right-card">
          <DetailLayout title="Phân loại" icon="category">
            <div class="top-info">
              <div class="form">
                <!-- LOại SP -->
                <div class="select-box">
                  <label for="type" class="mr-3"> Loại sản phẩm </label>
                  <div class="select-box">
                    <select id="type" v-model="product.productType">
                      <option v-for="type in productTypeOptions" :key="type._id" :value="type._id">
                        {{ type.name }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>

                <!-- dòng SP -->
                <div class="select-box">
                  <label for="lines" class="mr-3"> Dòng sản phẩm </label>
                  <div class="select-box">
                    <select id="lines" v-model="product.productLine">
                      <option v-for="line in productLineOptions" :key="line._id" :value="line._id">
                        {{ line.name }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>
                <!-- Bộ sưu tập SP -->
                <div class="select-box">
                  <label for="collection" class="mr-3"> Bộ sưu tập </label>
                  <div class="select-box">
                    <select id="collection" name="collection" v-model="product.productCollection">
                      <option
                        v-for="collection in collectionOptions"
                        :key="collection._id"
                        :value="collection._id"
                      >
                        {{ collection.name }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>
                <div class="multi-select">
                  <label for="category" class="mr-3"> Danh mục </label>
                  <MultiSelect
                    v-model="product.categories"
                    :options="categories"
                    placeholder="Chọn danh mục"
                  />
                </div>
              </div>
            </div>
          </DetailLayout>

          <br />

          <DetailLayout title="Thuộc tính" icon="tune">
            <div class="top-info">
              <div class="info-card form">
                <div class="select-box">
                  <label for="style" class="mr-3">Kiểu dáng sản phẩm </label>
                  <div class="select-box">
                    <select id="style" v-model="product.style">
                      <option v-for="style in styleOptions" :key="style._id" :value="style._id">
                        {{ style.name }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>

                <div class="gender-group">
                  <label class="mr-3" for="">Sản phẩm dành cho</label>

                  <div class="radio-group">
                    <label class="radio">
                      <input type="radio" name="gender" v-model="product.gender" value="male" />
                      <span>Nam</span>
                    </label>

                    <label class="radio">
                      <input type="radio" name="gender" v-model="product.gender" value="female" />
                      <span>Nữ</span>
                    </label>

                    <label class="radio">
                      <input type="radio" name="gender" v-model="product.gender" value="unisex" />
                      <span>Phi giới tính</span>
                    </label>
                  </div>

                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>
              </div>
            </div>
          </DetailLayout>

          <br />

          <DetailLayout title="Trạng thái" icon="detector_status">
            <div class="top-info">
              <div class="info-card form">
                <div class="select-box">
                  <label for="status" class="mr-3">Trạng thái hiện tại của sản phẩm </label>
                  <div class="select-box">
                    <select v-model="product.status" id="">
                      <option v-for="status in statuses" :key="status.value" :value="status.value">
                        {{ status.label }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                  <p v-if="errors.parent" class="error p-0 m-0">
                    {{ errors.parent }}
                  </p>
                </div>

                <hr class="divider" />

                <label class="switch-container">
                  <span class="content"> Sản phẩm bán chạy (BestSeller) </span>

                  <div class="switch">
                    <input type="checkbox" v-model="product.isBestSeller" />
                    <span class="slider"></span>
                  </div>
                </label>

                <label class="switch-container">
                  <span class="content"> Sản phẩm mới về (New Arrival) </span>

                  <div class="switch">
                    <input type="checkbox" v-model="product.isNewArrival" />
                    <span class="slider"></span>
                  </div>
                </label>

                <label class="switch-container">
                  <span class="content"> Đang giảm giá (On Sale) </span>

                  <div class="switch">
                    <input type="checkbox" v-model="product.isSale" />
                    <span class="slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </DetailLayout>
          <br />
          <DetailLayout
            title="Trạng thái của sản phẩm"
            icon-type="fa"
            icon="fa-solid fa-check-double"
          >
            <div class="select-box">
              <label for="status">Trạng thái của sản phẩm</label>
              <div class="select-box">
                <select id="status" v-model="product.status">
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ẩn</option>
                  <!-- <option value="discontinued">Ngừng kinh doanh</option> -->
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </DetailLayout>
          <br />

          <DetailLayout
            title="Thống kê Review"
            icon="fa-solid fa-star"
            iconType="fa"
            icon-color="var(--color-20)"
          >
            <div class="top-info">
              <div class="info-card form start-box">
                <div class="start">
                  <template v-for="i in 5" :key="i">
                    <i v-if="i <= Math.floor(product.ratingAverage)" class="fa-solid fa-star"></i>

                    <i
                      v-else-if="i - product.ratingAverage <= 0.5"
                      class="fa-solid fa-star-half-stroke"
                    ></i>

                    <i v-else class="fa-regular fa-star"></i>
                  </template>
                </div>
                <strong class="rating-average">{{ product.ratingAverage }}</strong>
                <p>Dựa trên {{ product.ratingCount }} đánh giá</p>
                <div class="btn-read-review">
                  <button>Xem chi tiết đánh giá</button>
                </div>
              </div>
            </div>
          </DetailLayout>
        </div>
      </div>

      <div class="row info-card-2"></div>
      <DetailActions
        cancel-text="Hủy bỏ"
        save-text="Lưu thay đổi"
        @save="saveProduct"
        @cancel="cancelEdit"
      />
    </div>
  </div>
  <ProductVariantForm
    :show-product-options="false"
    :show="showForm"
    @close="cancelDialogForm"
    @submit="addProductVariant"
  />
  <ConfirmDialog
    :show="showConfirm"
    title="Xóa sản phẩm"
    message="Bạn có chắc muốn xóa sản phẩm này?"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    :name="deleteItem?.name"
  />
</template>

<style scoped>
@import '../../../assets/css/detail-form.css';
@import '../../../assets/css/swtich.css';
.select-box label {
  color: var(--color-4);
  font-weight: 500;
  margin: 0 0 6px 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 20px;
  align-items: start;
}
.content-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--border-gray-3);
  box-shadow: var(--shadow-gray);
  align-items: center;
}

.card-header {
  display: flex;
  flex-direction: row;
  padding: 18px 30px;
  gap: 8px;
  border-bottom: 1px solid var(--border-gray-2);
  align-items: center;
}

.card-header span {
  font-size: 25px;
  padding-left: 12px;
  color: var(--color-bule);
}

.card-header .fa-solid {
  font-size: 20px;
  padding-left: 12px;
  color: rgb(230, 230, 20);
  margin-right: 13px;
}

.left-card,
.right-card {
  width: 100%;
}

.gender-group {
  display: flex;
  flex-direction: column;
}

.radio-group {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  padding: 0;
  margin: 0;
}

.radio:hover {
  border-color: var(--color-bule);
  background: #f8fbff;
}

.radio input[type='radio'] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-bule);
  cursor: pointer;
}
.switch-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  margin: 8px 0 0; /* hoặc margin: 0; */
}

.switch-container span {
  font-weight: 500;
}

.divider {
  border: none;
  border-top: 2px solid var(--border-gray-2);
  margin: 0 0 2px 0;
}

.start {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
.start-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.start-box strong {
  color: #f59e0b;
  font-size: 32px;
  font-weight: 700;
}

.start-box p {
  margin: 0;
  font-style: italic;
}
.btn-read-review button {
  border: 1px solid var(--color-7);
  margin: 10px 0 0 0;
  padding: 5px 10px;
  border-radius: 5px;
}

/* ước tính lợi nhuận */
.original-price {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin-top: 30px;
  border-radius: 4px;
  border: 1px solid var(--color-9);
  background-color: var(--color-13);
}

.original-price p {
  padding: 0;
  margin: 0;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.profit {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.profit .material-symbols-outlined {
  color: var(--color-9);
}

.profit-icon {
  padding: 8px;
  background-color: var(--color-14);
  border-radius: 5px;
}

.profit-box span:first-child {
  color: var(--color-9);
}

.profit-box > span:nth-child(2) {
  color: var(--text-gray-3);
  font-size: 12px;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.btn-add-variant {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: var(--color-7);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-variant:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  background: var(--color-9);
}

.btn-add-variant:active {
  transform: translateY(0);
}

.variant-stock {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 8px 14px;
  border-radius: 999px;

  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.variant-stock .label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.variant-stock .value {
  color: var(--primary-color);
  font-size: 20px;
  font-weight: 700;
}

.image-guide {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.image-guide .material-symbols-outlined {
  color: var(--color-9);
  font-size: 24px;
  margin-top: 2px;
}

.product-image {
  width: 100%;
  height: 260px;
  border: 2px dashed var(--border-gray-2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  background: #fafafa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}

.empty-image .material-symbols-outlined,
.product-image .material-symbols-outlined {
  font-size: 64px;
  color: #bdbdbd;
}

.empty-image p,
.product-image p {
  margin: 0;
  color: var(--text-gray-3);
  font-size: 14px;
}

@media (max-width: 767px) {
  .original-price {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px;
  }

  .profit {
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .profit-icon,
  .material-symbols-outlined {
    display: none;
  }

  .profit-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .original-price > div:last-child {
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid var(--border-gray-2);
  }

  .original-price > div:last-child span {
    font-size: 18px;
    font-weight: 600;
  }

  .variant-header {
    gap: 10px;
  }
}

@media (max-width: 767px) {
  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .left-card,
  .category-card {
    width: 100%;
  }
}
</style>
