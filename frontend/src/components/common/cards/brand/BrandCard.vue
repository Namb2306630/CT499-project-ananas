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
      <div class="card-header">
        <h5>{{ item.name }}</h5>
      </div>
      <span :class="['status-badge', item.isActive ? 'active' : 'inactive']">
        {{ item.isActive ? 'Hoạt động' : 'Ẩn' }}
      </span>
      <div class="product-line-stat">
        <span class="count">
          {{ item.productLineCount }}
        </span>

        <span class="label">
          {{ countLabel }}
        </span>
      </div>

      <div class="tag-list">
        <template v-if="Array.isArray(item.productLines)">
          <span v-for="line in item.productLines.slice(0, 3)" :key="line._id" class="tag">
            {{ line.name }}
          </span>

          <span v-if="item.productLines.length > 3" class="tag more">
            +{{ item.productLines.length - 3 }}
          </span>
        </template>
      </div>
    </template>
  </BaseCard>
</template>
<style scoped>
@import '@/assets/css/card.css';

/* số lượng */
.product-line-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 12px;
}

.product-line-stat .count {
  font-size: 28px;
  font-weight: var(--font-width-lg);
  color: var(--primary-color);
}

.product-line-stat .label {
  font-size: var(--font-size-sm);
  color: var(--text-gray-3);
}

/* tag */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  min-height: 28px;
}

.tag {
  padding: 5px 12px;
  background: var(--color-13);
  color: var(--color-bule);
  border-radius: 999px;
  font-size: var(--font-size-ssm);
  font-weight: var(--font-width-md);
}

.tag.more {
  background: var(--color-14);
  color: var(--color-bule-2);
}
</style>
