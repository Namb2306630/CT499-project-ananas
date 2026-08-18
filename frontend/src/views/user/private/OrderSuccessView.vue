<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'

const image = '/banners/icon_dat_hang_thanh_cong.svg'

const route = useRoute()
const router = useRouter()

const orderCode = route.query.orderCode

if (!orderCode) {
  router.push({
    name: ROUTE_NAMES.HOME,
  })
}

const continueShopping = () => {
  router.push({
    name: ROUTE_NAMES.PRODUCT_LISTS,
  })
}
</script>

<template>
  <div class="order-success">
    <div class="success-content">
      <div class="success-title">
        <span></span>

        <h1>ĐẶT HÀNG<br />THÀNH CÔNG</h1>

        <span></span>
      </div>

      <p class="success-message">
        Mã đơn hàng của bạn là
        <strong>{{ orderCode }}</strong
        >, hãy lưu lại để tra cứu đơn hàng khi cần thiết. Vui lòng check mail xác nhận để kiểm tra
        thông tin hoặc tra cứu tình trạng đơn hàng.
      </p>

      <div class="success-image">
        <img :src="image" alt="Đặt hàng thành công" />
      </div>

      <p class="success-thank">CUỘC SỐNG CÓ NHIỀU LỰA CHỌN. CẢM ƠN BẠN ĐÃ CHỌN SHIN</p>

      <button @click="continueShopping">TIẾP TỤC MUA HÀNG</button>
    </div>
  </div>
</template>

<style scoped>
.order-success {
  min-height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.success-content {
  width: 100%;
  max-width: 705px;
  text-align: center;
}

.success-title {
  display: flex;
  align-items: center;
  gap: 30px;
}

.success-title span {
  flex: 1;
  height: 1px;
  background: #222;
}

.success-title h1 {
  margin: 0;
  font-size: 42px;
  line-height: 0.95;
  font-weight: 900;
  white-space: nowrap;
}

.success-message {
  margin: 25px 0 30px;
  line-height: 1.5;
}

.success-message strong {
  color: var(--color-23);
}

.success-image {
  border-top: 1px dashed #aaa;
  padding-top: 35px;
}

.success-image img {
  display: block;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
}

.success-thank {
  margin: 20px 0 50px;
  font-weight: 700;
}

.success-content button {
  width: 310px;
  height: 60px;
  border: none;
  background: #f4511e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.success-content button:hover {
  background: #e84717;
}
</style>
