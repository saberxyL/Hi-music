<script setup>
import { computed } from 'vue'
import { useMusicStore } from '@/stores/music'
import SongList from '@/components/SongList.vue'

const musicStore = useMusicStore()
const recentSongs = computed(() => musicStore.song_list)

const handlePlayAll = () => {
  if (recentSongs.value.length === 0) return
  // 直接设置为播放列表模式，并将当前历史记录作为歌单
  musicStore.setPlayList({
    count: recentSongs.value.length,
    data: [...recentSongs.value]
  })
  // 播放第一首
  musicStore.switchCurrentMusic(recentSongs.value[0].hash)
}
</script>

<template>
  <div class="recent-play">
    <div class="header">
      <div class="header-left">
        <h1 class="title">最近播放</h1>
        <span class="count">共 {{ recentSongs.length }} 首</span>
      </div>
      <div class="actions" v-if="recentSongs.length > 0">
        <button class="play-all-btn" @click="handlePlayAll">
          <span class="iconfont icon-video-play"></span> 播放列表
        </button>
      </div>
    </div>

    <div class="list-container">
      <SongList
        v-if="recentSongs.length > 0"
        :songs="recentSongs"
        :height="580"
        :scrollable="true"
        :showHeader="false"
        :isSecond="false"
      />

      <div v-else class="empty-state">
        <span class="iconfont icon-music"></span>
        <p>暂无播放记录，快去听听歌吧~</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.recent-play {
  padding: 32px;
  height: 100%;
  box-sizing: border-box;
  color: $text-primary;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-left {
      display: flex;
      align-items: baseline;

      .title {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 0.5px;
        background: linear-gradient(to right, $text-primary, $text-secondary);
        -webkit-background-clip: text;
        color: transparent;
        margin-right: 12px;
      }

      .count {
        font-size: 13px;
        color: $text-secondary;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }

    .play-all-btn {
      background: linear-gradient(135deg, $accent-color 0%, $btn-bg-color 100%);
      color: $text-primary;
      border: none;
      border-radius: 24px;
      padding: 8px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 91, 234, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 91, 234, 0.4);
        filter: brightness(1.1);
      }

      &:active {
        transform: translateY(0);
      }

      .iconfont {
        font-size: 16px;
      }
    }
  }
  .list-container {
    animation: fadeIn 0.5s ease-out;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 100px;
    color: $text-secondary;
    opacity: 0.6;

    .iconfont {
      font-size: 48px;
      margin-bottom: 16px;
    }

    p {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
