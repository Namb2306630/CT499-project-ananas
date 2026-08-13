<script setup>
import AuthFormLayout from '@/components/auth/AuthFormLayout.vue'
import { ROUTE_NAMES } from '@/constants/routes';
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { error, loading } = storeToRefs(authStore)
onMounted(() => {
    authStore.clearError()
})

onUnmounted(() => {
    authStore.clearError()
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const handleTogglePassword = () => {
    showPassword.value = !showPassword.value
}
const handleToggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value
}

const authUser = ref({
    phone: '',
    password: '',
    confirmPassword: '',
})
const canSubmit = computed(() => {
    return (
        authUser.value.phone.trim() !== '' &&
        authUser.value.password.trim() !== '' &&
        authUser.value.confirmPassword.trim() !== ''
    )
})
const register = async () => {
    authStore.clearError()
    const res = await authStore.register(authUser.value)

    if (res?.code === 200) {
        authStore.clearError()
        toastStore.showToast(res.message)
        router.push({ name: ROUTE_NAMES.LOGIN })
    } else {
        const message = Object.values(authStore.error.errors)[0] || authStore.error.general || "Lỗi tạo tài khoản!!!"
        toastStore.showToast(message, 'error')
    }
}
</script>

<template>
    <AuthFormLayout title="Đăng ký">

        <form class="register-form" @submit.prevent="register">
            <h4 class="p-0 m-0">Đăng ký</h4>

            <div class="phone">
                <input type="tel" placeholder="Số điện thoại" id="phone" v-model="authUser.phone" />
            </div>
            <p v-if="error.errors.phone" class="m-0 error">{{ error.errors.phone }}</p>

            <div class="password">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" id="password"
                    v-model="authUser.password" />
                <i class="fa-regular" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                    @click="handleTogglePassword"></i>
            </div>
            <p v-if="error.errors.password" class="m-0 error">{{ error.errors.password }}</p>

            <div class="confirm-password">
                <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Xác nhận mật khẩu"
                    id="confirm-password" v-model="authUser.confirmPassword" />
                <i class="fa-regular" :class="showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'"
                    @click="handleToggleConfirmPassword"></i>
            </div>
            <p v-if="error.errors.confirmPassword" class="m-0 error">{{ error.errors.confirmPassword }}</p>

            <p v-if="error.general" class="error error-general">{{ error.general }}</p>
            <button type="submit" :class="{ 'is-disabled': !canSubmit || loading }" :disabled="!canSubmit || loading">
                <span v-if="loading" class="loading"></span>
                <span v-else>Đăng ký</span>
            </button>

            <div class="register-agreement">
                <p class="p-0 m-0">Bằng việc đăng ký, bạn đã đồng ý với Ananas về <RouterLink>
                        Điều khoảng dịch vụ
                    </RouterLink> & <RouterLink>Chính sách bảo mật</RouterLink>
                </p>
            </div>
            <div class="or-divider">
                <span>HOẶC</span>
            </div>
            <div class="auth-2">
                <div class="google">
                    <i class="fa-brands fa-google"></i> Google
                </div>
            </div>

            <div class="login">
                <p class="p-0 m-0">Bạn đã có tài khoản?<RouterLink :to="{ name: ROUTE_NAMES.LOGIN }"
                        @click="authStore.clearError()"> Đăng nhập
                    </RouterLink>
                </p>

            </div>
        </form>

    </AuthFormLayout>
</template>
<style scoped>
@import '../../assets/css/auth.css';
</style>