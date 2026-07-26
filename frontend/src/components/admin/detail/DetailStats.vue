<script setup>
defineProps({
  title: {
    type: String,
    default: 'Thống kê',
  },
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
  titleLists: {
    type: String,
    default: '',
  },
  lists: {
    type: Array,
    default: () => [],
  },
  icon: {
    type: String,
    default: 'fa-solid fa-diagram-project',
  },

  iconType: {
    type: String,
    default: 'fa', // material | fa
  },
  iconColor: {
    type: String,
    default: 'var(--color-bule)',
  },
})

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<template>
  <div class="card stats">
    <div class="card-header">
      <!-- Material -->
      <span
        v-if="iconType === 'material'"
        class="material-symbols-outlined"
        :style="{ color: iconColor }"
      >
        {{ icon }}
      </span>

      <!-- FontAwesome -->
      <i
        v-else-if="iconType === 'fa'"
        :class="icon"
        class="iconI"
        :style="{ color: iconColor }"
      ></i>
      <p>{{ title }}</p>
    </div>
    <div class="content-box">
      <div class="count">
        <p class="p-0 m-0 label">
          {{ countLabel }}
        </p>

        <b>
          {{ count }}
        </b>
      </div>
      <template v-if="lists.length">
        <div class="product-lines">
          <p class="label p-0 m-0">{{ titleLists }}</p>

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
  </div>
</template>

<style scoped>
@import '../../../assets/css/detail-card.css';
.card {
  border-radius: 12px;
  box-shadow: var(--shadow-gray);
  background: white;
}

.product-lines {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-gray-2);
}

.stats {
  display: flex;
  flex-direction: column;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--color-13);
  color: var(--color-bule);
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
}

.tag:hover {
  background: var(--color-14);
}
.count {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-gray-2);
}

.count b {
  font-size: 42px;
  line-height: 1;
  font-weight: 700;
  color: var(--primary-color);
}

.time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}
.label {
  color: var(--text-gray-3);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.time b {
  font-size: 15px;
  font-weight: 600;
}
</style>
