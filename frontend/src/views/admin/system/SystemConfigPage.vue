<script setup>
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import DetailActions from '@/components/admin/detail/DetailActions.vue'
import { useToastStore } from '@/stores/toast'
import { useSystemConfigStore } from '@/stores/system-config'
import { ref, onMounted, computed, toRaw } from 'vue'
import { storeToRefs } from 'pinia'

const toastStore = useToastStore()
const systemConfigStore = useSystemConfigStore()
const { error } = storeToRefs(systemConfigStore)
const originalForm = ref(null)
const errors = computed(() => error.value.errors)

const form = ref({
  taxCode: '',
  email: '',
  hotline: '',
  // vatPercent: 0,
  vatRate: 0,
  // personalIncomeTaxRate: 0,
  operatingCostPercent: 0,
  profitPercent: 0,
  freeShippingThreshold: 0,
  currency: 'VND',
  taxDisplayStrategy: 'included',
})

onMounted(async () => {
  await systemConfigStore.get()

  if (systemConfigStore.systemConfig) {
    //toRaw() lấy ra object gốc vì systemConfigStore.systemConfig kiểu ref là kiểu phản ứng Proxy(Object)
    //JSON.stringify Chuyển object thành chuỗi JSON.
    //JSON.parse JSON.stringify
    const data = JSON.parse(JSON.stringify(toRaw(systemConfigStore.systemConfig)))

    Object.assign(form.value, data)
    originalForm.value = data
  }
})

const saveSystemConfig = async () => {
  const res = await systemConfigStore.update(form.value)
  if (res?.code === 200) {
    originalForm.value = JSON.parse(JSON.stringify(toRaw(form.value)))

    toastStore.showToast(res.message, 'success')
  } else {
    const message =
      Object.values(systemConfigStore.error.errors)[0] ||
      systemConfigStore.error.general ||
      'Lỗi cập nhật dữ liệu cho cấu hình hệ thống!!!'

    toastStore.showToast(message, 'error')
  }
}

const cancel = () => {
  Object.assign(form.value, originalForm.value)
  systemConfigStore.clearError()
  toastStore.showToast('Đã hủy thay đổi', 'error')
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Cài Đặt Hệ Thống"
      description="Cấu hình hành vi cốt lõi của hệ thống, quy tắc tính thuế và các tùy chọn khác."
      :show-button="false"
      :show-search="false"
      :show-filter="false"
      :show-sort="false"
    />

    <form class="system-config-form">
      <!-- EMAIL/hotline -->
      <section class="config-section">
        <div class="config-header">
          <span class="material-symbols-outlined"> discover_tune </span>

          <h5>Cấu hình Chung</h5>
        </div>

        <div class="config-body">
          <div class="form-grid finance">
            <div class="form-group">
              <label for="email"> ĐỊA CHỈ EMAIL </label>
              <input id="email" type="email" v-model="form.email" />
              <p v-if="errors.email" class="error">{{ errors.email }}</p>
            </div>

            <div class="form-group">
              <label for="hotline"> HOTLINE </label>

              <input id="hotline" type="text" v-model="form.hotline" />
              <p v-if="errors.hotline" class="error">{{ errors.hotline }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ---------------- Thuế --------------- -->

      <section class="config-section">
        <div class="config-header">
          <span class="material-symbols-outlined"> heap_snapshot_large </span>

          <h5>Cấu hình Thuế (VAT)</h5>
        </div>

        <div class="config-body">
          <div class="form-grid">
            <div class="form-group">
              <label for="taxCode"> MÃ SỐ THUẾ </label>

              <input id="taxCode" type="text" v-model="form.taxCode" />
              <p v-if="errors.taxCode" class="error">{{ errors.taxCode }}</p>
            </div>

            <div class="form-group">
              <label for="vatPercent"> THUẾ VAT (%) </label>

              <div class="input-icon">
                <input id="vatPercent" type="number" v-model="form.vatRate" />

                <span class="suffix">%</span>
              </div>
              <p v-if="errors.vatPercent" class="error">{{ errors.vatRate }}</p>
            </div>
          </div>

          <div class="info-box">
            <p>Chi tiết phân bổ thuế:</p>

            <ul>
              <li>
                Tỷ lệ tính thuế GTGT: <strong>{{ form.vatRate }}%</strong>
              </li>
            </ul>

            <p>
              Quy tắc thuế được áp dụng trong quá trình thanh toán dựa trên địa chỉ giao hàng và quy
              định pháp luật hiện hành.
            </p>
          </div>
        </div>
      </section>

      <!-- ------------------ Tài chính ------------------ -->

      <section class="config-section">
        <div class="config-header">
          <span class="material-symbols-outlined"> account_balance_wallet </span>

          <h5>Cấu hình Tài Chính</h5>
        </div>

        <div class="config-body">
          <div class="form-grid finance">
            <div class="form-group">
              <label for="operatingCost"> CHI PHÍ VẬN HÀNH (%) </label>
              <div class="input-icon">
                <input
                  id="operatingCost"
                  type="number"
                  min="0"
                  max="100"
                  v-model="form.operatingCostPercent"
                />
                <span class="suffix">%</span>
              </div>
              <p v-if="errors.operatingCostPercent" class="error">
                {{ errors.operatingCostPercent }}
              </p>
            </div>

            <div class="form-group">
              <label for="profit"> LỢI NHUẬN MONG MUỐN (%) </label>
              <div class="input-icon">
                <input id="profit" type="number" min="0" max="100" v-model="form.profitPercent" />
                <span class="suffix">%</span>
              </div>
              <p v-if="errors.profitPercent" class="error">
                {{ errors.profitPercent }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ------------------ Vận chuyển ------------------ -->

      <section class="config-section">
        <div class="config-header">
          <span class="material-symbols-outlined"> delivery_truck_speed </span>

          <h5>Cấu hình Vận Chuyển</h5>
        </div>

        <div class="config-body">
          <div class="form-group">
            <label for="freeShipping"> MIỄN PHÍ VẬN CHUYỂN TỪ (VNĐ) </label>

            <div class="input-icon">
              <input id="freeShipping" type="number" min="0" v-model="form.freeShippingThreshold" />
              <span class="suffix">{{ form.currency }}</span>
            </div>
            <p v-if="errors.freeShippingThreshold" class="error">
              {{ errors.freeShippingThreshold }}
            </p>

            <small> Áp dụng cho các đơn hàng có giá trị thanh toán thực tế đạt ngưỡng này. </small>
          </div>
        </div>
      </section>

      <!-- ------------------ Tiền tệ & Hiển thị ------------------ -->

      <section class="config-section">
        <div class="config-header">
          <span class="material-symbols-outlined"> payments </span>

          <h5>Tiền tệ & Hiển thị</h5>
        </div>

        <div class="config-body">
          <div class="form-group select-box">
            <label for="currency"> TIỀN TỆ CƠ SỞ </label>

            <div class="input-icon">
              <select id="currency" v-model="form.currency">
                <option value="VND">VND - Việt Nam Đồng</option>

                <option value="USD">USD - US Dollar</option>
              </select>
              <i class="fa-solid fa-chevron-down suffix"></i>
            </div>
            <p v-if="errors.currency" class="error">
              {{ errors.currency }}
            </p>
          </div>

          <div class="form-group">
            <label for=""> CHIẾN LƯỢC HIỂN THỊ THUẾ </label>

            <div class="radio-group">
              <label
                class="radio-card"
                :class="{ checked: form.taxDisplayStrategy === 'included' }"
              >
                <input
                  type="radio"
                  value="included"
                  class="radio"
                  v-model="form.taxDisplayStrategy"
                />

                <div class="radio-box">
                  <h6>Bao gồm thuế (Inclusive)</h6>
                  <p>Thuế đã bao gồm trong giá sản phẩm.</p>
                </div>
              </label>

              <label
                class="radio-card"
                :class="{ checked: form.taxDisplayStrategy === 'excluded' }"
              >
                <input
                  type="radio"
                  value="excluded"
                  class="radio"
                  v-model="form.taxDisplayStrategy"
                />

                <div class="radio-box">
                  <h6>Chưa bao gồm thuế (Exclusive)</h6>

                  <p>Thuế được tính riêng khi thanh toán.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>
    </form>
    <DetailActions
      cancel-text="Hủy"
      save-text="Lưu thay đổi"
      @save="saveSystemConfig"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped>
@import '../../../assets/css/detail-form.css';
.system-config-form {
  margin-top: 20px;
  margin-bottom: 40px;
}

.config-section {
  border: 2px solid var(--border-gray-4);
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: var(--shadow-black-3);
}

.config-header {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 15px;
}

.config-header span {
  color: var(--color-9);
}

.info-box p,
.info-box ul {
  margin: 0;
}

.info-box p {
  padding: 10px 0 10px 0;
}

.info-box > p:nth-of-type(2) {
  color: #6c757d;
  font-size: 14px;
  font-style: italic;
  margin-top: 5px;
}
.info-box > p:nth-of-type(1) {
  font-weight: 600;
}
label {
  padding: 0;
  margin: 20px 0 5px 0;
  /* color: var(--color-4); */
}
small {
  padding: 0;
  margin: 10px 0 5px 0;
}

.radio-card {
  display: flex;
  flex-direction: row;
  border: 1px solid var(--border-gray-4);
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  gap: 20px;
  transition: 0.3s ease;
}

.radio-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 50px;
}

.radio-box h6,
.radio-box p {
  margin: 0;
  padding: 0;
}

.radio-box h6 {
  font-weight: 600;
  color: black;
}

.checked {
  border: 1px solid var(--color-9);
  background-color: var(--color-10);
}

.radio-card:not(.checked):hover {
  border: 1px solid var(--color-9);
}

@media (max-width: 980px) {
  .radio-group {
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 20px;
  }
}
</style>
