<!-- <script setup>
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config'
import { formatCurrency } from '@/utils/formatCurrency'
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

        <div v-else-if="field.type === 'product-info'" class="product-info">
          <div>
            <span>{{ item.productType?.name }}</span>
          </div>
          <div sclass="gender-box">
            <span> {{ genderMap[item.gender]?.label }}</span>
          </div>
        </div>

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
                  systemConfig.currency,
                )
              }}
            </span>

            <span class="current-price">
              {{ formatCurrency(item[field.sellingPrice], systemConfig.currency) }}
            </span>
          </div>

          <div class="price cost-price">
            <p>Giá vốn</p>
            <span>
              {{ formatCurrency(item[field.costPrice], systemConfig.currency) }}
            </span>
          </div>
        </div>

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
@import '../../assets/css/card.css';
</style> -->
