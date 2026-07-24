<!-- components/cards/ProductCard.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config'
import { formatCurrency } from '@/utils/formatCurrency'
import BaseCard from '@/components/common/cards/CardBase.vue'
import { PRODUCT_STATUS, PRODUCT_GENDER } from '@/constants/status'
const BASE_URL = import.meta.env.VITE_BACKEND
const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)

const props = defineProps({
  item: { type: Object, required: true },
  objectFit: { type: String, default: 'cover' },
})

defineEmits(['edit', 'delete'])

const calculateOriginalPrice = (sellingPrice, discountPercent) => {
  if (!discountPercent) return null
  return Math.round(sellingPrice / (1 - discountPercent / 100))
}
</script>

<template>
  <BaseCard :item="item" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)">
    <!-- Slot Ảnh -->
    <template #image>
      <img
        v-if="item.defaultVariant?.mainImage"
        :src="`${BASE_URL}/${item.defaultVariant.mainImage}`"
        alt="Ảnh sản phẩm"
        :style="{ objectFit: objectFit }"
      />
      <div v-else class="no-image">
        <span class="material-symbols-outlined">hide_image</span>
      </div>
    </template>

    <!-- Slot Nội dung -->
    <template #content>
      <div class="card-header">
        <h5>{{ item.name }}</h5>
      </div>

      <div class="product-badges">
        <span v-if="item.isBestSeller" class="best-seller product-status">Bán chạy</span>
        <span v-if="item.isNewArrival" class="new-arrival product-status">Mới</span>
        <span v-if="item.isSale" class="sale product-status">Sale</span>
      </div>

      <div class="product-info">
        <span>{{ item.productType?.name }}</span>
        <span class="gender-box">{{ PRODUCT_GENDER[item.gender]?.label }}</span>
      </div>

      <div class="price-box">
        <div class="price selling-price">
          <p>Giá bán</p>
          <span
            v-if="calculateOriginalPrice(item.sellingPrice, item.discountPercent)"
            class="original-price"
          >
            {{
              formatCurrency(
                calculateOriginalPrice(item.sellingPrice, item.discountPercent),
                systemConfig.currency,
              )
            }}
          </span>
          <span class="current-price">
            {{ formatCurrency(item.sellingPrice, systemConfig.currency) }}
          </span>
        </div>
        <div class="price cost-price">
          <p>Giá vốn</p>
          <span>{{ formatCurrency(item.costPrice, systemConfig.currency) }}</span>
        </div>
      </div>

      <div class="product-meta">
        <div class="product-status-box" :class="PRODUCT_STATUS[item.status]?.class">
          {{ PRODUCT_STATUS[item.status]?.label }}
        </div>
        <div class="rating-box">
          <i class="fa-solid fa-star"></i>
          <span>{{ item.ratingAverage ?? 0 }}</span>
          <span class="rating-count">({{ item.ratingCount ?? 0 }})</span>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
@import '@/assets/css/card.css';
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

.product-info span {
  background-color: var(--color-7);
  border-radius: 5px;
  padding: 3px 8px;
  font-weight: 600;
  margin: 10px 0;
}
.product-info > span:first-child {
  background-color: var(--color-9);
  color: #fff;
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

.product-badges {
  position: absolute;
  top: 20px;
  right: 10px;

  display: flex;
  flex-direction: column;
  gap: 8px;
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
</style>
