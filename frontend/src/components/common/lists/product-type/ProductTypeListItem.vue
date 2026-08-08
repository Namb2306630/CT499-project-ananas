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
    <template #default="{ item: type }">
      <!-- tên -->
      <div class="cell type-name">
        <strong class="name">{{ type.name }}</strong>
        <div class="slug">
          {{ type.slug }}
        </div>
      </div>

      <div class="cell description">
        {{ type.description || 'Không có mô tả' }}
      </div>

      <div class="cell product-count">
        <span>
          {{ type.productCount || 0 }}
        </span>
      </div>

      <div class="cell created-date">
        <span class="material-symbols-outlined"> calendar_today </span>
        {{ new Date(type.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>

<style scoped>
@import '@/assets/css/list-item.css';
</style>
