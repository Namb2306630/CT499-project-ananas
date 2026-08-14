<script setup>
const Banner1 = '/banners/1920x960.jpg'
const Banner2 = '/banners/banner-phụ_2m-600x320.jpg'
const Banner3 = '/banners/Frontpage_img-background-Sale-off.jpg'
const Banner4 = '/banners/giày-nam-e1720844745768.jpg'
const Banner5 = '/banners/Frontpage_img-background-Giày-Nữ.jpg'
const Banner6 = '/banners/Frontpage_background-Dòng-Sản-Phẩm.jpg'
const Banner7 = '/banners/Desktop_Homepage_Banner01.jpg'
</script>


<template>
  <div class="body-box">
    <div class="banner1">
      <img :src="Banner1" alt="banner">
    </div>
    <div class="banner-center">
      <div class="banner23">
        <div class="banner2">
          <img :src="Banner2" alt="banner">
          <h3>BLACK & BLACK</h3>
          <p>Mặc dù được ứng dụng rất nhiều, nhưng màu đen lúc nào cũng toát lên một vẻ huyền bí khong nhàm chán</p>
        </div>
        <div class="banner3">
          <img :src="Banner3" alt="banner">
          <h3>OUTLET SAFE</h3>
          <p>Danh mục những sản phẩm bán tại "giá tốt hơn" chỉ được bán kênh online - Online Only, chúng đã từng làm mưa
            làm gió một thời gian và hiện đang rơi vào tình trạng bể size, bể số.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.banner1 {
  display: flex;
  justify-content: center;
  width: 100%;
}

.banner-center {
  max-width: var(--max-width);
  margin: 0 auto;
  margin-top: 60px;
}

.banner23 {
  display: flex;
  gap: 20px;
}

.banner2,
.banner3 {
  width: 600px;
  display: flex;
  flex-direction: column;
}

.banner2 img,
.banner3 img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center;
  display: block;
}

.banner2 h3,
.banner3 h3 {
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  margin-top: 20px;
}

.banner2 p,
.banner3 p {
  color: var(--text-grey);
}
</style>