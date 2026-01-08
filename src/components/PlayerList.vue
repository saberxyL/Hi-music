<script setup>
import { useMusicStore } from '@/stores/music'
import SongList from './SongList.vue'
import { ref, watch, onUnmounted, computed } from 'vue'

const musicStore = useMusicStore()
const containerRef = ref(null)

// 使用 computed 替换手动 watch，以实现数据的实时响应更新
const listObj = computed(() => {
  if (musicStore.current_type === 'history') {
    return {
      count: musicStore.song_list.length,
      data: musicStore.song_list
    }
  } else {
    return musicStore.play_list_obj
  }
})
const closeList = () => {
  musicStore.showPlayList = false
}

// 点击外部区域关闭播放列表
const handleClickOutside = event => {
  // 排除切换按钮 (.list-icon)，防止点击图标关闭后被图标的点击事件再次打开
  if (event.target.closest('.list-icon')) return

  if (
    musicStore.showPlayList &&
    containerRef.value &&
    !containerRef.value.contains(event.target)
  ) {
    closeList()
  }
}

// 滚动加载
const isLoading = ref(false)

const triggerLoadMore = async () => {
  if (musicStore.current_type !== 'playList' || isLoading.value) return

  isLoading.value = true
  try {
    await musicStore.reqLoadMore()
  } finally {
    isLoading.value = false
  }
}

watch(
  () => musicStore.showPlayList,
  newVal => {
    if (newVal) {
      setTimeout(() => {
        // 使用 capture: true 捕获模式监听，防止其他组件阻止冒泡导致无法关闭
        document.addEventListener('click', handleClickOutside, true)
      }, 0)
    } else {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div
        class="player-list-container"
        v-if="musicStore.showPlayList"
        ref="containerRef"
        @click.stop
      >
        <div class="header">
          <h3>播放队列</h3>
          <div class="sub-header">
            <span class="count">共{{ listObj.count }}首歌曲</span>
          </div>
        </div>

        <div
          class="scroll-area"
          v-infinite-scroll="triggerLoadMore"
          :infinite-scroll-disabled="
            isLoading || musicStore.current_type !== 'playList'
          "
          :infinite-scroll-distance="50"
          :infinite-scroll-immediate="false"
        >
          <SongList
            :songs="listObj.data"
            :show-header="false"
            :isSecond="false"
            :scrollable="false"
          />
          <div v-if="isLoading" class="list-loading">
            <el-icon class="is-loading"><Loading /></el-icon> 加载中...
          </div>
          <div v-if="listObj.data.length === 0" class="empty-state">
            暂无播放歌曲
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.player-list-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2000;
  width: 400px;
  background: radial-gradient(circle at bottom left, #1a1f35 0%, #050505 100%);
  backdrop-filter: blur(40px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 80vh; // 增加最大高度限制

  .header {
    padding: 24px 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    h3 {
      font-size: 22px;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }

    .sub-header {
      .count {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 20px;

    // 覆盖 SongList 样式以适配
    :deep(.song-list) {
      background: transparent;
      padding: 0;
    }

    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .empty-state {
      padding: 40px 0;
      text-align: center;
      color: #666;
      font-size: 14px;
    }

    .list-loading {
      padding: 10px 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  }
}

/* 动画效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translate(50px, -50%);
}

@media (max-width: 768px) {
  .player-list-container {
    width: 85vw;
    right: 50%;
    transform: translate(50%, -50%);
    max-height: 60vh;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translate(50%, -40%);
  }
}
</style>
