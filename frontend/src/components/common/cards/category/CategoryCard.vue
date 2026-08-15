<script setup>
import BaseCard from '@/components/common/cards/CardBase.vue'

const BASE_URL = import.meta.env.VITE_BACKEND

defineProps({
  item: {
    type: Object,
    required: true,
  },
  objectFit: {
    type: String,
    default: 'cover',
  },
  countLabel: {
    type: String,
    default: 'Sản phẩm',
  },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <BaseCard :item="item" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)">
    <template #image>
      <img
        v-if="item.image"
        :src="`${BASE_URL}/${item.image}`"
        :style="{ objectFit }"
        alt="Ảnh danh mục"
      />

      <div v-else class="no-image">
        <span class="material-symbols-outlined"> hide_image </span>
      </div>
    </template>

    <template #content>
      <div class="card-header">
        <h5>
          {{ item.name }}
        </h5>
      </div>
      <span :class="['status-badge', item.isActive ? 'active' : 'inactive']">
        {{ item.isActive ? 'Hoạt động' : 'Ẩn' }}
      </span>

      <div class="center-box">
        <div class="product-stat">
          <span class="count">
            {{ item.productCount }}
          </span>

          <span class="label">
            {{ countLabel }}
          </span>
        </div>
        <div class="mega-menu">
          <span class="label"> Mega Menu: </span>

          <span :class="item.megaMenu.enabled ? 'enabled' : 'un-enabled'">
            {{ item.megaMenu.enabled ? 'Có' : 'Không' }}
          </span>
        </div>
      </div>

      <div class="parent-category">
        <span class="material-symbols-outlined"> category </span>

        <span>
          {{ item.parent?.name || 'Danh mục gốc' }}
        </span>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
@import '@/assets/css/card.css';
.center-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.enabled {
  color: var(--primary-color);
  font-weight: bolder;
}
.un-enabled {
  color: var(--color-23);
  font-weight: bolder;
}
.card-header {
  display: flex;
  align-items: center;
  background-color: var(--color-5);
  border-bottom: 1px solid var(--border-gray-2);
}

/* số sản phẩm */
.product-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.product-stat .count {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.product-stat .label,
.mega-menu .label {
  color: var(--text-gray-3);
  font-size: var(--font-size-sm);
}

/* danh mục cha */
.parent-category {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: var(--text-gray-3);
  font-size: var(--font-size-sm);
}

.parent-category .material-symbols-outlined {
  font-size: 18px;
}
</style>
