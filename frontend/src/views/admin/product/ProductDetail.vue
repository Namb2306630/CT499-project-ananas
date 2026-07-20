<script setup>
import { useToastStore } from '@/stores/toast'
import { useProductStore } from '@/stores/product'
import { useProductLineStore } from '@/stores/product-line'
import { useCategoryStore } from '@/stores/caterory'
import { useCollectionStore } from '@/stores/collection'
import { useProductType } from '@/stores/product-type'
import { useStyleStore } from '@/stores/style'
import { storeToRefs } from 'pinia'
import { useDelete } from '@/composables/useDelete'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import MultiSelect from '@/components/admin/forms/MultiSelect.vue'
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
// import DetailStats from '@/components/admin/detail/DetailStats.vue'
// import DetailStatus from '@/components/admin/detail/DetailStatus.vue'
import DialogForm from '@/components/admin/forms/DialogForm.vue'
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

const toastStore = useToastStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const productLineStore = useProductLineStore()
const collectionStore = useCollectionStore()
const productTypeStore = useProductType()
const styleStore = useStyleStore()

const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)

const { product, loading, error } = storeToRefs(productStore)
const { collections } = storeToRefs(collectionStore)
const { productLines } = storeToRefs(productLineStore)
const { productTypes } = storeToRefs(productTypeStore)
const { styles } = storeToRefs(styleStore)
const { categories } = storeToRefs(categoryStore)
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()

const showForm = ref(false)

// field thêm
const fields = computed(() => [
  {
    name: 'productType',
    type: 'select',
    label: 'Loại sản phẩm',
    placeholder: 'Chọn loại sản phẩm',
    options: productTypes.value,
  },
  {
    name: 'productLine',
    type: 'select',
    label: 'Dòng sản phẩm',
    placeholder: 'Chọn dòng sản phẩm',
    options: productLines.value,
  },
  {
    name: 'productCollection',
    type: 'select',
    label: 'Bộ sưu tập',
    placeholder: 'Chọn bộ sưu tập',
    options: collections.value,
  },
  {
    name: 'categories',
    type: 'multiselect',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    options: categories.value,
  },
  {
    name: 'style',
    type: 'select',
    label: 'Kiểu dáng',
    placeholder: 'Chọn kiểu dáng',
    options: styles.value,
  },

  // 3. Thuộc tính
  {
    name: 'gender',
    type: 'radio',
    label: 'Giới tính',
    options: [
      { label: 'Nam', value: 'male' },
      { label: 'Nữ', value: 'female' },
      { label: 'Phi giới tính', value: 'unisex' },
    ],
  },

  // 4. Giá
  {
    name: 'costPrice',
    type: 'number',
    label: 'Giá nhập',
    placeholder: 'Giá nhập sản phẩm',
  },
  {
    name: 'discountPercent',
    type: 'number',
    label: 'Giảm giá (%)',
    placeholder: 'Nhập % giảm giá',
  },

  // 5. Trạng thái nổi bật
  {
    type: 'checkbox-group',
    label: 'Đánh dấu',
    options: [
      { name: 'isBestSeller', label: 'Bán chạy' },
      { name: 'isNewArrival', label: 'Sản phẩm mới' },
      { name: 'isSale', label: 'Sale' },
    ],
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả sản phẩm',
    placeholder: 'Mô tả sản phẩm',
  },
])

const route = useRoute() // lấy params
const router = useRouter() // điều hướng
const errors = computed(() => error.value.errors)

const openAddForm = () => {
  showForm.value = true
  productStore.clearError()
}

onMounted(async () => {
  const slug = route.params.slug
  if (productStore.product?.slug === slug) {
    Object.assign(product.value, productStore.product)
  }

  const data = await productStore.getBySlug(slug)

  if (data) {
    data.categories = data.categories.map((item) => item._id)
    Object.assign(product.value, data)
  }
  if (!data) {
    toastStore.showToast(error.value.general, 'error')
    router.replace({ name: ROUTE_NAMES.PRODUCTS })
  }
})

const saveProduct = async () => {
  const res = true

  if (res) {
    errors.value = {}
    toastStore.showToast(res.message, 'success')
    setTimeout(() => {
      router.back()
    }, 300)
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

const cancelDialogForm = () => {
  showForm.value = false
  toastStore.showToast('Đã hủy thay đổi', 'warning')
}

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
                <!-- name -->
                <label for="name">Tên sản phẩm</label>
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
                ></textarea>

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
                  <label for="collection" class="mr-3"> Biến thể (Variants) </label>
                  <div class="select-box">
                    <select id="collection">
                      <option value="">{{ product.productCollection?.name }}</option>

                      <option
                        v-for="collection in collections"
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
                <div class="product-image">
                  <template v-if="product.defaultVariant">
                    <img :src="product.defaultVariant.mainImage" alt="Ảnh sản phẩm" />
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
                    <span
                      >Tổng kho: <strong>{{ totalStock }}</strong></span
                    >
                  </div>
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
                    <input type="number" name="cost" id="cost" v-model="product.costPrice" />
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
                        <span>
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
                    <span>
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
                    <select id="type">
                      <option value="">{{ product.productType?.name }}</option>

                      <option v-for="type in productTypes" :key="type._id" :value="type._id">
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
                    <select id="lines">
                      <option value="">{{ product.productLine?.name }}</option>

                      <option v-for="line in productLines" :key="line._id" :value="line._id">
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
                    <select id="collection">
                      <option value="">{{ product.productCollection?.name }}</option>

                      <option
                        v-for="collection in collections"
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
                  <label for="collection" class="mr-3"> Danh mục </label>
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
                    <select id="style">
                      <option value="">{{ product.style?.name }}</option>

                      <option v-for="style in styles" :key="style._id" :value="style._id">
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

          <DetailLayout title="Thống kê Review" icon="fa-solid fa-star" iconType="fa">
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
                <strong>{{ product.ratingAverage }}</strong>
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

  <DialogForm
    title="Thêm sản phẩm"
    :fields="fields"
    :show="showForm"
    @submit="addProductVariant"
    @close="cancelDialogForm"
    :errors="error.errors"
    :general-error="error.general"
    @clear-error="clearError"
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
  margin: 20px 0 2px 0;
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
  font-size: 30px;
  font-weight: 500;
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
  font-size: 16px;
  color: #666;
}

.variant-stock strong {
  color: var(--color-7);
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
  background: #fafafa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
