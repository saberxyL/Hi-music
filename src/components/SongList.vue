<script setup>
import { useMusicStore } from '@/stores/music'
import { replaceImageSize } from '@/utils/img'
import { formatTimeFromSecond, formatTimeFromMillisecond } from '@/utils/time'
const musicStore = useMusicStore()

defineProps({
  songs: {
    type: Array,
    default: () => []
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  height: {
    type: Number,
    default: 500
  },
  isSecond: {
    type: Boolean,
    default: true
  },
  scrollable: {
    type: Boolean,
    default: true
  }
})

const handlePlay = (hash, toggle = false) => {
  if (toggle) {
    musicStore.isPlaying = !musicStore.isPlaying
    return
  }
  console.log('播放歌曲', hash)
  musicStore.switchCurrentMusic(hash)
}
</script>

<template>
  <section
    class="section-block"
    :style="scrollable ? `height: ${height}px;` : 'height: auto;'"
  >
    <div class="section-header" v-if="showHeader">
      <slot>
        <h3>每日推荐</h3>
        <span class="song_num">共{{ songs.length }}首</span>
      </slot>
    </div>
    <div class="song-list" :class="{ 'no-scroll': !scrollable }">
      <div
        v-for="song in songs"
        :key="song.hash"
        class="song-item"
        @click="musicStore.switchCurrentMusic(song.hash)"
      >
        <!-- 原有内容不变 -->
        <div class="index-area">
          <div
            :class="{
              'playing-anim-box':
                musicStore.currentSong?.hash === song.hash &&
                musicStore.isPlaying
            }"
          >
            <div class="playing-anim">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>
          </div>
          <span class="sizable-cover">
            <img :src="replaceImageSize(song.sizable_cover, 60)" alt="cover" />
          </span>
        </div>

        <div class="song-info">
          <div
            class="title text-ellipsis"
            :class="{ active: musicStore.currentSong?.hash === song.hash }"
            :title="song.ori_audio_name"
          >
            {{ song.ori_audio_name }}
          </div>
          <div class="artist text-ellipsis" :title="song.author_name">
            {{ song.author_name }}
          </div>
        </div>

        <div class="actions" @click.stop="handlePlay(song.hash)">
          <span
            class="action-icon iconfont"
            @click.stop="handlePlay(song.hash, true)"
            :class="
              musicStore.currentSong?.hash === song.hash && musicStore.isPlaying
                ? 'icon-video-pause'
                : 'icon-video-play'
            "
          ></span>
        </div>
        <div class="duration">
          {{
            !isSecond
              ? formatTimeFromMillisecond(song.time_length)
              : formatTimeFromSecond(song.time_length)
          }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-block {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
    }

    .song_num {
      font-size: 14px;
      color: $text-secondary;
      cursor: pointer;
      &:hover {
        color: $accent-color;
      }
    }
  }

  // 修复2：修正类名 + 禁用组件内滚动
  .no-scroll {
    overflow-y: visible !important; // 强制显示所有内容，交由父容器滚动
    height: auto !important; // 取消高度限制
  }

  .song-list {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 10px;

    // 原有song-item样式不变
    .song-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;

      &:nth-child(even) {
        background: rgba(255, 255, 255, 0.03);
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .index-area {
        position: relative;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .sizable-cover {
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            aspect-ratio: 1;
          }
        }

        .playing-anim-box {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.3);

          .playing-anim {
            height: 16px;
            width: 16px;
            display: flex;
            text-align: center;
            align-items: flex-end;
            justify-content: center;
            gap: 4px;

            .bar {
              width: 3px;
              background-color: $accent-color;
              animation: equalize 1s infinite ease-in-out;
              border-radius: 1px;

              &:nth-child(1) {
                animation-delay: 0s;
                height: 6px;
              }
              &:nth-child(2) {
                animation-delay: 0.2s;
                height: 12px;
              }
              &:nth-child(3) {
                animation-delay: 0.4s;
                height: 8px;
              }
            }
          }
        }
      }

      .song-info {
        flex: 1;

        .title {
          width: 200px;
          font-size: 15px;
          margin-bottom: 4px;
          color: $text-primary;

          &.active {
            color: $accent-color;
          }
        }

        .artist {
          width: 200px;
          font-size: 12px;
          color: $text-secondary;
        }
      }

      .actions {
        margin-right: 16px;
        opacity: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;

        .action-icon {
          font-size: 18px;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s;
          color: $text-primary;

          &:hover {
            color: $accent-color;
          }
        }
      }

      .duration {
        color: $text-secondary;
        font-size: 13px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        .actions {
          opacity: 1;
        }
      }
    }
  }
}

@keyframes equalize {
  0% {
    height: 4px;
  }
  50% {
    height: 14px;
  }
  100% {
    height: 4px;
  }
}

@media (max-width: 768px) {
  .song-list .song-item {
    .actions {
      opacity: 1;
      margin-right: 8px;
      .action-icon {
        font-size: 20px;
        color: $text-secondary;
      }
    }
  }
}
</style>
