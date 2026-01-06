<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PlayerBar from '@/components/PlayerBar.vue'
const route = useRoute()
const isShow = computed(() => {
  // 从路由元信息中获取 playerShow 属性，默认为 true
  return route.meta.playerShow !== false
})
console.log('播放器显示状态:', route.meta)
</script>

<template>
  <div class="app-enter">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <PlayerBar v-show="isShow" />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden; /* 禁止全局滚动条 */
}

.app-enter {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 确保容器不溢出 */
  background: radial-gradient(circle at bottom left, #1a1f35 0%, #050505 100%);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  filter: blur(8px);
  transform: scale(0.98); /* 改为缩小，避免放大导致的溢出 */
}
</style>
