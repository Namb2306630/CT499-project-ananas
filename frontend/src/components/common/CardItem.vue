<script setup>
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config'
const BASE_URL = import.meta.env.VITE_BACKEND

const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)
const props = defineProps({
  item: Object,
  fields: Array,
  countLabel: String,
  objectFit: String,
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}

const formatCurrency = (value) => {
  const currency = systemConfig.value.currency || 'VND'

  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(value ?? 0)
}

// product
const statusMap = {
  active: {
    label: 'Đang bán',
    class: 'active',
  },
  inactive: {
    label: 'Ẩn',
    class: 'inactive',
  },
  discontinued: {
    label: 'Ngừng kinh doanh',
    class: 'discontinued',
  },
}

const genderMap = {
  unisex: {
    label: 'Phi giới tính',
  },
  male: {
    label: 'Nam',
  },
  female: {
    label: 'Nữ',
  },
}

const calculateOriginalPrice = (sellingPrice, discountPercent) => {
  if (!discountPercent || discountPercent === 0) {
    return null
  }

  return Math.round(sellingPrice / (1 - discountPercent / 100))
}
</script>

<template>
  <div class="card-item" @click.stop="handleEdit">
    <div v-for="field in fields" :key="field.name">
      <div class="card-image">
        <img
          v-if="field.type === 'image' && item[field.name]"
          :src="`${BASE_URL}/${item[field.name]}`"
          alt="Ảnh danh mục"
          :style="{ objectFit: objectFit }"
        />

        <div v-else-if="field.type === 'image'" class="no-image">
          <span class="material-symbols-outlined"> hide_image </span>
        </div>
      </div>
      <div class="card-content">
        <h5 v-if="field.type === 'title'">
          {{ item[field.name] }}
        </h5>

        <p v-else-if="field.type === 'text'">
          {{ item[field.name] }}
        </p>

        <p v-else-if="field.type === 'count'" class="count-product">
          {{ item[field.name] }} - {{ countLabel }}
        </p>

        <p v-else-if="field.type === 'ref'" class="ref">
          {{ item[field.name]?.name ? `Thuộc: ${item[field.name].name}` : 'Không có' }}
        </p>

        <div v-else-if="field.type === 'tags'" class="tag-list">
          <template v-if="Array.isArray(item[field.name])">
            <span v-for="line in item[field.name].slice(0, 3)" :key="line._id" class="tag">
              {{ line.name }}
            </span>

            <span v-if="item[field.name].length > 3" class="tag more">
              +{{ item[field.name].length - 3 }}
            </span>
          </template>
        </div>

        <span
          v-else-if="field.type === 'status'"
          :class="['status-badge', item[field.name] ? 'active' : 'inactive']"
        >
          {{ item[field.name] ? 'Hoạt động' : 'Ẩn' }}
        </span>

        <!-- product ================================== -->

        <!-- Trnajg thái sp -->
        <div v-else-if="field.type === 'product-badges'" class="product-badges">
          <div v-if="item.isBestSeller" class="best-seller product-status">
            <span>Bán chạy</span>
          </div>

          <div v-if="item.isNewArrival" class="new-arrival product-status">
            <span>Sản phẩm mới</span>
          </div>

          <div v-if="item.isSale" class="sale product-status">
            <span>Sale</span>
          </div>
        </div>

        <!-- ======================== -->

        <div v-else-if="field.type === 'product-info'" class="product-info">
          <div>
            <span>{{ item.productType?.name }}</span>
          </div>
          <div sclass="gender-box">
            <span> {{ genderMap[item.gender]?.label }}</span>
          </div>
        </div>

        <!-- giá -->
        <div v-else-if="field.type === 'price'" class="price-box">
          <div class="price selling-price">
            <p>Giá bán</p>

            <span
              v-if="calculateOriginalPrice(item[field.sellingPrice], item.discountPercent)"
              class="original-price"
            >
              {{
                formatCurrency(
                  calculateOriginalPrice(item[field.sellingPrice], item.discountPercent),
                )
              }}
            </span>

            <span class="current-price">
              {{ formatCurrency(item[field.sellingPrice]) }}
            </span>
          </div>

          <div class="price cost-price">
            <p>Giá vốn</p>
            <span>
              {{ formatCurrency(item[field.costPrice]) }}
            </span>
          </div>
        </div>

        <!-- sao và trạng thái -->
        <div v-else-if="field.type === 'product-meta'" class="product-meta">
          <div class="product-status-box" :class="statusMap[item.status]?.class">
            {{ statusMap[item.status]?.label }}
          </div>
          <div class="rating-box">
            <i class="fa-solid fa-star"></i>
            <span>{{ item.ratingAverage ?? 0 }}</span>
            <span class="rating-count">({{ item.ratingCount ?? 0 }})</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-actions">
      <button class="edit" @click.stop="handleEdit">
        <i class="fa-solid fa-pen"></i>
      </button>

      <button class="delete" @click.stop="handleDelete">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* product */
.rating-box {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* nằm bên phải */
  gap: 4px;
  padding: 0 15px;
  margin-top: 6px;
}

.rating-box i,
.rating-box span {
  padding: 0 !important; /* bỏ padding 15px mặc định */
}

.rating-box i {
  color: #ffc107;
  font-size: 14px;
}

.rating-box span {
  font-size: 13px;
}

.rating-count {
  color: #777;
}

.price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.selling-price span {
  color: var(--color-bule);
  font-weight: bold;
  font-size: 20px;
}

.price-box p {
  padding: 0;
  margin: 0;
  color: var(--color-11);
  font-weight: bold;
}
.original-price {
  color: var(--text-gray-3);
  text-decoration: line-through;
  font-size: 13px;
}

.current-price {
  color: var(--color-red);
  font-weight: 700;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 10px;
}

.product-status-box {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.product-info div {
  background-color: var(--color-7);
  border-radius: 5px;
  padding: 3px 8px;
  font-weight: 600;
  margin: 10px 0;
}
.product-info > div:first-child {
  background-color: var(--color-9);
  color: #fff;
}

.product-badges {
  position: absolute;
  top: 20px;
  right: 10px;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-status {
  padding: 5px 12px;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.best-seller {
  background: var(--color-4);
}

.new-arrival {
  background: var(--color-bule);
}

.sale {
  background: var(--color-12);
}
.card-content > * {
  padding: 0 10px;
  margin-bottom: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 15px;
  margin-top: 10px;
}

.tag {
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--bg-color-3);
  color: var(--text-gray-2);
  font-size: 12px;
  font-weight: 500;
}

.more {
  background: var(--bg-active);
  color: white;
}
.card-item {
  position: relative;
  border: 1px solid var(--border-gray-3);

  width: 100%;
  min-width: 260px;
  max-width: none;

  min-height: 370px;
  margin-top: 10px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden; /* cắt ảnh theo border */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.card-item:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-black-2);
  cursor: pointer;
}

.card-image img,
.no-image {
  width: 100%;
  height: 200px;
  /* object-fit: cover; cắt ảnh cho vừa */
  /* object-fit: cover; contain thu nhỏ/to vừa khung */
  display: block;
  transition: transform 0.4s ease;
}

/* zoom ảnh */
.card-item:hover .card-image img {
  transform: scale(1.08);
}

.no-image {
  background-color: var(--bg-color-3);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* phần nội dung */

.card-item h5 {
  margin-top: 15px;
  transition: 0.3s ease;
}

.card-item:hover h5 {
  color: var(--color-bule);
}

.no-image span {
  font-size: var(--font-size-xxl);
  color: var(--text-gray-3);
}

/* Status chung */
.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Product */

/* Status của Product */
.product-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.active {
  background: var(--bg-color-green-2);
  color: var(--text-green);
}

.inactive {
  background: var(--bg-color-gray-2);
  color: var(--text-gray-2);
}

.discontinued {
  background: var(--bg-color-red-2);
  color: var(--text-color-red);
}

p {
  font-size: var(--font-size-sm);
  color: var(--text-gray-3);
}
.count-product {
  font-weight: var(--font-width-md);
}

/* action */
.card-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: 0.3s ease;
}

.card-item:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.card-actions button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit {
  background: var(--bg-active);
}

.delete {
  background: var(--bg-color-red);
}
</style>
