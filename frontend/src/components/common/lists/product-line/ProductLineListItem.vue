<script setup>
import ListBase from '@/components/common/lists/ListBase.vue'

defineProps({
  item: { type: Object, required: true },
})

defineEmits(['edit', 'delete'])

// Định nghĩa độ rộng các cột (khớp với header)
const columns = '1.5fr 2.5fr 1.5fr 80px 120px 120px 80px'
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
      <div class="cell">
        <strong>{{ line.name }}</strong>
      </div>
      <div class="cell">
        {{ line.description || 'Không có mô tả' }}
      </div>
      <div class="cell">
        {{ line.brand?.name || 'Chưa gắn hãng' }}
      </div>
      <div class="cell">
        {{ line.productCount || 0 }}
      </div>
      <div class="cell">
        {{ new Date(line.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>
<style scoped>
@import '@/assets/css/list-item.css';
</style>
