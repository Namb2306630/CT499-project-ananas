<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductVariant } from '@/stores/product-variant'
import AppLoading from '@/components/common/LoadingState.vue'
import { formatPrice } from '@/utils/formatCurrency'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const SizeChart = '/banners/Ananas_SizeChart.jpg'
const BASE_URL = import.meta.env.VITE_BACKEND
const pageLoading = ref(false)
const route = useRoute()
const productVariantStore = useProductVariant()
const showQuantityDropdown = ref(false)
const { productVariant, loading, error } = storeToRefs(productVariantStore)
const { carts, error: errorCart, loading: loadingCart } = storeToRefs(cartStore)
const selectedSize = ref('')
const showSizeDropdown = ref(false)
const quantity = ref(1)
const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const errorPayment = ref('')
const showInformationProduct = ref(false)
const showWarranty = ref(false)
const showConvert = ref(false)

onMounted(async () => {
  pageLoading.value = true
  try {
    await productVariantStore.getDetailForUser(route.params.id)
  } finally {
    pageLoading.value = false
  }
})

const selectedItem = computed(() => {
  return productVariant.value?.items?.find((item) => item.size === selectedSize.value)
})

const selectedStock = computed(() => {
  return selectedItem.value?.stock ?? 0
})

const selectQuantity = (value) => {
  quantity.value = value
  showQuantityDropdown.value = false
}

const getSizeItem = (size) => {
  return productVariant.value?.items?.find((item) => item.size === size)
}
const selectSize = (size) => {
  selectedSize.value = size
  showSizeDropdown.value = false
  quantity.value = 1
}

const addToCart = async () => {
  if (selectedSize.value === '') {
    errorPayment.value = 'Vui lòng chọn Size/Số lượng phù hợp'
    return
  }

  if (quantity.value > selectedStock.value) {
    errorPayment.value = 'Vui lòng chọn Size/Số lượng phù hợp'
    return
  }

  errorPayment.value = ''

  const data = await cartStore.create({
    variantId: productVariant.value._id,
    size: selectedSize.value,
    quantity: quantity.value,
  })

  if (data) {
    alert('Thêm sản phẩm vào giỏ hàng thành công')
  }
}

const handleInfor = () => {
  showInformationProduct.value = !showInformationProduct.value
}

const handleWarranty = () => {
  showWarranty.value = !showWarranty.value
}

const handleConvert = () => {
  showConvert.value = !showConvert.value
}

// ảnh
const selectedImage = ref('')
const thumbnailStart = ref(0)

const productImages = computed(() => {
  if (!productVariant.value) return []

  return [productVariant.value.mainImage, ...(productVariant.value.images || [])].filter(Boolean)
})

const visibleImages = computed(() => {
  return productImages.value.slice(thumbnailStart.value, thumbnailStart.value + 4)
})

const selectImage = (image) => {
  selectedImage.value = image
}

const nextImages = () => {
  if (thumbnailStart.value + 4 < productImages.value.length) {
    thumbnailStart.value++
  }
}

const prevImages = () => {
  if (thumbnailStart.value > 0) {
    thumbnailStart.value--
  }
}

const currentImage = computed(() => {
  return selectedImage.value || productImages.value[0] || ''
})

//hear
const hear = ref(false)
const handleHear = () => {
  hear.value = !hear.value
  if (hear.value) {
    alert('Yêu thích')
  } else {
    alert('Bỏ yêu thích')
  }
}
</script>

<template>
  <div class="product-box">
    <AppLoading
      v-if="pageLoading"
      :loading="pageLoading"
      :error="error.general"
      :has-sidebar="false"
    />

    <div v-else-if="productVariant?.product" class="product-title">
      <span class="product-type">
        {{ productVariant.product?.productType.name }}
      </span>
      <span class="product-line">
        {{ productVariant.product?.productLine.name }}
      </span>
      <span class="product-name">
        {{ productVariant.product?.name }}
      </span>
    </div>
    <div class="product-main row mt-4">
      <div class="product-img col-md-6">
        <!-- ẢNH CHÍNH -->
        <div class="image-main">
          <img :src="`${BASE_URL}/${currentImage}`" alt="Ảnh sản phẩm" />
        </div>
        <div class="thumbnail-wrapper">
          <!-- NÚT TRÁI -->
          <button class="thumbnail-arrow" :disabled="thumbnailStart === 0" @click="prevImages">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <!-- 4 ẢNH -->
          <div class="thumbnail-list">
            <div
              v-for="image in visibleImages"
              :key="image"
              class="thumbnail"
              :class="{ active: currentImage === image }"
              @click="selectImage(image)"
            >
              <img :src="`${BASE_URL}/${image}`" alt="Ảnh sản phẩm" />
            </div>
          </div>
          <!-- NÚT PHẢI -->
          <button
            class="thumbnail-arrow"
            :disabled="thumbnailStart + 4 >= productImages.length"
            @click="nextImages"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div class="product-content col-md-6">
        <div class="content-main">
          <h2>{{ productVariant.product?.name }} - {{ productVariant.colorName }}</h2>
          <div class="product-id">
            <span
              >Mã sản phẩm: <strong>{{ productVariant._id }}</strong></span
            >
            <div
              v-if="
                productVariant.product?.isSale ||
                productVariant.product?.isBestSeller ||
                productVariant.product?.isNewArrival
              "
              class="product-badge"
            >
              <p class="situation m-0">Tình trạng:</p>
              <span v-if="productVariant.product?.isSale">Sale</span>
              <span v-if="productVariant.product?.isBestSeller">Best Seller</span>
              <span v-if="productVariant.product?.isNewArrival">New Arrival</span>
            </div>
          </div>
          <div class="price">
            <span class="selling-price">
              {{ formatPrice(productVariant.product?.sellingPrice) }}
            </span>
            <span v-if="productVariant.product?.discountPercent > 0" class="original-price">
              {{ formatPrice(productVariant.product?.originalPrice) }}
            </span>
          </div>
          <div v-if="productVariant.product?.description?.length > 0" class="description">
            <p>{{ productVariant.product?.description }}</p>
          </div>
          <div class="color-box">
            <div class="color" :style="{ backgroundColor: productVariant.colorCode }"></div>
          </div>
          <div class="product-actions">
            <div class="product-options row">
              <!-- SIZE -->
              <div class="product-option col-md-6">
                <span class="option-label">SIZE</span>

                <div class="size-select">
                  <div class="size-select-display" @click="showSizeDropdown = !showSizeDropdown">
                    <span>{{ selectedSize || '' }}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <div v-if="showSizeDropdown" class="size-dropdown">
                    <button
                      v-for="size in sizes"
                      :key="size"
                      type="button"
                      class="size-item"
                      :class="{
                        selected: selectedSize === size,
                        disabled: !getSizeItem(size),
                      }"
                      :disabled="!getSizeItem(size)"
                      @click="selectSize(size)"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- SỐ LƯỢNG -->
              <div class="product-option col-md-6">
                <span class="option-label">SỐ LƯỢNG</span>

                <div class="quantity-select">
                  <div
                    class="quantity-select-display"
                    :class="{ disabled: !selectedSize }"
                    @click="selectedSize && (showQuantityDropdown = !showQuantityDropdown)"
                  >
                    <span>{{ selectedSize ? quantity : '' }}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>

                  <div v-if="showQuantityDropdown" class="quantity-dropdown">
                    <button
                      v-for="i in selectedStock"
                      :key="i"
                      type="button"
                      class="quantity-item"
                      :class="{ selected: quantity === i }"
                      @click="selectQuantity(i)"
                    >
                      {{ i }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- NÚT NHẤN -->
            <div class="product-buttons">
              <button class="add-to-cart" @click="addToCart">THÊM VÀO GIỎ HÀNG</button>

              <button class="add-to-wishlist" @click="handleHear">
                <i class="fa-heart" :class="hear ? 'fa-solid' : 'fa-regular'"></i>
              </button>
            </div>

            <!-- THANH TOÁN -->
            <button class="checkout-button" @click="addToCart">THANH TOÁN</button>
            <!-- lỗi chưa chọn size/stock -->
            <p v-if="errorPayment !== ''" class="error error-payment">{{ errorPayment }}</p>
          </div>
          <div class="informationn-box">
            <div
              class="information-product"
              :class="{ information: showInformationProduct }"
              @click="handleInfor"
            >
              <h5>Thông tin sản phẩm</h5>
              <i
                class="fa-solid"
                :class="showInformationProduct ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </div>

            <Transition name="slide">
              <div v-if="showInformationProduct" class="information-content">
                <img :src="SizeChart" alt="Bản size giày" />
              </div>
            </Transition>

            <div class="convert-product" :class="{ convert: showConvert }" @click="handleConvert">
              <h5>QUY ĐỊNH ĐỔI SẢN phẩm</h5>
              <i class="fa-solid" :class="showConvert ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <Transition name="slide">
              <div v-if="showConvert" class="information-content">
                <ul>
                  <li>Chỉ đổi hàng 1 lần duy nhất, mong bạn cân nhắc kỹ trước khi quyết định.</li>

                  <li>
                    Thời hạn đổi sản phẩm khi mua trực tiếp tại cửa hàng là
                    <strong>07 ngày</strong>, kể từ ngày mua.
                  </li>

                  <li>
                    Đổi sản phẩm khi mua online là <strong>14 ngày</strong>, kể từ ngày nhận hàng.
                  </li>

                  <li>Sản phẩm đổi phải kèm hóa đơn.</li>

                  <li>Bắt buộc phải còn nguyên tem, hộp, nhãn mác.</li>

                  <li>
                    Sản phẩm đổi không có dấu hiệu đã qua sử dụng, không giặt tẩy, bám bẩn hoặc biến
                    dạng.
                  </li>

                  <li>Ananas chỉ ưu tiên hỗ trợ đổi size.</li>

                  <li>
                    Trong trường hợp sản phẩm hết size cần đổi, bạn có thể đổi sang 01 sản phẩm
                    khác:
                    <ul>
                      <li>
                        Nếu sản phẩm muốn đổi ngang giá trị hoặc có giá trị cao hơn, bạn cần bù
                        khoảng chênh lệch tại thời điểm đổi (nếu có).
                      </li>
                      <li>
                        Nếu sản phẩm muốn đổi có giá trị thấp hơn, chúng tôi sẽ không hoàn lại tiền.
                      </li>
                    </ul>
                  </li>

                  <li>
                    Trong trường hợp sản phẩm/size bạn muốn đổi không còn hàng trong hệ thống, vui
                    lòng chọn sản phẩm khác.
                  </li>

                  <li>
                    Không hoàn trả bằng tiền mặt dù bất cứ trong trường hợp nào. Mong bạn thông cảm.
                  </li>

                  <li>
                    Không áp dụng chính sách đổi hàng với các sản phẩm đang áp dụng chương trình
                    <strong>Sale Off từ 40% trở lên</strong>.
                  </li>
                </ul>
              </div>
            </Transition>

            <div
              class="warranty-product"
              :class="{ warranty: showWarranty }"
              @click="handleWarranty"
            >
              <h5>bảo hành thế nào?</h5>
              <i class="fa-solid" :class="showWarranty ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </div>
            <Transition name="slide">
              <div v-if="showWarranty" class="information-content">
                <p class="m-0">
                  Mỗi đôi giày Ananas trước khi xuất xưởng đều trải qua nhiều khâu kiểm tra. Tuy
                  vậy, trong quá trình sử dụng, nếu nhận thấy các lỗi: gãy đế, hở đế, đứt chỉ
                  may,...trong thời gian 6 tháng từ ngày mua hàng, mong bạn sớm gửi sản phẩm về
                  Ananas nhằm giúp chúng tôi có cơ hội phục vụ bạn tốt hơn. Vui lòng gửi sản phẩm về
                  bất kỳ cửa hàng Ananas nào, hoặc gửi đến trung tâm bảo hành Ananas ngay trong
                  trung tâm TP.HCM trong giờ hành chính:
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-box {
  min-height: var(--min-height);
}
.error {
  padding-top: 5px;
}

.error-general {
  padding: 10px;
  background-color: var(--color-21);
  margin: 10px 0 0 0;
  border-radius: 5px;
}

.error-payment {
  margin: 0;
  font-size: 16px;
  padding: 30px 0 0 0;
}

.product-title {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 3px solid black;
}

.product-title span {
  position: relative;
  font-size: 18px;
  color: var(--text-grey);
}
.product-type {
  padding: 5px 12px 5px 0;
}

.product-line,
.product-name {
  padding: 5px 12px;
}
.product-title span:not(.product-name)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background-color: var(--color-7);
}
.product-name {
  font-weight: bold;
}

.product-img img {
  width: 100%;
}

.content-main h2 {
  font-weight: bold;
}
.content-main span:not(.selling-price):not(.original-price):not(.product-option span) {
  font-size: 18px;
}

.product-id {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}
.product-badge {
  text-align: center;
  color: var(--color-23);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 18px;
}

.product-badge span:not(:last-child)::after {
  content: ' -';
}

.situation {
  color: var(--text-grey);
}
.description {
  font-size: 18px;
  padding: 20px 0;
  color: var(--text-grey);
  border-top: 2px dashed var(--color-7);
  /* border-bottom: 2px dashed var(--color-7); */
}

.price {
  display: flex;
  flex-direction: row;
  gap: 50px;
  margin: 30px 0;
  justify-content: start;
  align-items: center;
}

.selling-price {
  font-size: 30px;
  font-weight: bold;
  color: var(--color-23);
}
.original-price {
  font-weight: bold;
  text-decoration: line-through;
  font-size: 20px;
  color: var(--text-gray-3);
}
.color-box {
  padding: 30px 0;
  border-bottom: 2px dashed var(--color-7);
  border-top: 2px dashed var(--color-7);
}
.color {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
}

.product-options {
  color: black;
  font-weight: bold;
  font-size: 25px;
  padding: 20px 0;
}

.product-option {
  position: relative;
}

.option-label {
  display: block;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 12px;
}

/* SIZE */
.size-select {
  position: relative;
  width: 100%;
}

.size-select-display {
  height: 43px;
  border: 1px solid var(--text-gray-3);
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  cursor: pointer;
  background: white;
}

.size-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  padding: 6px;
  background: white;
  border: 1px solid var(--border-gray-2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.size-item {
  height: 60px;
  border: 1px solid #999;
  background: white;
  font-size: 18px;
  cursor: pointer;
}

.size-item:hover:not(:disabled) {
  background: var(--color-25);
}

.size-item.selected {
  border: 2px solid black;
  font-weight: bold;
}

/* Size không có trong DB */
.size-item.disabled {
  color: var(--text-gray-3);
  background: #fafafa;
  cursor: not-allowed;
}

/* SỐ LƯỢNG */
.quantity-select {
  position: relative;
  width: 100%;
}

.quantity-select-display {
  height: 43px;
  border: 1px solid var(--text-gray-3);
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  background: white;
  cursor: pointer;
}

.quantity-select-display.disabled {
  background: var(--color-25);
  color: var(--text-gray-3);
  cursor: not-allowed;
}

.quantity-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  background: white;
  border: 1px solid var(--text-gray-3);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
}

.quantity-item {
  height: 60px;
  border: 1px solid #999;
  background: white;
  font-size: 18px;
  cursor: pointer;
}

.quantity-item:hover {
  background: var(--color-25);
}

.quantity-item.selected {
  border: 2px solid black;
  font-weight: bold;
}

.product-buttons {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.add-to-cart {
  flex: 1;
  height: 70px;
  border: 1px solid #000;
  background: #000;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.add-to-wishlist {
  width: 100px;
  height: 70px;
  background: #000;
  color: var(--color-23);
  font-size: 30px;
  cursor: pointer;
  border: none;
}

.add-to-cart:hover,
.add-to-wishlist:hover {
  opacity: 0.8;
}

.checkout-button {
  width: 100%;
  height: 70px;
  background: var(--color-23);
  color: white;
  font-size: 22px;

  font-weight: bold;
  cursor: pointer;
  border: none;
  margin: 30px 0 0 0;
}

.informationn-box div {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border-bottom: 2px dashed var(--color-7);
  margin: 0 0 30px 0;
  padding: 0 0 30px 0;
}

.informationn-box h5 {
  font-weight: bold;
  color: #000;
  text-transform: uppercase;
}

.informationn-box {
  margin: 30px 0;
}

.information h5,
.information i,
.warranty h5,
.warranty i,
.convert h5,
.convert i {
  color: var(--color-23);
}
.information-product:hover h5,
.convert-product:hover h5,
.warranty-product:hover h5 {
  color: var(--color-23);
  cursor: pointer;
}
.information-product:hover i,
.convert-product:hover i,
.warranty-product:hover i {
  color: var(--color-23);
  cursor: pointer;
}

/* Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 1s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

.information-content {
  overflow: hidden;
}

.information-content img {
  width: 100%;
  display: block;
}
.product-img {
  min-width: 0;
}

.image-main {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.image-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* THUMBNAIL */

.thumbnail-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.thumbnail-list {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.thumbnail {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail:hover {
  border-color: var(--text-gray-3);
}

.thumbnail.active {
  border-color: #000;
}

/* NÚT TRÁI PHẢI */

.thumbnail-arrow {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-arrow:hover:not(:disabled) {
  background: #f5f5f5;
}

.thumbnail-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
