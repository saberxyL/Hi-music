<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMusicStore } from '@/stores/music'
import PlayerBar from '@/components/PlayerBar.vue'
import LyricsScroll from './components/LyricsScroll.vue'
import { replaceImageSize } from '@/utils/img'
import Lyric from 'lyric-parser'

const router = useRouter()
const musicStore = useMusicStore()
const { currentSong, song_lyric } = storeToRefs(musicStore)

const goBack = () => {
  router.back()
}

// 解析歌词
const parsedLyrics = computed(() => {
  if (!song_lyric.value) return []
  const l = new Lyric(song_lyric.value)
  return l.lines.map(item => ({
    time: item.time / 1000,
    text: item.txt
  }))
})
</script>

<template>
  <div class="music-player-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="left-controls">
        <el-icon class="back-icon" @click="goBack"><ArrowDown /></el-icon>
      </div>
      <div class="window-controls">
        <span
          class="icon-item iconfont icon-exit-full-screen"
          @click="router.back()"
        ></span>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧：专辑封面 -->
      <div class="cover-section">
        <div class="cover-wrapper">
          <img
            :src="
              replaceImageSize(currentSong?.sizable_cover, 400) ||
              '../../assets/images/login-sm-bg.jpg'
            "
            alt="cover"
            class="cover-img"
          />
        </div>
      </div>

      <!-- 右侧：歌词 -->
      <div class="lyric-section">
        <LyricsScroll :lyrics="parsedLyrics" />
      </div>
    </div>

    <!-- 底部播放条 -->
    <div class="player-bar-container">
      <PlayerBar />
    </div>
  </div>
</template>

<style scoped lang="scss">
.music-player-page {
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at bottom left, #1a1f35 0%, #050505 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.top-nav {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 10;

  .back-icon {
    font-size: 24px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }

  .window-controls {
    display: flex;
    gap: 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 20px;

    .icon-item {
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      cursor: pointer;
      font-size: 20px;
      &:hover {
        color: #fff;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px; // 留出底部播放条空间
  gap: 80px;
}

/* 专辑封面样式 */
.cover-section {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  .cover-wrapper {
    width: 300px;
    height: 300px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* 底部播放条适配 */
.player-bar-container {
  :deep(.player-bar) {
    background: transparent !important;
    border-top: none;
    backdrop-filter: none;

    // 隐藏左侧小封面和歌词
    .left-side {
      .cover-wrapper {
        display: none;
      }
      .lyric-section {
        display: none;
      }
      // 调整歌曲信息位置
      .song-section {
        width: auto;
        .info {
          display: flex;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    gap: 40px;
    padding-top: 20px;
  }

  .vinyl-section {
    width: 300px;
    height: 300px;
    .vinyl-wrapper {
      width: 240px;
      height: 240px;
    }
  }

  .lyric-section {
    width: 100%;
    padding: 0 30px;
    height: 300px;
    align-items: center;
    text-align: center;

    .song-info {
      .title {
        justify-content: center;
      }
    }
  }
}
</style>
