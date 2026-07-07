<script setup>
defineProps({
  count: {
    type: Number,
    default: 0,
  },

  countLabel: {
    type: String,
    default: 'Sản phẩm hiện có',
  },

  createdAt: {
    type: String,
    default: '',
  },
})

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<template>
  <div class="card stats">
    <div>
      <p class="p-0 m-0">
        {{ countLabel }}
      </p>

      <b>
        {{ count }}
      </b>
    </div>

    <div>
      <p class="p-0 m-0">Tạo lúc</p>

      <b>
        {{ formatDate(createdAt) }}
      </b>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-gray);
  background: white;
}

.stats {
  display: flex;
  justify-content: space-between;
}
</style>
