<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { formatCurrency } from '@/utils/formatCurrency'
import LoadingState from '@/components/common/LoadingState.vue'

const BASE_URL = import.meta.env.VITE_BACKEND
const router = useRouter()
const orderStore = useOrderStore()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const { orders, loading, error } = storeToRefs(orderStore)
const pageLoading = ref(false)
/**
 * Format giờ
 */
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Payment method
 */
const getPaymentMethod = (method) => {
  const methods = {
    cod: 'Thanh toán khi nhận hàng',
    momo: 'MoMo',
    vnpay: 'VNPay',
    banking: 'Chuyển khoản ngân hàng',
  }

  return methods[method] || method
}

/**
 * Payment status
 */
const getPaymentStatus = (status) => {
  const statuses = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
  }

  return statuses[status] || status
}

/**
 * Payment status class
 */
const getPaymentStatusClass = (status) => {
  const classes = {
    pending: 'status-warning',
    paid: 'status-success',
    failed: 'status-danger',
  }

  return classes[status] || ''
}

/**
 * Order status
 */
const getOrderStatus = (status) => {
  const statuses = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  }

  return statuses[status] || status
}

/**
 * Order status class
 */
const getOrderStatusClass = (status) => {
  const classes = {
    pending: 'status-warning',
    confirmed: 'status-info',
    shipping: 'status-info',
    completed: 'status-success',
    cancelled: 'status-danger',
  }

  return classes[status] || ''
}

/**
 * Xem chi tiết đơn
 */
const goToDetail = (orderCode) => {
  router.push(`/orders/${orderCode}`)
}

// hủy đơn hàng
const cancelOrder = async (id) => {
  pageLoading.value = true
  try {
    await delay(300)
    await orderStore.cancelOrder(id)
    await orderStore.fetchMyOrders()
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await orderStore.fetchMyOrders()
})
</script>

<template>
  <div class="order-page">
    <LoadingState
      v-if="pageLoading"
      :loading="pageLoading"
      :has-sidebar="false"
      :overlay="true"
      :show-text="false"
      width="30px"
    />
    <div class="container">
      <!-- ================= HEADER ================= -->
      <div class="order-header">
        <div>
          <h1>Đơn hàng của tôi</h1>
          <p>Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        <span v-if="orders.length" class="order-count"> {{ orders.length }} đơn hàng </span>
      </div>

      <!-- ================= LOADING ================= -->
      <div v-if="loading" class="order-loading">
        <div class="spinner-border" role="status"></div>

        <p>Đang tải đơn hàng...</p>
      </div>

      <!-- ================= ERROR ================= -->
      <div v-else-if="error?.code || error?.general" class="order-error">
        <div class="error-icon">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>

        <div>
          <strong>Không thể tải đơn hàng</strong>
          <p>
            {{ error.message || 'Đã xảy ra lỗi khi tải dữ liệu.' }}
          </p>
        </div>
      </div>

      <!-- ================= EMPTY ================= -->
      <div v-else-if="!orders.length" class="empty-order">
        <div class="empty-icon">
          <i class="fa-solid fa-bag-shopping"></i>
        </div>

        <h3>Bạn chưa có đơn hàng nào</h3>

        <p>Các đơn hàng bạn đặt sẽ được hiển thị tại đây.</p>

        <RouterLink to="/products" class="btn-shopping"> Mua sắm ngay </RouterLink>
      </div>

      <!-- ================= ORDER LIST ================= -->
      <div v-else class="order-list">
        <div v-for="order in orders" :key="order._id" class="order-card">
          <!-- ================= ORDER HEADER ================= -->
          <div class="order-card-header">
            <div class="order-header-left">
              <div class="order-code">
                <span>Mã đơn hàng</span>

                <strong>
                  {{ order.orderCode }}
                </strong>
              </div>

              <div class="order-date">
                <i class="fa-regular fa-calendar"></i>

                {{ formatDateTime(order.createdAt) }}
              </div>
            </div>

            <div class="status-box">
              <div class="order-status" :class="getOrderStatusClass(order.orderStatus)">
                {{ getOrderStatus(order.orderStatus) }}
              </div>
              <div
                v-if="getOrderStatus(order.orderStatus) === 'Chờ xác nhận'"
                class="order-cancel"
                @click="cancelOrder(order._id)"
              >
                Hủy đơn hàng
              </div>
            </div>
          </div>

          <!-- ================= PRODUCTS ================= -->
          <div class="order-products">
            <div v-for="item in order.items" :key="item._id" class="order-product">
              <!-- IMAGE -->
              <div class="product-image">
                <img :src="`${BASE_URL}/${item.productImage}`" :alt="item.productName" />
              </div>

              <!-- INFO -->
              <div class="product-info">
                <h3 class="product-name">
                  {{ item.productName }}
                </h3>

                <div class="product-meta">
                  <span>
                    Màu:
                    <strong>{{ item.colorName }}</strong>
                  </span>

                  <span>
                    Size:
                    <strong>{{ item.size }}</strong>
                  </span>

                  <span>
                    SKU:
                    <strong>{{ item.sku }}</strong>
                  </span>
                </div>

                <div class="product-bottom">
                  <span class="product-quantity"> x{{ item.quantity }} </span>

                  <strong class="product-price">
                    {{ formatCurrency(item.unitPrice) }}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= ORDER FOOTER ================= -->
          <div class="order-card-footer">
            <!-- PAYMENT -->
            <div class="payment-section">
              <div class="payment-method">
                <span>Thanh toán</span>

                <strong>
                  {{ getPaymentMethod(order.paymentMethod) }}
                </strong>
              </div>

              <div class="payment-status-wrapper">
                <span>Trạng thái thanh toán</span>

                <strong class="status-badge" :class="getPaymentStatusClass(order.paymentStatus)">
                  {{ getPaymentStatus(order.paymentStatus) }}
                </strong>
              </div>
            </div>

            <!-- TOTAL -->
            <div class="order-total">
              <span>Tổng thanh toán</span>

              <strong>
                {{ formatCurrency(order.totalAmount) }}
              </strong>
            </div>
          </div>

          <!-- ================= ACTION ================= -->
          <div class="order-actions">
            <button type="button" class="btn-detail" @click="goToDetail(order.orderCode)">
              Xem chi tiết

              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =====================================================
   PAGE
===================================================== */

.order-page {
  min-height: 100vh;
  padding: 50px 0 80px;
  background: #fff;
}

/* =====================================================
   HEADER
===================================================== */

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
}

.order-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
}

.order-header p {
  margin: 0;
  color: #777;
}

.order-count {
  color: #777;
  font-size: 15px;
}

/* =====================================================
   LOADING
===================================================== */

.order-loading {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #777;
}

.order-loading p {
  margin: 0;
}

/* =====================================================
   ERROR
===================================================== */

.order-error {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #f5c2c7;
  background: #f8d7da;
  color: #842029;
}

.error-icon {
  font-size: 24px;
}

.order-error strong {
  display: block;
  margin-bottom: 4px;
}

.order-error p {
  margin: 0;
}

/* =====================================================
   EMPTY
===================================================== */

.empty-order {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.empty-icon {
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 50%;
  font-size: 32px;
  color: #777;
}

.empty-order h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 600;
}

.empty-order p {
  margin: 0 0 25px;
  color: #777;
}

.btn-shopping {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  background: #000;
  color: #fff;
  text-decoration: none;
  transition: 0.2s;
}

.btn-shopping:hover {
  background: #333;
}

/* =====================================================
   ORDER LIST
===================================================== */

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* =====================================================
   ORDER CARD
===================================================== */

.order-card {
  overflow: hidden;
  border: 1px solid #e5e5e5;
  background: #fff;
}

/* =====================================================
   ORDER CARD HEADER
===================================================== */

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid #eee;
}

.order-header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.order-code {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-code span {
  font-size: 15px;
  color: #888;
  text-transform: uppercase;
  font-weight: bold;
}

.order-code strong {
  font-size: 15px;
  letter-spacing: 0.3px;
}

.order-date {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #777;
  font-size: 15px;
}

/* =====================================================
   STATUS
===================================================== */

.order-status,
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 15px;
  font-weight: 500;
}

.status-warning {
  background: #fff3cd;
  color: #856404;
}

.status-info {
  background: #cff4fc;
  color: #055160;
}

.status-success {
  background: #d1e7dd;
  color: #0f5132;
}

.status-danger {
  background: #f8d7da;
  color: #842029;
}

/* =====================================================
   PRODUCTS
===================================================== */

.order-products {
  padding: 0 22px;
}

.order-product {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px dashed #ddd;
}

.order-product:last-child {
  border-bottom: none;
}

/* IMAGE */

.product-image {
  width: 110px;
  height: 110px;
  flex: 0 0 110px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

/* INFO */

.product-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  color: #777;
  font-size: 15px;
}

.product-meta strong {
  color: #333;
  font-weight: 500;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
}

.product-quantity {
  color: #777;
  font-size: 15px;
}

.product-price {
  font-size: 15px;
  font-weight: 600;
}

/* =====================================================
   FOOTER
===================================================== */

.order-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

/* PAYMENT */

.payment-section {
  display: flex;
  align-items: center;
  gap: 35px;
}

.payment-method,
.payment-status-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.payment-method > span,
.payment-status-wrapper > span {
  color: #888;
  font-size: 15px;
}

.payment-method strong {
  font-size: 15px;
  font-weight: 500;
}

.payment-status-wrapper .status-badge {
  width: fit-content;
}

/* TOTAL */

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.order-total span {
  color: #777;
  font-size: 15px;
}

.order-total strong {
  font-size: 20px;
  font-weight: 700;
}

/* =====================================================
   ACTION
===================================================== */

.order-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 22px 20px;
}

.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-detail:hover {
  background: #000;
  color: #fff;
}

.status-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-cancel {
  color: #fff;
  background-color: var(--color-23);
  text-align: center;
  padding: 6px 0;
  font-weight: bolder;
  cursor: pointer;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 768px) {
  .order-page {
    padding: 30px 0 50px;
  }

  .order-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .order-header h1 {
    font-size: 23px;
  }

  .order-card-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .order-header-left {
    width: 100%;
    justify-content: space-between;
    gap: 15px;
  }

  .order-date {
    display: none;
  }

  .order-status {
    width: fit-content;
  }

  .product-image {
    width: 85px;
    height: 85px;
    flex-basis: 85px;
  }

  .product-name {
    font-size: 15px;
  }

  .product-meta {
    gap: 5px 12px;
  }

  .product-meta span:nth-child(3) {
    display: none;
  }

  .order-card-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 20px;
  }

  .payment-section {
    width: 100%;
    gap: 20px;
  }

  .order-total {
    width: 100%;
    align-items: flex-start;
  }

  .order-actions {
    padding-top: 0;
  }

  .btn-detail {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .order-header-left {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-products {
    padding: 0 15px;
  }

  .order-card-header {
    padding: 15px;
  }

  .order-card-footer {
    padding: 15px;
  }

  .order-actions {
    padding: 0 15px 15px;
  }

  .order-product {
    gap: 12px;
  }

  .product-image {
    width: 75px;
    height: 75px;
    flex-basis: 75px;
  }

  .product-bottom {
    margin-top: 10px;
  }

  .product-meta {
    flex-direction: column;
    gap: 3px;
  }

  .payment-section {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
