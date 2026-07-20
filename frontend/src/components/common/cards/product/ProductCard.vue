<!-- components/cards/ProductCard.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config'
import { formatCurrency } from '@/utils/formatCurrency'
import BaseCard from '@/components/common/cards/CardBase.vue'

const BASE_URL = import.meta.env.VITE_BACKEND
const systemConfigStore = useSystemConfigStore()
const { systemConfig } = storeToRefs(systemConfigStore)

const props = defineProps({
  item: { type: Object, required: true },
  objectFit: { type: String, default: 'cover' },
})

defineEmits(['edit', 'delete'])

const statusMap = {
  active: { label: 'Đang bán', class: 'active' },
  inactive: { label: 'Ẩn', class: 'inactive' },
  discontinued: { label: 'Ngừng kinh doanh', class: 'discontinued' },
}

const genderMap = {
  unisex: { label: 'Phi giới tính' },
  male: { label: 'Nam' },
  female: { label: 'Nữ' },
}

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
        v-if="item.image"
        :src="`${BASE_URL}/${item.image}`"
        alt="Ảnh sản phẩm"
        :style="{ objectFit: objectFit }"
      />
      <div v-else class="no-image">
        <span class="material-symbols-outlined">hide_image</span>
      </div>
    </template>

    <!-- Slot Nội dung -->
    <template #content>
      <h5>{{ item.name }}</h5>

      <div class="product-badges">
        <span v-if="item.isBestSeller" class="best-seller product-status">Bán chạy</span>
        <span v-if="item.isNewArrival" class="new-arrival product-status">Mới</span>
        <span v-if="item.isSale" class="sale product-status">Sale</span>
      </div>

      <div class="product-info">
        <span>{{ item.productType?.name }}</span>
        <span class="gender-box">{{ genderMap[item.gender]?.label }}</span>
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
        <div class="product-status-box" :class="statusMap[item.status]?.class">
          {{ statusMap[item.status]?.label }}
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
</style>
