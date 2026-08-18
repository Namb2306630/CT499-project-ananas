<script setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { formatCurrency } from '@/utils/formatCurrency'
import ProductOptions from '@/components/product/ProductOptions.vue'
import { ROUTE_NAMES } from '@/constants/routes'
import { useToastStore } from '@/stores/toast'
import LoadingState from '@/components/common/LoadingState.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const BASE_URL = import.meta.env.VITE_BACKEND
const toastStore = useToastStore()
const cartStore = useCartStore()
const { cart, loading, error } = storeToRefs(cartStore)
const hear = ref(false)
const pageLoading = ref(false)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// state riêng cho từng cart item
const itemOptions = ref({})

const initItemOptions = () => {
  if (!cart.value?.items) return

  cart.value.items.forEach((item) => {
    itemOptions.value[item._id] = {
      selectedSize: item.productVariantItem?.size || '',
      quantity: item.quantity || 1,
    }
  })
}

const handlHear = () => {
  hear.value = !hear.value
}

onMounted(async () => {
  pageLoading.value = true

  try {
    await Promise.all([cartStore.fetchCart(), delay(300)])

    initItemOptions()
  } finally {
    pageLoading.value = false
  }
})

// const handleCheckoutWithDelay = (delay = 300) => {
//   pageLoading.value = true

//   setTimeout(() => {
//     pageLoading.value = false
//     router.push({ name: ROUTE_NAMES.SHIPPING })
//   }, delay)
// }

const handleCheckoutWithDelay = () => {
  router.push({ name: ROUTE_NAMES.SHIPPING })
}

const handlDeleteAll = async () => {
  pageLoading.value = true

  await nextTick()
  await delay(300)

  try {
    const res = await cartStore.deleteAll()

    if (res?.code !== 200) {
      const message = cartStore.error.general || 'Xóa giỏ hàng thất bại!!!'
      toastStore.showToast(message, 'error')
    }
  } finally {
    pageLoading.value = false
  }
}

const handlDelete = async (item) => {
  pageLoading.value = true

  await nextTick()
  await delay(300)

  try {
    const res = await cartStore.delete(item)

    if (res?.code !== 200) {
      const message = cartStore.error.general || 'Xóa sản phẩm thất bại!!!'
      toastStore.showToast(message, 'error')
    }
  } finally {
    pageLoading.value = false
  }
}

const handleUpdateCart = async (item) => {
  const options = itemOptions.value[item._id]

  if (!options) return

  const selectedItem = item.variantItems?.find(
    (variantItem) => variantItem.size === options.selectedSize,
  )

  if (!selectedItem) return

  await cartStore.update(item._id, {
    productVariantItem: selectedItem._id,
    quantity: options.quantity,
  })
}

const getItemTotalPrice = (item) => {
  const stock = item.productVariantItem?.stock ?? 0

  if (stock <= 0) {
    return 0
  }

  const price = item.productVariantItem?.variant?.product?.sellingPrice || 0
  const quantity = itemOptions.value[item._id]?.quantity ?? item.quantity ?? 0

  if (quantity <= 0) {
    return 0
  }

  return price * quantity
}
const getSelectedStock = (item) => {
  const options = itemOptions.value[item._id]

  if (!options) return 0

  const selectedItem = item.variantItems?.find(
    (variantItem) => variantItem.size === options.selectedSize,
  )

  return selectedItem?.stock ?? 0
}
const isItemEnoughStock = (item) => {
  const options = itemOptions.value[item._id]

  if (!options) return false

  const stock = getSelectedStock(item)

  return stock > 0 && options.quantity <= stock
}
const getMissingQuantity = (item) => {
  const options = itemOptions.value[item._id]

  if (!options) return 0

  const stock = getSelectedStock(item)

  return Math.max(options.quantity - stock, 0)
}
const totalPrice = computed(() => {
  if (!cart.value?.items?.length) return 0

  return cart.value.items.reduce((total, item) => {
    return total + getItemTotalPrice(item)
  }, 0)
})
//hàm tính tiền giảm của từng sản phẩm
const getItemDiscount = (item) => {
  const originalPrice = item.productVariantItem?.variant?.product?.originalPrice || 0

  const sellingPrice = item.productVariantItem?.variant?.product?.sellingPrice || 0

  const quantity = itemOptions.value[item._id]?.quantity || item.quantity || 1

  return (originalPrice - sellingPrice) * quantity
}

// /Tổng giá gốc của đơn hàng
const totalOriginalPrice = computed(() => {
  if (!cart.value?.items?.length) return 0

  return cart.value.items.reduce((total, item) => {
    if (!isItemEnoughStock(item)) {
      return total
    }

    const originalPrice = item.productVariantItem?.variant?.product?.originalPrice || 0

    const quantity = itemOptions.value[item._id]?.quantity ?? item.quantity ?? 0

    if (quantity <= 0) return total

    return total + originalPrice * quantity
  }, 0)
})

const canCheckout = computed(() => {
  if (!cart.value?.items?.length) return false

  return cart.value.items.every((item) => {
    const stock = item.productVariantItem?.stock ?? 0

    const quantity = itemOptions.value[item._id]?.quantity ?? item.quantity ?? 0

    return stock > 0 && quantity > 0 && quantity <= stock
  })
})
//Tổng tiền giảm
const totalDiscount = computed(() => {
  return totalOriginalPrice.value - totalPrice.value
})
</script>

<template>
  <div class="cart-page">
    <LoadingState
      v-if="pageLoading"
      :loading="pageLoading"
      :has-sidebar="false"
      :overlay="true"
      :show-text="false"
      width="30px"
    />

    <div class="cart-box container-custom">
      <div class="container-left">
        <div class="title-cart">
          <p>giỏ hàng</p>
        </div>

        <div v-if="!cart?.items?.length" class="empty-cart">
          <div><h5>GIỎ HÀNG CỦA BẠN</h5></div>
          <p>Bạn đang không có sản phẩm nào trong giỏ hàng!</p>
          <div class="go-product-list">
            <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LISTS }"> quay lại mua hàng </RouterLink>
          </div>
        </div>

        <div
          v-else
          v-for="item in cart?.items || []"
          :key="item._id"
          class="cart-content"
          :class="{ 'out-of-stock': item.productVariantItem?.stock <= 0 }"
        >
          <div class="img-box">
            <img :src="`${BASE_URL}/${item.productVariantItem?.variant?.mainImage}`" alt="" />
          </div>

          <div class="information">
            <p class="product-name">
              {{ item.productVariantItem?.variant?.product?.name }}
            </p>

            <div class="price">
              <p class="selling-price">
                <span>Giá: </span>
                {{ formatCurrency(item.productVariantItem?.variant?.product?.sellingPrice) }}
              </p>

              <p
                v-if="item.productVariantItem?.variant?.product?.discountPercent > 0"
                class="original-price"
              >
                {{ formatCurrency(item.productVariantItem?.variant?.product?.originalPrice) }}
              </p>
            </div>

            <ProductOptions
              v-if="itemOptions[item._id]"
              v-model:selected-size="itemOptions[item._id].selectedSize"
              v-model:quantity="itemOptions[item._id].quantity"
              :items="item.variantItems || []"
              text-size="16px"
              padding="0"
              height="35px"
              @change="handleUpdateCart(item)"
            />
            <div v-if="!pageLoading && !isItemEnoughStock(item)" class="stock-warning">
              <i class="fa-solid fa-triangle-exclamation"></i>

              <span v-if="getSelectedStock(item) <= 0">
                Size {{ itemOptions[item._id]?.selectedSize }} hiện đã hết hàng.
              </span>

              <span v-else>
                Bạn đang chọn {{ itemOptions[item._id]?.quantity }} sản phẩm, nhưng chỉ còn
                {{ getSelectedStock(item) }} sản phẩm. Vui lòng giảm số lượng.
              </span>
            </div>
          </div>

          <div class="cart-item-actions">
            <div class="cart-total-price">
              {{ formatCurrency(getItemTotalPrice(item)) }}
            </div>
            <div class="status-product">
              {{ item.productVariantItem?.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
            </div>
            <div class="action-right">
              <div @click="handlHear" class="hear">
                <i class="fa-regular fa-heart" :class="hear ? 'fa-solid' : 'fa-regular'"></i>
              </div>
              <div class="delete" @click="handlDelete(item._id)">
                <i class="fa-solid fa-trash-can"></i>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cart?.items?.length" class="border-bottom"></div>
        <div v-if="cart?.items?.length" class="actions">
          <button @click="handlDeleteAll">xóa hết</button>

          <div>
            <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LISTS }"> quay lại mua hàng </RouterLink>
          </div>
        </div>
      </div>

      <div v-if="cart?.items?.length" class="container-rigth">
        <div class="order">
          <h5>đơn hàng</h5>
        </div>
        <div class="price-reduce">
          <div class="total-price">
            <span>Đơn hàng</span>
            <span>{{ formatCurrency(totalOriginalPrice) }}</span>
          </div>

          <div class="total-reduce">
            <span>Giảm</span>
            <span>-{{ formatCurrency(totalDiscount) }}</span>
          </div>
        </div>

        <div class="price-action">
          <div class="tentatively">
            <span>Tạm tính</span>
            <span>{{ formatCurrency(totalPrice) }}</span>
          </div>

          <div class="router-box">
            <button v-if="canCheckout" @click="handleCheckoutWithDelay(1000)">
              Tiếp tục thanh toán
            </button>

            <button v-else disabled class="disabled">Tiếp tục thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  position: relative;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-cart h5 {
  font-weight: bold;
  text-transform: uppercase;
  padding: 10px 0;
}
.empty-cart p {
  margin: 0;
  padding: 40px;
}

.empty-cart a,
.actions a,
.actions button {
  background-color: #000;
  padding: 10px 30px;
  color: white;
  text-transform: uppercase;
  font-weight: bolder;
}

.actions button {
  border: none;
}

.empty-cart a:hover,
.actions a:hover {
  text-decoration: none;
}

.empty-cart div:last-child {
  padding: 0 0 80px 0;
}

.empty-cart div:not(.go-product-list) {
  border-bottom: 2px solid #000;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cart-box {
  margin-top: 0;
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.container-left {
  flex: 1;
}

.container-rigth {
  width: 350px;
  background-color: var(--color-6);
  padding: 10px 20px;
  height: 100%;
}

.title-cart p {
  padding: 10px;
  color: #000;
  text-transform: uppercase;
  font-weight: bold;
}

.title-cart {
  margin: 0;
  background-color: var(--color-6);
}
.cart-content {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 150px;
  align-items: start;
  gap: 20px;
  padding: 5px 0 20px;
  border-bottom: 2px dashed #ddd;
}

.cart-content:not(:has(+ .cart-content)) {
  border-bottom: none;
}

.img-box {
  width: 180px;
}

.img-box img {
  width: 100%;
  display: block;
}

.information {
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}

.price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.selling-price {
  color: var(--text-gray-4);
  font-size: 18px;
  font-weight: bold;
}
.selling-price span {
  font-weight: 500;
}

.original-price {
  text-decoration: line-through;
  font-size: 16px;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding: 50px 0;
}

.product-name {
  color: #000;
  font-weight: bold;
  font-size: 20px;
}
.border-bottom {
  border: 2px solid #000;
  margin: 10px 0 20px 0;
}
.hear {
  color: var(--color-23);
  border: 1px solid #000;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
}
.hear i {
  font-size: 20px;
}

.delete:hover i {
  color: var(--color-23);
}

.delete {
  color: white;
  text-align: center;
  padding: 7px 0;
  background-color: #000;
  cursor: pointer;
}
.cart-total-price {
  color: var(--color-23);
  font-size: 20px;
  font-weight: bolder;
  text-align: end;
}

.action-right {
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 10px;
  padding: 0 0 0 20px;
  margin-top: auto;
}

.cart-item-actions {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.status-product {
  color: var(--color-23);
  text-align: end;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 0;
}

.order h5 {
  text-transform: uppercase;
  font-weight: bolder;
}
.order {
  border-bottom: 2px solid #000;
}
.router-box {
  text-align: center;
  width: 100%;
}

/* .container-rigth:hover a {
  text-decoration: none;
  width: 100%;
} */

.router-box button {
  border: none;
  background-color: var(--color-23);
}
.router-box a,
.router-box button {
  display: block;
  width: 100%;

  text-decoration: none;
  color: #fff;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: bolder;
  background-color: var(--color-23);
  padding: 20px 0;
}

.router-box .disabled {
  /* opacity: 0.5; */
  background-color: var(--color-25);
  color: #000;
}
.price-reduce {
  padding: 20px 0;
  border-bottom: 1.5px dashed var(--border-gray);
}
.total-price,
.total-reduce {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.total-price span:first-child,
.total-reduce span:first-child {
  font-weight: bold;
  color: var(--text-grey);
}
.total-price span:last-child {
  font-weight: bolder;
  color: var(--text-grey);
}

.price-action {
  padding: 20px 0;
}

.price-action div:first-child {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tentatively {
  padding: 20px 0;
}

.tentatively span:first-child {
  text-transform: uppercase;
  color: #000;
  font-size: 15px;
  font-weight: bold;
}
.tentatively span:last-child {
  text-transform: uppercase;
  color: var(--color-23);
  font-size: 18px !important;
  font-weight: bold;
}
.cart-content.out-of-stock {
  opacity: 0.5;
}
.stock-warning {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-top: 10px;
  padding: 10px 12px;

  width: 100%;
  box-sizing: border-box;

  border: 1px solid #f0b429;
  background-color: #fff8e1;
  color: #9a6700;

  font-size: 15px;
  line-height: 1.4;
}

.stock-warning i {
  flex: 0 0 auto;
  margin: 0;
}

.stock-warning span {
  flex: 1;
  min-width: 0;
}
</style>
