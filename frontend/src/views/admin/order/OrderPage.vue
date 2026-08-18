<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import AdminToolbar from '@/components/admin/AdminToolbar.vue'
import AppLoading from '@/components/common/LoadingState.vue'
import OrderListItem from '@/components/common/lists/order/OrderListItem.vue'
import { useOrderStore } from '@/stores/order'
import { ROUTE_NAMES } from '@/constants/routes'

const router = useRouter()
const orderStore = useOrderStore()
const { orders, loading, error } = storeToRefs(orderStore)

const pageLoading = ref(true)
const toastStore = useToastStore()
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  pageLoading.value = true

  try {
    await Promise.all([orderStore.fetchOrders(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})

const openDetail = (order) => {
  router.push({
    name: ROUTE_NAMES.ORDER_DETAIL,
    params: {
      id: order.orderCode,
    },
  })
}

const updateStatus = async ({ orderCode, orderStatus }) => {
  const res = await orderStore.updateStatus(orderCode, orderStatus)

  if (res?.code === 200) {
    orderStore.resetError()
    toastStore.showToast(res.message || 'Cập nhật trạng thái thành công', 'success')

    return
  }

  const message =
    orderStore.error?.errors && Object.keys(orderStore.error.errors).length
      ? Object.values(orderStore.error.errors)[0]
      : orderStore.error?.general || 'Cập nhật trạng thái thất bại'

  toastStore.showToast(message, 'error')

  await orderStore.fetchOrders()
}
</script>

<template>
  <AppLoading v-if="pageLoading" :loading="pageLoading" :error="error.general" />

  <div v-else class="admin-container">
    <AppAdminPageHeader
      title="Quản Lý Đơn Hàng"
      description="Quản lý và theo dõi các đơn hàng của khách hàng"
      place-holder="Tìm mã đơn hàng..."
      :show-button="false"
      :filters="[
        {
          label: 'Trạng thái',
          options: ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'],
        },
        {
          label: 'Thanh toán',
          options: ['Chờ thanh toán', 'Đã thanh toán', 'Thất bại'],
        },
      ]"
    />

    <AdminToolbar
      content="Đơn hàng"
      :items="orders"
      :loading="loading"
      @edit="openDetail"
      @update-status="updateStatus"
      :show-add-card="false"
      :show-card-item="false"
      :list-component="OrderListItem"
      :headers="[
        {
          label: 'Mã đơn hàng',
          width: '1.5fr',
        },
        {
          label: 'Khách hàng',
          width: '1.5fr',
        },
        {
          label: 'Sản phẩm',
          width: '100px',
        },
        {
          label: 'Tổng tiền',
          width: '140px',
        },
        {
          label: 'Thanh toán',
          width: '140px',
        },
        {
          label: 'Ngày đặt',
          width: '120px',
        },
      ]"
    />
  </div>
</template>
