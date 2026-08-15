<script setup>
const shoes = '/banners/shoes-anatomy-thumbnail.jpg'
</script>

<template>
  <div class="discover-box">
    <img :src="shoes" alt="Ảnh cấu tạo giày" />

    <div class="discover-content">
      <h1>
        "Giải phẫu" giày
        <span>VULCANIZED</span>
      </h1>
    </div>
  </div>
</template>

<style scoped>
.discover-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.discover-content {
  text-align: center;
  max-width: var(1000px);
}

.discover-content h1 {
  text-transform: uppercase;
  color: black;
  font-weight: bold;
}

.discover-content h1 span {
  display: block;
}
</style>
