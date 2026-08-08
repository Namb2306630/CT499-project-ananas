<script setup>
import ListBase from '../ListBase.vue'
import { computed } from 'vue'
import { STATUS } from '@/constants/status'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  headers: Array,
})

defineEmits(['edit', 'delete'])

// Định nghĩa độ rộng các cột (khớp với header)
const columns = computed(() =>
  [...props.headers.map((h) => h.width || '1fr'), '120px', '80px'].join(' '),
)
</script>
<template>
  <ListBase
    :item="item"
    :columns="columns"
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  >
    <template #status="{ item }">
      <span :class="STATUS[item.status]?.class || 'inactive'">
        {{ STATUS[item.status]?.label || 'Không xác định' }}
      </span>
    </template>
    <template #default="{ item: variantItem }">
      <div class="cell">
        <strong class="name">{{ variantItem.variant._id }}</strong>
      </div>
      <div class="cell">
        <strong>{{ variantItem.sku }}</strong>
      </div>
      <div class="cell">
        <strong>{{ variantItem.size }}</strong>
      </div>
      <div class="cell product-count">
        <span>{{ variantItem.stock }}</span>
      </div>
      <div
        class="cell"
        :class="{
          'in-stock': variantItem.stock > 0,
          'sold-out': variantItem.stock <= 0,
        }"
      >
        {{ variantItem.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
      </div>
      <div class="cell created-date">
        <span class="material-symbols-outlined"> calendar_today </span>
        {{ new Date(variantItem.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>
<style scoped>
@import '@/assets/css/list-item.css';
.in-stock,
.active {
  padding: 6px 12px;
  border-radius: 20px;
  background: #d1fae5;
  color: #047857;
  font-weight: 500;
}
.sold-out,
.inactive {
  padding: 6px 12px;
  border-radius: 20px;
  background: #fee2e2;
}
.discontinued {
  display: inline-block;
  max-width: 100%;

  padding: 6px 12px;
  border-radius: 20px;
  background: var(--bg-color-red-2);
  color: var(--text-color-red);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
