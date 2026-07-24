<script setup>
import ListBase from '../ListBase.vue'

defineProps({
  item: { type: Object, required: true },
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
    <template #default="{ item: coll }">
      <!-- Tên collection -->
      <div class="cell collection-name">
        <strong class="name">
          {{ coll.name }}
        </strong>

        <div class="slug">
          {{ coll.slug }}
        </div>
      </div>

      <!-- Mô tả -->
      <div class="cell description">
        {{ coll.description || 'Không có mô tả' }}
      </div>

      <!-- Số sản phẩm -->
      <div class="cell product-count">
        <span>
          {{ coll.productCount || 0 }}
        </span>
      </div>

      <!-- Ngày -->
      <div class="cell created-date">
        <span class="material-symbols-outlined"> calendar_today </span>

        {{ new Date(coll.createdAt).toLocaleDateString('vi-VN') }}
      </div>
    </template>
  </ListBase>
</template>

<style scoped>
@import '@/assets/css//list-item.css';
</style>
