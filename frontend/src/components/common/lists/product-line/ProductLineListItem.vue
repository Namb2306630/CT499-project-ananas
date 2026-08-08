<script setup>
import ListBase from '@/components/common/lists/ListBase.vue'
import { computed } from 'vue'
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
    <!-- Slot mặc định chứa các cell dữ liệu -->
    <template #default="{ item: line }">
      <!-- Tên -->
      <div class="cell line-name">
        <strong class="name">
          {{ line.name }}
        </strong>

        <div class="slug">
          {{ line.slug }}
        </div>
      </div>

      <!-- Mô tả -->
      <div class="cell description">
        {{ line.description || 'Không có mô tả' }}
      </div>

      <!-- Brand -->
      <div class="cell">
        <span class="brand-badge">
          {{ line.brand?.name || 'Chưa gắn hãng' }}
        </span>
      </div>

      <!-- Product count -->
      <div class="cell product-count">
        <span>
          {{ line.productCount || 0 }}
        </span>
      </div>

      <!-- Created -->
      <div class="cell created-date">
        <span class="material-symbols-outlined"> calendar_today </span>

        {{ new Date(line.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>
<style scoped>
@import '@/assets/css/list-item.css';
.brand-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--color-10);
  color: var(--color-bule);
  font-size: 13px;
  font-weight: 600;
}
</style>
