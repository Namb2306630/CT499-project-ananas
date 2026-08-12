<script setup>
//npm i vite-svg-loader dùng ảnh svg như một components
import Shop from '@/assets/images/shop.svg'
import Logo from '@/assets/images/Logo_Ananas_Footer.svg'
import FacebookIcon from '@/assets/icons/icon_facebook.svg'
import InstagramIcon from '@/assets/icons/icon_instagram.svg'
import YoutubeIcon from '@/assets/icons/icon_youtube.svg'
import { ref, onMounted, onUnmounted } from 'vue'
import LogoApp from '../common/LogoApp.vue'

const showGoTop = ref(false)
const handleScroll = () => {
  showGoTop.value = window.scrollY > 200
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll) //trang chuộn là nó kiểm tra vị trí trang liên tục
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <footer class="footer">
    <div class="container-fluid px-0">
      <div class="row justify-content-center">
        <!-- Shop desktop -->
        <div class="col-3 d-none d-lg-block shop-box">
          <Shop class="footer-shop" />
          <router-link to="#" class="text-decoration-none">
            <div class="text-center mt-3 search-shop ml-2 mr-4">
              <p class="py-2">TÌM CỬA HÀNG</p>
            </div>
          </router-link>
        </div>

        <!-- Shop mobile -->
        <div class="col-12 d-lg-none shop-mobile">
          <router-link to="#" class="text-decoration-none">
            <div class="search-shop-mobile text-center">
              <p class="text-center p-0 m-0">TÌM CỬA HÀNG</p>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-lg-9">
          <div class="row">
            <div class="col-12 col-lg-3">
              <!-- SẢN PHẨM -->
              <div class="d-none d-lg-block">
                <h5 class="title">SẢN PHẨM</h5>

                <div class="footer-links">
                  <router-link to="#">Giày Nam</router-link>
                  <router-link to="#">Giày Nữ</router-link>
                  <router-link to="#">Thời trang & Phụ kiện</router-link>
                  <router-link to="#">Sale-off</router-link>
                </div>
              </div>

              <!-- Mobile -->
              <details class="mobile-dropdown d-lg-none">
                <summary class="dropdown">
                  <span class="dropdown-label">SẢN PHẨM</span>
                  <i class="fa-solid fa-angle-down icon-down"></i>
                  <i class="fa-solid fa-angle-up icon-up"></i>
                </summary>

                <div class="footer-links">
                  <router-link to="#">Giày Nam</router-link>
                  <router-link to="#">Giày Nữ</router-link>
                  <router-link to="#">Thời trang & Phụ kiện</router-link>
                  <router-link to="#">Sale-off</router-link>
                </div>
              </details>
            </div>

            <!-- VỀ CÔNG TY -->
            <div class="col-12 col-lg-3">
              <div class="d-none d-lg-block">
                <h5 class="title">VỀ CÔNG TY</h5>

                <div class="footer-links">
                  <router-link to="#">Dứa tuyển dụng</router-link>
                  <router-link to="#">Liên hệ nhượng quyền</router-link>
                  <router-link to="/about">Về Ananas</router-link>
                </div>
              </div>

              <details class="mobile-dropdown d-lg-none">
                <summary class="dropdown">
                  VỀ CÔNG TY
                  <i class="fa-solid fa-angle-down icon-down"></i>
                  <i class="fa-solid fa-angle-up icon-up"></i>
                </summary>

                <div class="footer-links">
                  <router-link to="#">Dứa tuyển dụng</router-link>
                  <router-link to="#">Liên hệ nhượng quyền</router-link>
                  <router-link to="/about">Về Ananas</router-link>
                </div>
              </details>
            </div>

            <!-- HỖ TRỢ -->
            <div class="col-12 col-lg-3">
              <div class="d-none d-lg-block">
                <h5 class="title">HỖ TRỢ</h5>

                <div class="footer-links">
                  <router-link to="#">FAQs</router-link>
                  <router-link to="#">Bảo mật thông tin</router-link>
                  <router-link to="#">Chính sách chung</router-link>
                  <router-link to="#">Tra cứu đơn hàng</router-link>
                </div>
              </div>

              <details class="mobile-dropdown d-lg-none">
                <summary class="dropdown">
                  HỖ TRỢ
                  <i class="fa-solid fa-angle-down icon-down"></i>
                  <i class="fa-solid fa-angle-up icon-up"></i>
                </summary>

                <div class="footer-links">
                  <router-link to="#">FAQs</router-link>
                  <router-link to="#">Bảo mật thông tin</router-link>
                  <router-link to="#">Chính sách chung</router-link>
                  <router-link to="#">Tra cứu đơn hàng</router-link>
                </div>
              </details>
            </div>

            <!-- LIÊN HỆ -->
            <div class="col-12 col-lg-3">
              <div class="d-none d-lg-block">
                <h5 class="title">LIÊN HỆ</h5>

                <div class="footer-links">
                  <router-link to="#">Email góp ý</router-link>
                  <router-link to="#">Hotline</router-link>
                  <router-link to="#">1900 0014</router-link>
                </div>
              </div>

              <details class="mobile-dropdown d-lg-none">
                <summary class="dropdown">
                  LIÊN HỆ
                  <i class="fa-solid fa-angle-down icon-down"></i>
                  <i class="fa-solid fa-angle-up icon-up"></i>
                </summary>

                <div class="footer-links">
                  <router-link to="#">Email góp ý</router-link>
                  <router-link to="#">Hotline</router-link>
                  <router-link to="#">1900 0014</router-link>
                </div>
              </details>
            </div>
            <div class="col-12 mt-4 contact">
              <div class="row">
                <div class="col-lg-3 col-12">
                  <h5 class="title">
                    <p>ANANAS SOCIAL</p>
                  </h5>
                  <div class="social">
                    <router-link to="#">
                      <FacebookIcon class="icon" />
                    </router-link>

                    <router-link to="#">
                      <InstagramIcon class="icon" />
                    </router-link>

                    <router-link to="#">
                      <YoutubeIcon class="icon" />
                    </router-link>
                  </div>
                </div>
                <div class="col-lg-3 col-12 email">
                  <h5 class="title">
                    <p>ĐĂNG KÝ NHẬN MAIL</p>
                  </h5>
                  <div class="email-box">
                    <input type="text" />
                    <div class="icon-arrow">
                      <i class="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-12 footer-logo d-lg-block d-none">
                  <!-- <Logo /> -->
                  <LogoApp color-icon="var(--color-23)" color-text="var(--color-23)" size-text="80px" size="130px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-5">
        <p class="copyright">Copyright &copy; 2026 Ananas. All rights reserved.</p>
      </div>
    </div>
    <div class="go-top" :class="{ active: showGoTop }" @click="scrollTop">
      <i class="fa-solid fa-angle-up go-top-icon"></i>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-footer-color);
  padding-bottom: 5px;
}

.footer .container-fluid {
  max-width: var(--container-width);
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  padding-top: 70px;
}

.row {
  align-items: flex-start;
}

.col-lg-4 {
  padding-left: 0;
}

.footer-shop {
  width: 90%;
  height: auto;
  display: block;
}

.title {
  color: var(--text-white);
  margin-bottom: 16px;
  font-weight: var(--font-width-lg);
}

.footer-links :deep(a) {
  color: var(--text-gray);
  font-size: var(--font-size-md);
  text-decoration: none;
  display: block;
  transition: 0.3s;
  padding-top: 1px;
}

.footer-links :deep(a:hover) {
  color: var(--text-hover);
}

/* Mobile dropdown */
.mobile-dropdown {
  border-bottom: 2px dashed #666;
}

.mobile-dropdown summary {
  color: var(--text-white);
  font-size: var(--font-size-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
  font-weight: var(--font-width-lg);
  padding-bottom: 30px;
  padding-top: 30px;
}

.icon-up {
  display: none;
}

.mobile-dropdown[open] .icon-down {
  display: none;
}

.mobile-dropdown[open] .icon-up {
  display: inline-block;
}

.mobile-dropdown[open] .footer-links {
  background-color: var(--color-bg-dark);
  border-top: 2px dashed #666;
}

.mobile-dropdown[open] .dropdown {
  color: var(--text-hover);
}

.dropdown-label {
  flex: 1;
}

.search-shop {
  background-color: var(--color-bg-orange);
  cursor: pointer;
}

.search-shop p {
  color: var(--text-white);
  font-size: var(--font-size-lg);
  font-weight: var(--font-width-lg);
}

.icon {
  color: #999;
  transition: 0.3s;
}

.social {
  display: flex;
  align-items: center;
  gap: 12px;
}

.email input {
  border: 1px solid #ccc;
  outline: none;
  padding: 8px;
  width: 100%;
  transition: 0.3s;
}

.email input:focus {
  border-color: #ff6600;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.2);
}

.icon-arrow {
  padding: 5px;
  background-color: var(--color-bg-dark);
  width: 80px;
  cursor: pointer;
}

.icon-arrow i {
  font-size: 40px;
  color: white;
}

.contact {
  padding: 0 16px;
}

.go-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-bg-orange);
  cursor: pointer;
  z-index: 99999;

  opacity: 0;
  visibility: hidden;
  /* ẩn đi nhưng còn chổ */
  transition: 0.3s ease;
  transform: translateY(10px);
}

.go-top-icon {
  color: #fff;
  font-size: 18px;
  transition: 0.3s ease;
}

.go-top-icon:hover {
  transform: translateY(-6px);
  transition: 0.3s ease;
}

.go-top.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.copyright {
  color: var(--text-gray);
}



/* Mobile */
@media (max-width: 999px) {

  /* 1. Ép tất cả các cột và row trên mobile bỏ hoàn toàn padding/margin thừa */
  .footer .row,
  .footer [class*='col-'] {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .footer .row {
    margin-left: 0;
    margin-right: 0;
  }

  .container-fluid {
    padding-top: 10px !important;
  }

  .mobile-dropdown {
    width: 100%;
    display: block;
  }

  .mobile-dropdown .dropdown,
  .contact .row {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .footer-links a {
    padding-left: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-weight: var(--font-width-md);
  }

  .footer-links {
    padding: 20px;
  }

  .mobile-dropdown[open] .footer-links {
    background-color: var(--color-bg-dark);
    border-top: 2px dashed #666;
    width: 100%;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .social {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .email .row {
    justify-content: center;
  }

  .email-box {
    display: flex;
    width: 100%;
  }

  .email-box input {
    flex: 1;
    width: 100%;
    border: 1px solid #ccc;
    outline: none;
    padding: 8px;
  }

  .icon-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background-color: var(--color-bg-dark);
    width: 60px;
    cursor: pointer;
  }

  .shop-mobile {
    margin-top: 20px;
    order: 999;
  }

  .search-shop-mobile {
    background-color: var(--color-bg-orange);
    padding: 10px;
    width: 90%;
    margin: 0 auto;
  }

  .search-shop-mobile p {
    color: white;
    font-weight: 700;
  }
}
</style>

<!-- hiện cái tìm shop ở cuối trang -->
