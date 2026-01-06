<script setup>
import { formatTimeFromSecond } from '@/utils/time'
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useMusicStore } from '@/stores/music'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { curr_lyric_index, currentSong } = storeToRefs(musicStore)

const props = defineProps({
  lyrics: {
    type: Array,
    required: true
  }
})

const lyricsContainerRef = ref(null) // 歌词容器引用
const isUserScrolling = ref(false) // 用户是否在手动滚动
let scrollTimer = null

// 滚动到当前歌词行
const scrollToCurrentLine = () => {
  if (!lyricsContainerRef.value) return
  const container = lyricsContainerRef.value
  const activeLine = container.querySelector('.lyric-line.active')

  if (activeLine) {
    // 计算滚动位置：将当前歌词固定在容器高度的 35% 处（视觉上偏上，符合阅读习惯）
    // activeLine.offsetTop 是歌词距离容器顶部的距离
    // container.clientHeight * 0.35 是我们希望歌词出现的位置（距离视口顶部）
    // activeLine.clientHeight / 2 是为了让歌词中心对齐目标位置
    const targetPosition = container.clientHeight * 0.35
    const scrollTop =
      activeLine.offsetTop - targetPosition + activeLine.clientHeight / 2

    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    })
  }
}

// 处理点击歌词行跳转
const handleLyricJump = index => {
  // 同步当前时间
  if (props.lyrics[index]) {
    // 增加 0.2s 偏移量，防止跳转到上一句
    const time = props.lyrics[index].time + 0.2
    // 只修改 currentTime，通过 PlayerBar 的 watcher 来统一触发音频跳转
    musicStore.currentTime = time
    console.log('跳转歌词到时间：', time)
    // 如果当前未播放，则开始播放
    if (!musicStore.isPlaying) {
      musicStore.isPlaying = true
    }
  }

  // 点击后立即恢复自动滚动状态，并滚动到该行
  isUserScrolling.value = false
  if (scrollTimer) clearTimeout(scrollTimer)
  nextTick(() => {
    scrollToCurrentLine()
  })
}

// 处理用户滚动交互
const handleUserScroll = () => {
  isUserScrolling.value = true
  if (scrollTimer) clearTimeout(scrollTimer)

  // 4秒后如果没有新的交互，恢复自动滚动
  scrollTimer = setTimeout(() => {
    isUserScrolling.value = false
    scrollToCurrentLine()
  }, 4000)
}

// 监听歌词索引变化，实现滚动
watch(curr_lyric_index, async newVal => {
  if (newVal >= 0 && !isUserScrolling.value) {
    await nextTick()
    scrollToCurrentLine()
  }
})

onBeforeUnmount(() => {
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>

<template>
  <div class="lyric-section">
    <div class="song-info">
      <h2 class="title">
        {{ currentSong?.ori_audio_name || 'Hi Music' }}
        <!-- <span class="tag">VIP</span> -->
      </h2>
      <div class="artist">
        {{ currentSong?.author_name || '听见好音乐' }}
      </div>
    </div>

    <div
      class="lyrics-container"
      ref="lyricsContainerRef"
      @wheel="handleUserScroll"
      @touchstart="handleUserScroll"
    >
      <div
        v-for="(line, index) in lyrics"
        :key="index"
        class="lyric-line"
        :class="{ active: index === curr_lyric_index }"
        @click="handleLyricJump(index)"
      >
        <span class="text">{{ line.text }}</span>
        <span class="spacer"></span>
        <span class="time">{{ formatTimeFromSecond(line.time) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 歌词样式 */
.lyric-section {
  width: 400px;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 400px;

  .song-info {
    .title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;

      .tag {
        font-size: 12px;
        border: 1px solid #e6a23c;
        color: #e6a23c;
        padding: 1px 4px;
        border-radius: 4px;
        font-weight: normal;
      }
    }

    .artist {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .lyrics-container {
    flex: 1;
    overflow-y: auto;
    padding: 30px 0;
    position: relative; /* 关键：确保 offsetTop 计算正确 */
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 15%,
      #000 85%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 15%,
      #000 85%,
      transparent 100%
    );

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    .lyric-line {
      padding: 12px 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 16px;
      transition: all 0.3s linear;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
        transform-origin: left center;
      }

      .spacer {
        flex: 1;
        height: 1px;
        border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
        margin: 0 12px;
        opacity: 0;
        transition: opacity 0.3s;
        transform: translateY(2px);
      }

      .time {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        opacity: 0;
        transition: opacity 0.3s;
        font-variant-numeric: tabular-nums;
        min-width: 40px;
        text-align: right;
      }

      &:hover {
        color: rgba(255, 255, 255, 0.7);

        .spacer,
        .time {
          opacity: 1;
        }
      }

      &.active {
        .text {
          transform: scale(1.25);
        }
        color: $accent-color;
        font-weight: 600;
      }
    }
  }
}

@media (max-width: 768px) {
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
