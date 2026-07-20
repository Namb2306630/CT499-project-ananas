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
      <h5>
        {{ item.name }}
      </h5>

      <p class="count-product">{{ item.productCount }} - {{ countLabel }}</p>

      <p class="ref">
        {{ item.parent?.name ? `Thuộc: ${item.parent.name}` : 'Không có' }}
      </p>

      <p>
        {{ item.description }}
      </p>

      <span :class="['status-badge', item.isActive ? 'active' : 'inactive']">
        {{ item.isActive ? 'Hoạt động' : 'Ẩn' }}
      </span>
    </template>
  </BaseCard>
</template>

<style scoped>
@import '@/assets/css/card.css';
</style>
