<script setup>
import { ref, computed } from 'vue'

// 模拟UI状态，暂时不连接真实逻辑
const isPlaying = ref(false)
const volume = ref(50)
const currentTime = ref(30)
const duration = ref(240)
const isLiked = ref(false)
const playMode = ref('sequence') // sequence, loop, random
const currentLyric = ref('我听见雨滴落在青青草地') // 模拟歌词

// 播放模式提示文字
const playModeText = computed(() => {
  const map = {
    sequence: '列表循环',
    loop: '单曲循环',
    random: '随机播放'
  }
  return map[playMode.value]
})

// 音量图标
const volumeIconClass = computed(() => {
  if (volume.value === 0) return 'icon-sound-0'
  if (volume.value <= 50) return 'icon-sound-1'
  return 'icon-sound-2'
})

// 格式化时间
const formatTime = time => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const switchMode = () => {
  const modes = ['sequence', 'loop', 'random']
  const index = modes.indexOf(playMode.value)
  playMode.value = modes[(index + 1) % modes.length]
}
</script>

<template>
  <div class="player-bar">
    <!-- 顶部进度条 -->
    <div class="progress-bar-wrapper">
      <el-slider
        v-model="currentTime"
        :max="duration"
        :show-tooltip="false"
        size="small"
        class="progress-slider"
      />
    </div>

    <div class="content-wrapper">
      <!-- 左侧区域：歌曲信息 + 歌词 -->
      <div class="left-side">
        <div class="song-section">
          <div class="cover-wrapper" :class="{ 'is-playing': isPlaying }">
            <img
              src="https://p1.music.126.net/5zs7IvmLv7Szq9xdhGL26Q==/109951165421200265.jpg"
              alt="cover"
            />
            <div class="cover-mask">
              <el-icon><FullScreen /></el-icon>
            </div>
          </div>
          <div class="info">
            <div class="title-row">
              <span class="title">夜的第七章</span>
              <el-icon
                class="like-btn"
                :class="{ 'is-active': isLiked }"
                @click="toggleLike"
              >
                <StarFilled v-if="isLiked" />
                <Star v-else />
              </el-icon>
            </div>
            <div class="artist">周杰伦</div>
          </div>
        </div>

        <!-- 歌词区域 -->
        <div class="lyric-section">
          {{ currentLyric }}
        </div>
      </div>

      <!-- 中间：播放控制 -->
      <div class="control-section">
        <div class="main-controls">
          <!-- 播放模式 -->
          <el-tooltip :content="playModeText" placement="top" :show-after="500">
            <el-icon class="control-icon mode-icon" @click="switchMode">
              <Refresh v-if="playMode === 'sequence'" />
              <RefreshRight v-else-if="playMode === 'loop'" />
              <Sort v-else />
            </el-icon>
          </el-tooltip>

          <!-- 上一首 -->
          <el-icon class="control-icon prev-icon"><CaretLeft /></el-icon>

          <!-- 播放/暂停 -->
          <div
            class="play-btn"
            @click="togglePlay"
            :class="{ 'is-active': isPlaying }"
          >
            <span v-if="isPlaying" class="iconfont icon-video-pause"></span>
            <span v-else class="play-icon iconfont icon-video-play"></span>
          </div>

          <!-- 下一首 -->
          <el-icon class="control-icon next-icon"><CaretRight /></el-icon>
        </div>
      </div>

      <!-- 右侧：音量与列表 -->
      <div class="right-side">
        <div class="extra-section">
          <span class="time"
            >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span
          >
          <div class="volume-wrapper">
            <el-icon class="volume-icon">
              <span class="iconfont" :class="volumeIconClass"></span>
            </el-icon>
            <el-slider v-model="volume" class="volume-slider" size="small" />
          </div>

          <el-tooltip content="播放列表" placement="top" :show-after="500">
            <span class="iconfont icon-menu list-icon"></span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 500;
  user-select: none;
  display: flex;
  flex-direction: column;
}

.progress-bar-wrapper {
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  z-index: 10;

  // 覆盖 Element Plus Slider 样式
  :deep(.el-slider) {
    height: 10px;
    .el-slider__runway {
      height: 2px;
      background: transparent;
      margin: 0;
      .el-slider__bar {
        height: 2px;
        background: $accent-color;
        border-radius: 0 2px 2px 0;
      }
      .el-slider__button-wrapper {
        top: -16px;
        display: none;
        .el-slider__button {
          width: 10px;
          height: 10px;
          border: none;
          background: #fff;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
        }
      }
    }

    &:hover {
      .el-slider__runway {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        .el-slider__bar {
          height: 4px;
        }
      }
      .el-slider__button-wrapper {
        display: block;
      }
    }
  }
}

.content-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.left-side {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
  padding-right: 20px;
}

.lyric-section {
  color: #005bea;
  font-size: 13px;
  line-height: 1.5;
  max-width: 300px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
  font-weight: 500;
}

/* 左侧歌曲信息 */
.song-section {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 250px;
  flex-shrink: 0;

  .cover-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .cover-mask {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
    }

    &:hover .cover-mask {
      opacity: 1;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;

    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .title {
        font-size: 14px;
        color: $text-primary;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .like-btn {
        font-size: 16px;
        color: $text-secondary;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #fff;
        }

        &.is-active {
          color: #ff4d4f;
        }
      }
    }

    .artist {
      font-size: 12px;
      color: $text-secondary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 中间控制区 */
.control-section {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;

  .main-controls {
    display: flex;
    align-items: center;
    gap: 24px;

    .control-icon {
      font-size: 20px;
      color: $text-secondary;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: $accent-color;
      }

      &:active {
        transform: scale(0.9);
      }
    }

    .play-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: $btn-bg-color;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);

      .play-icon {
        margin-left: 2px; // 视觉修正
      }

      // &:hover {
      //   transform: scale(1.1);
      //   background: $accent-color;
      //   color: #fff;
      //   box-shadow: 0 0 20px rgba(0, 198, 251, 0.4);
      // }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

/* 右侧功能区 */
.right-side {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  min-width: 0;
}

.extra-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  width: 250px;

  .time {
    font-size: 12px;
    color: $text-secondary;
    font-variant-numeric: tabular-nums;
    min-width: 85px;
    text-align: right;
  }

  .volume-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100px;

    .volume-icon {
      font-size: 18px;
      color: $text-secondary;
    }

    .volume-slider {
      flex: 1;
      :deep(.el-slider__bar) {
        background: #005bea;
      }
      :deep(.el-slider__button) {
        width: 10px;
        height: 10px;
        border-color: #005bea;
      }
    }
  }

  .list-icon {
    font-size: 20px;
    color: $text-secondary;
    cursor: pointer;
    transition: color 0.3s;
    margin-left: 8px;

    &:hover {
      color: $accent-color;
    }
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .player-bar {
    height: 64px;

    .content-wrapper {
      padding: 0 16px;
    }

    .left-side {
      gap: 10px;
      padding-right: 10px;
    }

    .song-section {
      flex: 0 0 auto;
      width: auto;

      .cover-wrapper {
        width: 40px;
        height: 40px;
      }

      .info {
        display: none;
      }
    }

    .lyric-section {
      flex: 1;
      text-align: center;
      max-width: none;
      font-size: 12px;
    }

    .control-section {
      flex: 0 0 auto;

      .main-controls {
        gap: 16px;

        // 隐藏次要按钮
        .mode-icon,
        .prev-icon,
        .next-icon,
        .lyric-icon {
          display: none;
        }

        .play-btn {
          width: 36px;
          height: 36px;
          font-size: 20px;
        }
      }
    }

    .right-side {
      display: none;
    }
  }
}
</style>
