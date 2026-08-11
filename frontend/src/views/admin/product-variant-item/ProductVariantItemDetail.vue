<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductVariItem } from '@/stores/product-variant-item';
import { useProductVariant } from '@/stores/product-variant';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { ROUTE_NAMES } from '@/constants/routes'
import { useDelete } from '@/composables/useDelete';
import { useToastStore } from '@/stores/toast'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue';
import DetailActions from '@/components/admin/detail/DetailActions.vue';
import DetailStats from '@/components/admin/detail/DetailStats.vue';
import DetailStatus from '@/components/admin/detail/DetailStatus.vue';
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';


const productVariantStore = useProductVariant()
const productVariantItemStore = useProductVariItem()
const toastStore = useToastStore()
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const { loading, error } = storeToRefs(productVariantItemStore)
const { productVariantOptions } = storeToRefs(productVariantStore)

const route = useRoute()
const router = useRouter()
const productVariantItem = ref({
    _id: '',
    variant: '',
    size: '',
    sku: '',
    stock: '',
    status: '',
    createdAt: ''
})

onMounted(async () => {
    try {
        const sku = route.params.sku

        const data = await productVariantItemStore.getBySku(sku)
        await productVariantStore.fetchOptions()
        Object.assign(productVariantItem.value, data)
    } catch (error) {
        toastStore.showToast(error.general, 'error')
        router.replace({ name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS })
    }
})
const errors = computed(() => error.value.errors)

const cancelDelete = () => {
    closeDelete()
    toastStore.showToast('Đã hủy thay đổi', 'warning')
}
const confirmDelete = async () => {
    if (!deleteItem.value) return

    const res = await productVariantItemStore.delete(deleteItem.value._id)

    if (res?.code === 200) {
        productVariantItemStore.clearError()
        toastStore.showToast(res.message, 'success')

        setTimeout(() => {
            router.back()
        }, 500)
    } else {
        const message =
            Object.values(productVariantStore.error.errors)[0] ||
            productVariantStore.error.general ||
            'Xóa SKU sản phẩm thất bại!'

        toastStore.showToast(message, 'error')
    }
    closeDelete()
}
const cancelEdit = () => {
    toastStore.showToast('Đã hủy thay đổi', 'warning')

    setTimeout(() => {
        router.back()
    }, 300)
}

const save = async () => {
    const res = await productVariantItemStore.update(productVariantItem.value._id, productVariantItem.value)
    if (res?.code === 200) {
        productVariantItemStore.clearError()
        toastStore.showToast(res.message, 'success')
        setTimeout(() => {
            router.back()
        }, 500)
    } else {
        const message =
            Object.values(productVariantItemStore.error.errors)[0] ||
            productVariantItemStore.error.general ||
            'Lỗi, không thể câp nhật dữ liệu biến thể sản phẩm!!!'

        toastStore.showToast(message, 'error')
    }
}

const groupedVariants = computed(() => {
    const groups = {}
    for (const item of productVariantOptions.value) {
        const productId = item.product._id
        if (!groups[productId]) {
            groups[productId] = {
                productName: item.product.name,
                variants: [],
            }
        }
        groups[productId].variants.push(item)
    }
    return Object.values(groups)
})
</script>
<template>
    <div v-if="!loading" class="container-detail">
        <HeaderDetail title-go-back="Chi tiết SKU sản phẩm" title-delete="Xóa SKU"
            @delete="openDelete(productVariantItem)" />

        <div class="detail-grid">
            <DetailLayout title="Thông tin cơ bản của SKU">
                <div class="top-info">
                    <div class="form">

                        <label for="productVariant">
                            Mã biến thể sản phẩm
                        </label>

                        <div class="select-box">
                            <select id="productVariant" name="productVariant" v-model="productVariantItem.variant">
                                <optgroup v-for="group in groupedVariants" :key="group.productName"
                                    :label="group.productName">
                                    <option v-for="item in group.variants" :key="item._id" :value="item._id">
                                        {{ item.colorName }} - {{ item._id }}
                                    </option>
                                </optgroup>
                            </select>

                            <i class="fa-solid fa-chevron-down"></i>
                        </div>
                        <div>
                            <label for="sku">SKU</label>
                            <input type="text" id="sku" readonly v-model="productVariantItem.sku">
                        </div>
                        <div class="size-stock-box">
                            <div>
                                <label for="size">Size</label>
                                <input type="text" id="size" v-model="productVariantItem.size">
                            </div>
                            <div>
                                <label for="stock">Số lượng</label>
                                <input type="number" id="stock" min="0" max="9999" v-model="productVariantItem.stock">
                            </div>
                        </div>
                    </div>

                </div>
            </DetailLayout>
            <div class="row info-card-2">
                <DetailStats count-label="Số lượng của size:" :count="productVariantItem.stock"
                    :created-at="productVariantItem.createdAt" icon-type="fa" icon="fa-solid fa-diagram-project" />
                <DetailLayout title="Trạng thái của SKU" icon-type="fa" icon="fa-solid fa-check-double"
                    size-title="20px">
                    <div class="select-box">
                        <label for="status">Trạng thái của SKU</label>
                        <div class="select-box">
                            <select id="status" v-model="productVariantItem.status">
                                <option value="active">Đang bán</option>
                                <option value="inactive">Ẩn</option>

                            </select>
                            <i class="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                </DetailLayout>
            </div>
        </div>
        <DetailActions @cancel="cancelEdit" @save="save" />
    </div>
    <ConfirmDialog title="Xóa SKU" message="Bạn có chắc muốn xóa SKU này?" :show="showConfirm" @confirm="confirmDelete"
        @cancel="cancelDelete" :name="deleteItem?.sku" />
</template>

<style scoped>
@import '../../../assets/css/detail-form.css';
@import '../../../assets/css/swtich.css';

.select-box label {
    color: var(--color-4);
    font-weight: 500;
    margin: 0 0 6px 0;
}
</style>