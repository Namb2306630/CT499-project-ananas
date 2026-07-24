<script setup>
import ListBase from '../ListBase.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const columns = '1.5fr 2.5fr 80px 120px 120px 80px'
</script>
<template>
  <ListBase
    :item="item"
    :columns="columns"
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  >
    <template #default="{ item: style }">
      <div class="cell style-name">
        <strong class="name">
          {{ style.name }}
        </strong>
        <div class="slug">
          {{ style.slug }}
        </div>
      </div>
      <div class="cell description">
        {{ style.description || 'Không có mô tả' }}
      </div>
      <div class="cell product-count">
        <span>
          {{ style.productCount || 0 }}
        </span>
      </div>
      <div class="cell created-date">
        <span class="material-symbols-outlined"> calendar_today </span>
        {{ new Date(style.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>
<style scoped>
@import '@/assets/css/list-item.css';
</style>
