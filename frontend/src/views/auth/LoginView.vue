<script setup>
import AuthFormLayout from '@/components/auth/AuthFormLayout.vue'
import { ROUTE_NAMES } from '@/constants/routes';
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { error, loading } = storeToRefs(authStore)

const showPassword = ref(false)


const handleTogglePassword = () => {
    showPassword.value = !showPassword.value
}

const authUser = ref({
    phone: '',
    password: '',
})
const canSubmit = computed(() => {
    return (
        authUser.value.phone.trim() !== '' &&
        authUser.value.password.trim() !== ''
    )
})
const login = async () => {
    authStore.clearError()
    const res = await authStore.login(authUser.value)
    if (res?.code === 200) {
        toastStore.showToast(res.message)
        if (res.data?.role === 'admin') {
            router.push({ name: ROUTE_NAMES.ADMIN })
        } else {
            router.push({ name: ROUTE_NAMES.HOME })
        }
    } else {
        const message = Object.values(authStore.error.errors)[0] || authStore.error.general || "Lỗi đăng nhập!!!"
        toastStore.showToast(message, 'error')
    }
}
</script>

<template>
    <AuthFormLayout title="Đăng nhập">

        <form class="login-form" @submit.prevent="login">
            <h4 class="p-0 m-0">Đăng nhập</h4>

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


            <p v-if="error.general" class="error error-general">{{ error.general }}</p>
            <button type="submit" :class="{ 'is-disabled': !canSubmit || loading }" :disabled="!canSubmit || loading">
                <span v-if="loading" class="loading"></span>
                <span v-else>Đăng nhập</span>
            </button>

            <div class="login-agreement">
                <p class="p-0 m-0">Bằng việc đăng nhập, bạn đã đồng ý với Ananas về <RouterLink>
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

            <div class="register">
                <p class="p-0 m-0">Bạn chưa có tài khoản?<RouterLink :to="{ name: ROUTE_NAMES.REGISTER }"> Đăng ký
                    </RouterLink>
                </p>

            </div>
        </form>

    </AuthFormLayout>
</template>
<style scoped>
@import '../../assets/css/auth.css';
</style>