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

  productLineNames: {
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

      <template v-if="productLineNames">
        <div class="product-lines">
          <p class="label p-0 m-0">Dòng sản phẩm</p>

          <div class="tags">
            <span v-for="name in productLineNames.split(',')" :key="name" class="tag">
              {{ name.trim() }}
            </span>
          </div>
        </div>
      </template>
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

.product-lines {
  margin-top: 16px;
}

.label {
  color: var(--text-gray-3);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px !important;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
