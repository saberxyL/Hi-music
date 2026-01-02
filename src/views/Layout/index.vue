<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from './components/SideBar.vue'
import MobileHeader from './components/MobileHeader.vue'
import TopBar from './components/TopBar.vue'

const route = useRoute()
const router = useRouter()

// 状态
const isMobileMenuOpen = ref(false)
const activeMenu = computed(() => route.path)

const handleMenuClick = url => {
  router.push(url)
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="layout-container">
    <!-- Mobile Header -->
    <MobileHeader
      @toggle="toggleMobileMenu"
      @search-focus="isMobileMenuOpen = false"
    />

    <!-- Sidebar -->
    <SideBar
      :is-open="isMobileMenuOpen"
      :active-menu="activeMenu"
      @menu-click="handleMenuClick"
    />

    <!-- Overlay for mobile -->
    <div
      class="overlay"
      v-if="isMobileMenuOpen"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Main Content -->
    <main class="main-content">
      <TopBar />

      <div class="content-scroll">
        <!-- 路由出口 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Player Bar (Fixed Bottom) -->
    <PlayerBar />
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at bottom left, #1a1f35 0%, #050505 100%);
  color: $text-primary;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 30px 100px 30px; // Bottom padding for player bar

    // 隐藏滚动条但保持功能
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(2px);
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 768px) {
  .main-content {
    padding-top: 60px; // Space for mobile header

    .content-scroll {
      padding: 20px;
      padding-bottom: 100px;
    }
  }
}
</style>
