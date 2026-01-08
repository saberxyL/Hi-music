<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/music'
import PlayerList from './PlayerList.vue'
import { formatTimeFromSecond } from '@/utils/time'
import { replaceImageSize } from '@/utils/img'
import { storeToRefs } from 'pinia'
import player from '@/utils/player'
import { ElMessage } from 'element-plus'

const musicStore = useMusicStore()
const {
  currentTime,
  duration,
  isPlaying,
  playMode,
  song_lyric,
  volume,
  currentSong,
  currentSongUrl,
  currentLyric,
  curr_lyric_index
} = storeToRefs(musicStore)
const router = useRouter()

// 监听歌曲URL变化
watch(currentSongUrl, newUrl => {
  // 播放新歌曲
  if (!newUrl) return
  player.playAudio(newUrl, true, () => {
    musicStore.autoPlayMusic(1) // 自动播放下一首
  })
  musicStore.isPlaying = true
})

// 监听歌词
watch(song_lyric, lrc => {
  // 传入空回调，不再依赖 lyric-parser 的事件来更新歌词（改用 updateTime 统一计算）
  player.setLyric(lrc, () => {})
})

// 监听音量
watch(volume, val => {
  player.setVolume(val / 100)
})

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

// 监听播放状态
watch(isPlaying, val => {
  player.setPlayState(val)
})

// 播放/暂停切换
const togglePlay = () => {
  musicStore.isPlaying = !musicStore.isPlaying
}

// 切换播放模式
const switchMode = () => {
  const modes = ['sequence', 'loop', 'random']
  const index = modes.indexOf(playMode.value)
  musicStore.playMode = modes[(index + 1) % modes.length]
}

// 监听时间，更新音频，如果当前时间更改，就更改音频，通过操作状态管理的时间来操作音频
watch(currentTime, val => {
  if (isDragging.value) return
  const audioDuration = player.duration() // 获取实际音频总时长
  // 只有当实际音频时长有效，且明显短于歌曲总时长（例如少于10秒以上）时，才视为试听版

  // console.log(
  //   '试听结束，自动播放下一首',
  //   currentTime.value,
  //   audioDuration,
  //   duration.value
  // )
  if (audioDuration > 0 && duration.value > audioDuration + 10) {
    // 到达试听结束时间,自动播放下一首
    if (player.currentTime() >= audioDuration) {
      ElMessage.info('试听结束，该歌曲是Vip歌曲')
      musicStore.autoPlayMusic(1)
      return
    }
  }
  // 如果是用户正在拖拽，或者时间差异极小（正常播放），则不跳转
  if (Math.abs(player.currentTime() - val) > 1) {
    player.seek(val)
  }
})

const isDragging = ref(false)
// 进度条拖动
const onSliderInput = () => {
  // 只用来标记正在拖拽状态
  isDragging.value = true
}

// 拖动或者点击进度条结束
const onSliderChange = val => {
  isDragging.value = false
  currentTime.value = val
  console.log('跳转时间到：', val)
}

// 更新进度条
const updateTime = () => {
  // 只有在音频播放且未拖拽时，才从音频同步时间到 Store
  if (musicStore.isPlaying && !isDragging.value) {
    const t = player.currentTime()
    currentTime.value = t
    // 每一帧手动计算当前歌词行，确保绝对同步
    // 这种方式比依赖 lyric-parser 的 setTimeout 更精准，且不会受 seek 影响
    const lyric = player.lyric
    if (lyric && lyric.lines && lyric.lines.length) {
      const currentT = t * 1000 // 转为毫秒
      const lines = lyric.lines // 歌词行数组
      let activeIndex = -1
      // 查找当前时间对应的最后一句歌词
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].time <= currentT) {
          activeIndex = i
        } else {
          break
        }
      }

      // 更新 Store 中的歌词索引和当前歌词文本
      if (activeIndex !== curr_lyric_index.value) {
        curr_lyric_index.value = activeIndex
        if (activeIndex !== -1) {
          currentLyric.value = lines[activeIndex].txt
        }
      }
    }
  }
  requestAnimationFrame(updateTime)
}

const showPlayListToggle = () => {
  musicStore.showPlayList = !musicStore.showPlayList
  console.log('切换播放列表显示状态', musicStore.showPlayList)
}
// 初始化
onMounted(() => {
  updateTime()
  // 初始化音量
  player.setVolume(volume.value / 100)
})
</script>

<template>
  <div class="player-bar">
    <!-- 顶部进度条 -->
    <div class="progress-bar-wrapper">
      <el-slider
        v-model="currentTime"
        :max="duration"
        :format-tooltip="formatTimeFromSecond"
        @input="onSliderInput"
        @change="onSliderChange"
        size="small"
        class="progress-slider"
      />
    </div>

    <div class="content-wrapper" @click.stop="router.push('/music-player')">
      <!-- 左侧区域：歌曲信息 + 歌词 -->
      <div class="left-side">
        <div class="song-section">
          <div class="cover-wrapper" :class="{ 'is-playing': isPlaying }">
            <img
              :src="replaceImageSize(currentSong?.sizable_cover, 60)"
              alt="cover"
            />
            <div class="cover-mask" @click="router.push('/music-player')">
              <span class="iconfont icon-full-screen"></span>
            </div>
          </div>
          <div class="info" @click.stop>
            <div class="title-row">
              <span class="title">{{
                currentSong?.ori_audio_name || 'Hi Music'
              }}</span>
            </div>
            <div class="artist">
              {{ currentSong?.author_name || '听见好音乐' }}
            </div>
          </div>
        </div>

        <!-- 歌词区域 -->
        <div class="lyric-song_lyric">
          {{ currentLyric }}
        </div>
      </div>

      <!-- 中间：播放控制 -->
      <div class="control-section">
        <div class="main-controls" @click.stop>
          <!-- 播放模式 -->
          <el-tooltip :content="playModeText" placement="top" :show-after="500">
            <el-icon class="control-icon mode-icon" @click.stop="switchMode">
              <Refresh v-if="playMode === 'sequence'" />
              <RefreshRight v-else-if="playMode === 'loop'" />
              <Sort v-else />
            </el-icon>
          </el-tooltip>

          <!-- 上一首 -->
          <el-icon
            class="control-icon prev-icon"
            @click.stop="musicStore.autoPlayMusic(-1)"
            ><CaretLeft
          /></el-icon>

          <!-- 播放/暂停 -->
          <div
            class="play-btn"
            @click.stop="togglePlay"
            :class="{ 'is-active': isPlaying }"
          >
            <span v-if="isPlaying" class="iconfont icon-video-pause"></span>
            <span v-else class="play-icon iconfont icon-video-play"></span>
          </div>

          <!-- 下一首 -->
          <el-icon
            class="control-icon next-icon"
            @click.stop="musicStore.autoPlayMusic(1)"
            ><CaretRight
          /></el-icon>
        </div>
      </div>

      <!-- 右侧：音量与列表 -->
      <div class="right-side">
        <div class="extra-section" @click.stop>
          <span class="time"
            >{{ formatTimeFromSecond(currentTime) }} /
            {{ formatTimeFromSecond(duration) }}</span
          >
          <div class="volume-wrapper">
            <el-icon class="volume-icon">
              <span class="iconfont" :class="volumeIconClass"></span>
            </el-icon>
            <el-slider v-model="volume" class="volume-slider" size="small" />
          </div>

          <el-tooltip content="播放列表" placement="top" :show-after="500">
            <span
              class="iconfont icon-menu list-icon"
              @click="showPlayListToggle"
              :class="{ active: musicStore.showPlayList }"
            ></span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 播放列表组件 -->
    <PlayerList />
  </div>
</template>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 500;
  user-select: none;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
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
  padding-left: 24px;
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

.lyric-song_lyric {
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
  height: 80px;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;

  .main-controls {
    display: flex;
    align-items: center;
    gap: 24px;

    .control-icon {
      height: 40px;
      width: 40px;
      text-align: center;
      line-height: 40px;
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
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: $accent-color;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);

      .play-icon {
        margin-left: 3px;
      }
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
  height: 80px;
  padding-right: 24px;
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
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    color: $text-secondary;
    cursor: pointer;
    transition: color 0.3s;
    margin-left: 8px;

    &:hover {
      color: $accent-color;
    }

    &.active {
      color: $accent-color;
    }
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .player-bar {
    height: 64px;

    .content-wrapper {
      padding: 0 12px;
    }

    .left-side {
      gap: 10px;
      padding-right: 0;
      flex: 1;
      width: 0; // Fix flex overflow
    }

    .song-section {
      flex: 1;
      width: auto;
      min-width: 0;

      .cover-wrapper {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
      }

      // 显示歌曲信息
      .info {
        display: flex;
        width: 100%;

        .title-row .title {
          font-size: 13px;
        }
        .artist {
          font-size: 11px;
        }
      }
    }

    // 隐藏歌词
    .lyric-song_lyric {
      display: none;
    }

    .control-section {
      flex: 0 0 auto;
      margin-left: 10px;

      .main-controls {
        gap: 15px;

        // 调整图标大小适应移动端
        .control-icon {
          width: auto;
          height: auto;
          line-height: 1;
          font-size: 22px;
        }

        .play-btn {
          width: 36px;
          height: 36px;
          font-size: 16px;
          .play-icon {
            margin-left: 2px;
          }
        }
      }
    }

    // 显示列表按钮，隐藏音量和时间
    .right-side {
      display: flex;
      flex: 0 0 auto;

      .extra-section {
        width: auto;
        padding-right: 0;
        gap: 0;

        .time,
        .volume-wrapper {
          display: none;
        }

        .list-icon {
          margin-left: 12px;
          font-size: 22px;
          width: auto;
          height: auto;
        }
      }
    }
  }
}
</style>
