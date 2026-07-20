<script setup>
import BaseCard from '@/components/common/cards/CardBase.vue'

const BASE_URL = import.meta.env.VITE_BACKEND

const props = defineProps({
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
    default: 'Dòng sản phẩm',
  },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <BaseCard :item="item" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)">
    <!-- Ảnh -->
    <template #image>
      <img
        v-if="item.logo"
        :src="`${BASE_URL}/${item.logo}`"
        alt="Logo thương hiệu"
        :style="{ objectFit }"
      />

      <div v-else class="no-image">
        <span class="material-symbols-outlined"> hide_image </span>
      </div>
    </template>

    <!-- Nội dung -->
    <template #content>
      <h5>
        {{ item.name }}
      </h5>

      <p class="count-product">{{ item.productLines }} - {{ countLabel }}</p>

      <div class="tag-list">
        <template v-if="Array.isArray(item.productLineNames)">
          <span v-for="line in item.productLineNames.slice(0, 3)" :key="line._id" class="tag">
            {{ line.name }}
          </span>

          <span v-if="item.productLineNames.length > 3" class="tag more">
            +{{ item.productLineNames.length - 3 }}
          </span>
        </template>
      </div>

      <span :class="['status-badge', item.isActive ? 'active' : 'inactive']">
        {{ item.isActive ? 'Hoạt động' : 'Ẩn' }}
      </span>
    </template>
  </BaseCard>
</template>
<style scoped>
@import '@/assets/css/card.css';
</style>
