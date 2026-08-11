<script setup>
import AuthFormLayout from '@/components/auth/AuthFormLayout.vue'
import { ROUTE_NAMES } from '@/constants/routes';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const { error, loading } = storeToRefs(authStore)

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

const register = async () => {
    const res = await authStore.register(authUser.value)
    if(res?.code === 200) {
        toastStore.showToast(res.message)
         router.push({ name: ROUTE_NAMES.LOGIN })
    }
}
</script>

<template>
    <AuthFormLayout title="Đăng ký">

        <form class="login-form" @submit.prevent="authUser">
            <h4 class="p-0 m-0">Đăng ký</h4>

            <div class="phone">
                <input type="tel" placeholder="Số điện thoại" id="phone" v-model="authUser.phone" />
            </div>

            <div class="password">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" id="password" v-model="authUser.password" />
                <i class="fa-regular" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                    @click="handleTogglePassword"></i>
            </div>

            <div class="confirm-password">
                <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Xác nhận mật khẩu"
                    id="confirm-password" v-model="authUser.confirmPassword" />
                <i class="fa-regular" :class="showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'"
                    @click="handleToggleConfirmPassword"></i>

            </div>


            <button type="submit" :class="{ 'is-disabled': !canSubmit }" :disabled="!canSubmit">
                Đăng ký
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
                <p class="p-0 m-0">Bạn đã có tài khoản?<RouterLink :to="{ name: ROUTE_NAMES.LOGIN }"> Đăng nhập
                    </RouterLink>
                </p>

            </div>
        </form>

    </AuthFormLayout>
</template>
<style scoped>
@import '../../assets/css/auth.css';

.login-form {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 30px;
    gap: 20px;
    width: 70%;
}

.register-agreement a,
.login a {
    color: var(--color-23);
}

.register-agreement {
    color: black;
    font-size: 14px;
}

.login {
    text-align: center;
}
</style>