<script setup>
const BASE_URL = import.meta.env.VITE_BACKEND

defineProps({
  item: Object,

  fields: Array,
})
</script>

<template>
  <div class="card-item">
    <div v-for="field in fields" :key="field.name">
      <div class="card-image">
        <img
          v-if="field.type === 'image' && item[field.name]"
          :src="`${BASE_URL}/${item[field.name]}`"
          alt="Ảnh danh mục"
        />

        <div v-else-if="field.type === 'image'" class="no-image">
          <span class="material-symbols-outlined"> hide_image </span>
        </div>
      </div>
      <h5 v-if="field.type === 'title'">
        {{ item[field.name] }}
      </h5>

      <p v-else-if="field.type === 'text'">
        {{ item[field.name] }}
      </p>

      <p v-else-if="field.type === 'count'" class="count-product">
        {{ item[field.name] }} - Sản phầm
      </p>

      <p v-else-if="field.type === 'ref'" class="ref">
        {{ item[field.name]?.name ? `Thuộc: ${item[field.name].name}` : 'Không có' }}
      </p>

      <span v-else-if="field.type === 'status'" :class="item[field.name] ? 'active' : 'inactive'">
        {{ item[field.name] ? 'Hoạt động' : 'Ẩn' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  position: relative;
  border: 1px solid var(--border-gray-3);
  min-height: 300px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden; /* cắt ảnh theo border */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.card-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: var(--shadow-black-2);
  cursor: pointer;
}

.card-image img,
.no-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

/* zoom ảnh */
.card-item:hover .card-image img {
  transform: scale(1.08);
}

.no-image {
  background-color: var(--bg-color-3);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* phần nội dung */
.card-item h5,
.card-item p,
.card-item span {
  padding-left: 15px;
  padding-right: 15px;
}

.card-item h5 {
  margin-top: 15px;
  transition: 0.3s ease;
}

.card-item:hover h5 {
  color: var(--color-bule);
}

.card-item p {
  margin: 0;
}

.no-image span {
  font-size: var(--font-size-xxl);
  color: var(--text-gray-3);
}

.active {
  /* display: none; */
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px !important;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-color-green-2);
  color: var(--text-green);
}
.inactive {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px !important;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-color-red-2);
  color: var(--text-color-red);
}
p {
  font-size: var(--font-size-sm);
  color: var(--text-gray-3);
}
.count-product {
  font-weight: var(--font-width-md);
}
</style>
