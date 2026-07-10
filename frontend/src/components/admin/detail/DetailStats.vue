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

  lists: {
    type: Array,
    default: () => [],
  },
})

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<template>
  <div class="card stats">
    <div class="count">
      <p class="p-0 m-0 label">
        {{ countLabel }}
      </p>

      <b>
        {{ count }}
      </b>
    </div>
    <template v-if="productLines?.length">
      <div class="product-lines">
        <p class="label p-0 m-0">Dòng sản phẩm</p>

        <div class="tags">
          <span v-for="list in lists" :key="list._id" class="tag">
            {{ list.name }}
          </span>
        </div>
      </div>
    </template>

    <div class="time">
      <p class="p-0 m-0 label">Tạo lúc</p>

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

.product-lines,
.count,
.time {
  margin-top: 10px;
}

.label {
  color: var(--text-gray-3);
  font-size: 15px;
  font-weight: 500;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag {
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--bg-active);
  color: var(--text-white);
  font-size: 13px;
  font-weight: 500;
}
</style>
