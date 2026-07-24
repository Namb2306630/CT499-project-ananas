<script setup>
import BaseCard from '@/components/common/cards/CardBase.vue'
// import AppPagination from '../../AppPagination.vue'
import { PRODUCT_VARIANT_STATUS } from '@/constants/status'
const BASE_URL = import.meta.env.VITE_BACKEND


const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  objectFit: { type: String, default: 'cover' },
})

defineEmits(['edit', 'delete'])
</script>
<template>
  <BaseCard :item="item" @edit="$emit('edit', $event)" , @delete="$emit('delete', $event)">
    <!-- slot hình ảnh -->
    <template #image>
      <div class="image-wrapper">
        <template v-if="item.mainImage">
          <img
            class="main-image"
            :src="`${BASE_URL}/${item.mainImage}`"
            :style="{ objectFit: objectFit }"
            alt="Ảnh sản phẩm"
          />

          <img
            v-if="item.hoverImage"
            class="hover-image"
            :src="`${BASE_URL}/${item.hoverImage}`"
            :style="{ objectFit }"
            alt="Ảnh hover"
          />
        </template>

        <div v-else class="no-image">
          <span class="material-symbols-outlined">hide_image</span>
        </div>
      </div>
    </template>

    <!-- slot nội dung-->
    <template #content>
      <div class="card-header">
        <h5>{{ item.displayName }}</h5>
      </div>

      <div>
        <span class="id-product"> ID: {{ item._id }} </span>
      </div>
      <div class="color">
        <span class="color-dot" :style="{ backgroundColor: item.colorCode }"> </span>
        {{ item.colorName }}
      </div>
      <div class="card-bottom">
        <span :class="`badge ${PRODUCT_VARIANT_STATUS[item.status].class}`">
          {{ PRODUCT_VARIANT_STATUS[item.status].label }}
        </span>
        <div class="size-badge">
          <i class="fa-solid fa-ruler"></i>
          <span>{{ item.variantItemCount }} sizes</span>
        </div>
      </div>
    </template>
  </BaseCard>
  <!-- <AppPagination /> -->
</template>
<style scoped>
@import '@/assets/css/card.css';
@import '@/assets/css/image-hover.css';
.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ccc;
  vertical-align: middle;
  margin-right: 6px;
}
.color {
  display: flex;
  align-items: center;
  font-weight: 500;
}
.id-product {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.badge {
  padding: 10px 15px;
  border-radius: 20px;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.size-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
}

.size-badge i {
  font-size: 12px;
}
</style>
