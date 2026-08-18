<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatCurrency'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },

  headers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'update-status'])

const order = computed(() => props.item)

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getItemCount = computed(() => {
  return order.value.items?.reduce((total, item) => total + item.quantity, 0) || 0
})

const getPaymentMethod = (method) => {
  const methods = {
    cod: 'COD',
    momo: 'MoMo',
    vnpay: 'VNPay',
    banking: 'Chuyển khoản',
  }

  return methods[method] || method
}

const getPaymentStatus = (status) => {
  const statuses = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
  }

  return statuses[status] || status
}

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

const paymentClass = (status) => {
  return {
    pending: 'status-warning',
    paid: 'status-success',
    failed: 'status-danger',
  }[status]
}

const orderStatusClass = (status) => {
  return {
    pending: 'status-warning',
    confirmed: 'status-info',
    shipping: 'status-info',
    completed: 'status-success',
    cancelled: 'status-danger',
  }[status]
}

const handleStatusChange = (event) => {
  const newStatus = event.target.value

  emit('update-status', {
    orderCode: order.value.orderCode,
    orderStatus: newStatus,
  })
}

const handleEdit = () => {
  emit('edit', order.value)
}
</script>

<template>
  <div
    class="list-item"
    :style="{
      gridTemplateColumns: headers.map((h) => h.width || '1fr').join(' ') + ' 120px 80px',
    }"
  >
    <!-- MÃ ĐƠN -->
    <div class="cell order-code">
      <strong>
        {{ order.orderCode }}
      </strong>
    </div>

    <!-- KHÁCH HÀNG -->
    <div class="cell customer">
      <div class="customer-avatar">
        {{ order.user?.userName?.charAt(0)?.toUpperCase() || '?' }}
      </div>

      <div class="customer-info">
        <strong>
          {{ order.user?.userName || 'Khách vãng lai' }}
        </strong>

        <span>
          {{ order.user?.phone || '—' }}
        </span>
      </div>
    </div>

    <!-- SẢN PHẨM -->
    <div class="cell product-count">
      <strong>
        {{ order.items?.length || 0 }}
      </strong>

      <span> {{ getItemCount }} sản phẩm </span>
    </div>

    <!-- TỔNG TIỀN -->
    <div class="cell total-price">
      <strong>
        {{ formatCurrency(order.totalAmount) }}
      </strong>
    </div>

    <!-- THANH TOÁN -->
    <div class="cell payment">
      <strong>
        {{ getPaymentMethod(order.paymentMethod) }}
      </strong>

      <span class="payment-status" :class="paymentClass(order.paymentStatus)">
        {{ getPaymentStatus(order.paymentStatus) }}
      </span>
    </div>

    <!-- NGÀY ĐẶT -->
    <div class="cell order-date">
      {{ formatDate(order.createdAt) }}
    </div>

    <!-- TRẠNG THÁI -->
    <div class="cell">
      <select
        class="order-status-select"
        :class="orderStatusClass(order.orderStatus)"
        :value="order.orderStatus"
        @change="handleStatusChange"
      >
        <option value="pending">Chờ xác nhận</option>

        <option value="confirmed">Đã xác nhận</option>

        <option value="shipping">Đang giao hàng</option>

        <option value="completed">Hoàn thành</option>

        <option value="cancelled">Đã hủy</option>
      </select>
    </div>

    <!-- THAO TÁC -->
    <div class="cell actions">
      <button type="button" title="Xem chi tiết" @click="handleEdit">
        <i class="fa-solid fa-eye"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  display: grid;
  gap: 20px;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: 0.2s;
  min-width: 767px;
}

.list-item:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 2px;
}

.order-code strong {
  font-size: 13px;
  word-break: break-word;
}

.customer {
  gap: 10px;
  min-width: 0;
}

.customer-avatar {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eee;
  font-size: 15px;
  font-weight: 600;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.customer-info strong {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-info span {
  font-size: 15px;
  color: #888;
}

.product-count {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.product-count strong {
  font-size: 15px;
}

.product-count span {
  font-size: 15px;
  color: #888;
}

.total-price strong {
  font-size: 15px;
  white-space: nowrap;
}

.payment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.payment strong {
  font-size: 15px;
}

.payment-status {
  padding: 4px 7px;
  font-size: 15px;
  white-space: nowrap;
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

.order-date {
  font-size: 15px;
  color: #666;
  white-space: nowrap;
}

.actions {
  justify-content: center;
}

.actions button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover {
  background: var(--bg-active);
  color: #fff;
}

.order-status-select {
  width: 120px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.order-status-select.status-warning {
  background: #fff3cd;
  color: #856404;
}

.order-status-select.status-info {
  background: #cff4fc;
  color: #055160;
}

.order-status-select.status-success {
  background: #d1e7dd;
  color: #0f5132;
}

.order-status-select.status-danger {
  background: #f8d7da;
  color: #842029;
}
</style>
