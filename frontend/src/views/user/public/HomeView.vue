<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
import { useRouter } from 'vue-router'

const Banner1 = '/banners/1920x960.jpg'
const Banner2 = '/banners/banner-phụ_2m-600x320.jpg'
const Banner3 = '/banners/Frontpage_img-background-Sale-off.jpg'
const Banner4 = '/banners/giày-nam-e1720844745768.jpg'
const Banner5 = '/banners/Frontpage_img-background-Giày-Nữ.jpg'
const Banner6 = '/banners/Frontpage_background-Dòng-Sản-Phẩm.jpg'
const Banner7 = '/banners/Desktop_Homepage_Banner01.jpg'

const router = useRouter()

const handleClick = (routeName) => {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="body-box">
    <div class="banner1" @click="handleClick(ROUTE_NAMES.PRODUCT_LISTS)">
      <img :src="Banner1" alt="banner" />
    </div>
    <div class="banner-center container-custom">
      <div class="banner23">
        <div class="banner2">
          <img :src="Banner2" alt="banner" @click="handleClick(ROUTE_NAMES.PRODUCT_LISTS)" />
          <h3>BLACK & BLACK</h3>
          <p>
            Mặc dù được ứng dụng rất nhiều, nhưng màu đen lúc nào cũng toát lên một vẻ huyền bí
            khong nhàm chán
          </p>
        </div>
        <div class="banner3">
          <img :src="Banner3" alt="banner" @click="handleClick(ROUTE_NAMES.PRODUCT_LISTS)" />
          <h3>OUTLET SAFE</h3>
          <p>
            Danh mục những sản phẩm bán tại "giá tốt hơn" chỉ được bán kênh online - Online Only,
            chúng đã từng làm mưa làm gió một thời gian và hiện đang rơi vào tình trạng bể size, bể
            số.
          </p>
        </div>
      </div>
      <div class="banner456">
        <h3 class="title-banner456">Danh mục mua hàng</h3>
        <div class="banner456-box">
          <div class="banner-item">
            <img :src="Banner4" alt="Giày nam" />
            <div class="content">
              <h4>Giày nam</h4>
              <div>
                <RouterLink>New Arrivals</RouterLink>
                <RouterLink>Best Seller</RouterLink>
                <RouterLink>Sale-off</RouterLink>
              </div>
            </div>
          </div>

          <div class="banner-item">
            <img :src="Banner5" alt="Giày nữ" />
            <div class="content">
              <h4>Giày nữ</h4>
              <div>
                <RouterLink>New Arrivals</RouterLink>
                <RouterLink>Best Seller</RouterLink>
                <RouterLink>Sale-off</RouterLink>
              </div>
            </div>
          </div>

          <div class="banner-item">
            <img :src="Banner6" alt="Dòng sản phẩm" />
            <div class="content">
              <h4>Dòng sản phẩm</h4>
              <div>
                <RouterLink>New Arrivals</RouterLink>
                <RouterLink>Best Seller</RouterLink>
                <RouterLink>Sale-off</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="banner7" @click="handleClick(ROUTE_NAMES.PRODUCT_LISTS)">
      <img :src="Banner7" alt="banner" />
    </div>
  </div>
</template>
<style scoped>
.banner1,
.banner7 {
  display: flex;
  justify-content: center;
  width: 100%;
}
.banner1 img,
.banner7 img {
  width: 110%;
}

.banner1:hover,
.banner7:hover,
.banner2 img:hover,
.banner3 img:hover {
  cursor: pointer;
}

.banner-center {
  /* max-width: var(--max-width);
  margin: 0 auto; */
  margin-top: 60px;
  margin-bottom: 60px;
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

.title-banner456 {
  text-align: center;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  margin: 60px 0 40px 0;
}
.banner456-box {
  display: flex;
  gap: 10px;
}

.banner-item {
  position: relative;
  flex: 1;
}

.banner-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
  display: block;
  filter: brightness(0.5);
}

.banner-item .content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.banner-item .content h4 {
  font-weight: bold;
  text-transform: uppercase;
}

.banner-item .content a {
  margin: 6px 0;
  font-weight: bold;
  font-size: 16px;
  color: white;
}
.content div {
  display: flex;
  flex-direction: column;
}
.banner-item .content a:hover,
.banner-item .content h4:hover {
  color: var(--color-23);
  text-decoration: none;
}
</style>
