<script setup>
import TopBar from './TopBar.vue'

const emit = defineEmits(['toggle', 'search-focus'])
</script>

<template>
  <div class="mobile-header">
    <el-button link @click="emit('toggle')">
      <el-icon size="24" color="#0080f0"><Menu /></el-icon>
    </el-button>

    <div class="header-content" @focusin="emit('search-focus')">
      <TopBar />
    </div>

    <div class="logo">Hi-Music</div>
  </div>
</template>

<style scoped lang="scss">
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .logo {
    display: block;
    font-weight: bold;
    font-size: 18px;
    color: $accent-color;
    white-space: nowrap;
  }

  .header-content {
    flex: 1;
    display: flex;
    justify-content: center;

    :deep(.top-bar) {
      display: flex;
      width: 100%;
      padding: 0;
      height: 40px;

      .search-bar {
        width: 100%;
        height: 36px;

        input {
          font-size: 13px;
        }
      }

      .user-profile {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
}
@media (max-width: 440px) {
  .mobile-header {
    .logo {
      display: none;
    }
    .header-content {
      :deep(.top-bar) {
        .search-bar {
          width: 100%;
        }
      }
    }
  }
}
</style>
