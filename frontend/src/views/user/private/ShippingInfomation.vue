<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemConfigStore } from '@/stores/system-config'
import { useProvinceStore } from '@/stores/province'
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTE_NAMES } from '@/constants/routes'
import LoadingState from '@/components/common/LoadingState.vue'
import { useOrderStore } from '@/stores/order'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
const addressStore = useAddressStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const provinceStore = useProvinceStore()
const cartStore = useCartStore()
const systemStore = useSystemConfigStore()
const orderStore = useOrderStore()
const router = useRouter()
const { addresses } = storeToRefs(addressStore)
const { systemConfig } = storeToRefs(systemStore)
const creatingOrder = ref(false)
const { provinces, districts, wards } = storeToRefs(provinceStore)
const { user } = storeToRefs(authStore)

const { cart } = storeToRefs(cartStore)
const pageLoading = ref(false)
const selectedAddressId = ref(null)
const showAddressForm = ref(false)
const editingAddressId = ref(null)
const selectedProvinceCode = ref('')
const selectedDistrictCode = ref('')
const selectedWardCode = ref('')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const form = ref({
  displayName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  detail: '',
  isDefault: false,
})

/* =========================
   COMPUTED
========================= */

const selectedAddress = computed(() => {
  return addresses.value.find((item) => item._id === selectedAddressId.value)
})

const totalOriginalPrice = computed(() => {
  return (
    cart.value?.items?.reduce((total, item) => {
      const price = Number(item.productVariantItem?.variant?.product?.originalPrice) || 0

      const quantity = Number(item.quantity) || 0

      return total + price * quantity
    }, 0) || 0
  )
})

const totalPrice = computed(() => {
  return (
    cart.value?.items?.reduce((total, item) => {
      const price = Number(item.productVariantItem?.variant?.product?.sellingPrice) || 0

      const quantity = Number(item.quantity) || 0

      return total + price * quantity
    }, 0) || 0
  )
})

const totalDiscount = computed(() => {
  return totalOriginalPrice.value - totalPrice.value
})

const canCheckout = computed(() => {
  return !!selectedAddress.value
})

/* =========================
   MOUNTED
========================= */

onMounted(async () => {
  pageLoading.value = true

  try {
    await Promise.all([
      authStore.getMe(),
      addressStore.fetchAddresses(),
      provinceStore.fetchProvinces(),
      cartStore.fetchCart(),
      systemStore.get(),
      delay(300),
    ])

    const defaultAddress = addresses.value.find((item) => item.isDefault)

    if (defaultAddress) {
      selectedAddressId.value = defaultAddress._id
    } else if (addresses.value.length) {
      selectedAddressId.value = addresses.value[0]._id
    }
  } catch (error) {
    console.error(error)
  } finally {
    pageLoading.value = false
  }
})

const freeShippingThreshold = computed(() => {
  return Number(systemConfig.value?.freeShippingThreshold) || 0
})

const shippingFee = computed(() => {
  return totalPrice.value > freeShippingThreshold.value ? 0 : 30000
})

const isFreeShipping = computed(() => {
  return shippingFee.value === 0
})

const finalTotal = computed(() => {
  return totalPrice.value + shippingFee.value
})

/* =========================
   ADDRESS SELECT
========================= */

const selectAddress = (address) => {
  selectedAddressId.value = address._id
}

/* =========================
   CREATE ADDRESS
========================= */

const openCreateAddress = () => {
  editingAddressId.value = null

  form.value = {
    displayName: user.value?.userName || '',
    phone: user.value?.phone || '',
    province: '',
    district: '',
    ward: '',
    detail: '',
    isDefault: addresses.value.length === 0,
  }

  selectedProvinceCode.value = ''
  selectedDistrictCode.value = ''
  selectedWardCode.value = ''

  provinceStore.clearDistricts()
  provinceStore.clearWards()

  showAddressForm.value = true
}

/* =========================
   PROVINCE
========================= */

const handleProvinceChange = async () => {
  const province = provinces.value.find(
    (item) => String(item.code) === String(selectedProvinceCode.value),
  )

  form.value.province = province?.name || ''
  form.value.district = ''
  form.value.ward = ''

  selectedDistrictCode.value = ''
  selectedWardCode.value = ''

  provinceStore.clearDistricts()
  provinceStore.clearWards()

  if (selectedProvinceCode.value) {
    await provinceStore.fetchDistricts(selectedProvinceCode.value)
  }
}

/* =========================
   DISTRICT
========================= */

const handleDistrictChange = async () => {
  const district = districts.value.find(
    (item) => String(item.code) === String(selectedDistrictCode.value),
  )

  form.value.district = district?.name || ''
  form.value.ward = ''

  selectedWardCode.value = ''

  provinceStore.clearWards()

  if (selectedDistrictCode.value) {
    await provinceStore.fetchWards(selectedDistrictCode.value)
  }
}

/* =========================
   WARD
========================= */

const handleWardChange = () => {
  const ward = wards.value.find((item) => String(item.code) === String(selectedWardCode.value))

  form.value.ward = ward?.name || ''
}

/* =========================
   EDIT ADDRESS
========================= */

const openEditAddress = async (address) => {
  editingAddressId.value = address._id

  form.value = {
    displayName: address.displayName || '',
    phone: address.phone || '',
    province: address.province || '',
    district: address.district || '',
    ward: address.ward || '',
    detail: address.detail || '',
    isDefault: address.isDefault || false,
  }

  selectedProvinceCode.value = ''
  selectedDistrictCode.value = ''
  selectedWardCode.value = ''

  provinceStore.clearDistricts()
  provinceStore.clearWards()

  // Tìm tỉnh theo tên
  const province = provinces.value.find((item) => item.name === address.province)

  if (province) {
    selectedProvinceCode.value = province.code

    await provinceStore.fetchDistricts(province.code)

    // Tìm huyện
    const district = districts.value.find((item) => item.name === address.district)

    if (district) {
      selectedDistrictCode.value = district.code

      await provinceStore.fetchWards(district.code)

      // Tìm xã
      const ward = wards.value.find((item) => item.name === address.ward)

      if (ward) {
        selectedWardCode.value = ward.code
      }
    }
  }

  showAddressForm.value = true
}
/* =========================
   CLOSE FORM
========================= */

const closeAddressForm = () => {
  showAddressForm.value = false

  editingAddressId.value = null

  selectedProvinceCode.value = ''
  selectedDistrictCode.value = ''
  selectedWardCode.value = ''

  provinceStore.clearDistricts()
  provinceStore.clearWards()
}

/* =========================
   SAVE ADDRESS
========================= */

const saveAddress = async () => {
  try {
    if (editingAddressId.value) {
      await addressStore.updateAddress(editingAddressId.value, form.value)
    } else {
      await addressStore.createAddress(form.value)
    }

    const defaultAddress = addresses.value.find((item) => item.isDefault)

    if (defaultAddress) {
      selectedAddressId.value = defaultAddress._id
    } else if (addresses.value.length) {
      selectedAddressId.value = addresses.value[0]._id
    }

    closeAddressForm()
  } catch {
    const message =
      Object.values(orderStore.error.errors)[0] ||
      orderStore.error.general ||
      'Vui lòng thêm đầy đủ thông tin nhận hàng!'

    toastStore.showToast(message, 'error')
  }
}

/* =========================
   DELETE ADDRESS
========================= */

const removeAddress = async (address) => {
  if (address.isDefault) {
    return
  }
  pageLoading.value = true
  try {
    await Promise.all([delay(300), addressStore.deleteAddress(address._id)])

    if (selectedAddressId.value === address._id) {
      selectedAddressId.value =
        addresses.value.find((item) => item.isDefault)?._id || addresses.value[0]?._id || null
    }
  } finally {
    pageLoading.value = false
  }
}

/* =========================
   SET DEFAULT
========================= */

const setDefaultAddress = async (address) => {
  try {
    await addressStore.setDefaultAddress(address._id)

    selectedAddressId.value = address._id
  } catch (error) {
    console.error(error)
  }
}

const handleCreateOrder = async () => {
  if (!selectedAddress.value || creatingOrder.value) {
    return
  }

  try {
    creatingOrder.value = true

    const payload = {
      paymentMethod: 'cod',

      items: cart.value.items.map((item) => ({
        variantItem: item.productVariantItem._id,
        quantity: item.quantity,
      })),
    }

    const createdOrder = await orderStore.createOrder(payload)

    await delay(300)
    await cartStore.fetchCart()
    router.push({
      name: ROUTE_NAMES.ORDER_SUCCESS,
      query: {
        orderCode: createdOrder.orderCode,
      },
    })
  } catch {
    const message =
      Object.values(orderStore.error.errors)[0] || orderStore.error.general || 'Lỗi không xác định!'

    toastStore.showToast(message, 'error')
  } finally {
    creatingOrder.value = false
  }
}
</script>

<template>
  <div class="shipping-page">
    <LoadingState
      v-if="pageLoading || creatingOrder"
      :loading="pageLoading || creatingOrder"
      :has-sidebar="false"
      :overlay="true"
      :show-text="false"
      width="30px"
    />

    <div class="cart-box container-custom">
      <div class="container-left">
        <div class="title-cart">
          <p>Thông tin đơn hàng</p>
        </div>
        <section class="shipping-section">
          <div class="section-title">
            <h5>Thông tin người nhận</h5>
          </div>
          <div class="receiver-info">
            <div class="form-group">
              <label>Họ và tên</label>

              <input type="text" :value="user?.userName || ''" readonly />
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>

              <input type="text" :value="user?.phone || ''" readonly />
            </div>
          </div>
        </section>
        <section class="shipping-section">
          <div class="section-title">
            <h5>Địa chỉ nhận hàng</h5>

            <button type="button" class="add-address" @click="openCreateAddress">
              + Thêm địa chỉ
            </button>
          </div>
          <div v-if="showAddressForm" class="address-form">
            <div class="form-title">
              <h6>
                {{ editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới' }}
              </h6>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Họ tên</label>

                <input v-model="form.displayName" type="text" placeholder="Nhập họ tên" />
              </div>
              <div class="form-group">
                <label>Số điện thoại</label>

                <input v-model="form.phone" type="text" placeholder="Nhập số điện thoại" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tỉnh / Thành phố</label>

                <select v-model="selectedProvinceCode" @change="handleProvinceChange">
                  <option value="">-- Chọn tỉnh / thành phố --</option>

                  <option v-for="province in provinces" :key="province.code" :value="province.code">
                    {{ province.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Quận / Huyện</label>

                <select
                  v-model="selectedDistrictCode"
                  :disabled="!selectedProvinceCode"
                  @change="handleDistrictChange"
                >
                  <option value="">-- Chọn quận / huyện --</option>
                  <option v-for="district in districts" :key="district.code" :value="district.code">
                    {{ district.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Phường / Xã</label>

              <select
                v-model="selectedWardCode"
                :disabled="!selectedDistrictCode"
                @change="handleWardChange"
              >
                <option value="">-- Chọn phường / xã --</option>
                <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                  {{ ward.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Địa chỉ cụ thể</label>

              <textarea
                v-model="form.detail"
                rows="3"
                placeholder="Số nhà, tên đường..."
              ></textarea>
            </div>

            <label class="default-checkbox">
              <input v-model="form.isDefault" type="checkbox" />

              <span> Đặt làm địa chỉ mặc định </span>
            </label>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeAddressForm">Hủy</button>

              <button type="button" class="btn-save" @click="saveAddress">
                {{ editingAddressId ? 'Cập nhật' : 'Lưu địa chỉ' }}
              </button>
            </div>
          </div>
          <div
            v-for="address in addresses"
            :key="address._id"
            class="address-item"
            :class="{
              selected: selectedAddressId === address._id,
            }"
            @click="selectAddress(address)"
          >
            <div class="address-radio">
              <input
                v-model="selectedAddressId"
                type="radio"
                name="shipping-address"
                :value="address._id"
              />
            </div>
            <div class="address-content">
              <div class="address-header">
                <strong>
                  {{ address.displayName }}
                </strong>

                <span v-if="address.isDefault" class="default-badge"> Mặc định </span>
              </div>

              <div class="address-phone">
                {{ address.phone }}
              </div>
              <div class="address-detail">
                {{ address.detail }}, {{ address.ward }}, {{ address.district }},
                {{ address.province }}
              </div>
            </div>

            <div class="address-actions">
              <button type="button" class="edit-address" @click.stop="openEditAddress(address)">
                Sửa
              </button>

              <button v-if="!address.isDefault" type="button" @click.stop="removeAddress(address)">
                Xóa
              </button>
            </div>
          </div>

          <div v-if="!addresses.length && !showAddressForm" class="empty-address">
            <p>Bạn chưa có địa chỉ nhận hàng.</p>
          </div>
        </section>
      </div>
      <div class="container-rigth">
        <div class="order">
          <h5>Đơn hàng</h5>
        </div>

        <div class="price-reduce">
          <div class="total-price">
            <span> Đơn hàng </span>

            <span>
              {{ formatCurrency(totalOriginalPrice) }}
            </span>
          </div>

          <div class="total-reduce">
            <span> Giảm </span>

            <span> -{{ formatCurrency(totalDiscount) }} </span>
          </div>
          <div class="shipping-fee">
            <span>Phí vận chuyển</span>

            <span v-if="isFreeShipping"> Miễn phí </span>

            <span v-else>
              {{ formatCurrency(shippingFee) }}
            </span>
          </div>
        </div>

        <div class="price-action">
          <div class="tentatively">
            <span>Tổng thanh toán</span>

            <span>
              {{ formatCurrency(finalTotal) }}
            </span>
          </div>

          <div class="router-box">
            <button v-if="canCheckout" type="button" @click="handleCreateOrder">
              Hoàn tất đặt hàng
            </button>

            <button v-else disabled class="disabled">Chọn địa chỉ nhận hàng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../../assets/css/shipping-infomation.css';
</style>
