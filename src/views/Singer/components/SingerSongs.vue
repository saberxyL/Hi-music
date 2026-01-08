<script setup>
import { ref, onMounted } from 'vue'
import SongList from '@/components/SongList.vue'
import { getSingerSongsApi } from '@/api/singer'
import { useMusicStore } from '@/stores/music'

const props = defineProps({
  singerId: {
    type: [Number, String],
    required: true
  }
})

const musicStore = useMusicStore()
const songs = ref([]) // 歌手歌曲列表
const total = ref(0) // 歌手歌曲总数
const page = ref(1) // 当前页码
const sort = ref('hot') // hot or new
const loading = ref(false) // 加载状态
const hasMore = ref(true) // 是否有更多数据

// 获取歌手歌曲列表
const fetchSongs = async (isLoadMore = false) => {
  if (loading.value) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const res = await getSingerSongsApi({
      id: props.singerId,
      page: page.value,
      pagesize: 30,
      sort: sort.value
    })

    // 处理返回数据
    if (res.status === 1) {
      total.value = res.total
      const newSongs = res.data.map(item => ({
        hash: item.hash, // 唯一标识
        sizable_cover: item.trans_param?.union_cover, // 封面
        author_name: item.author_name, // 歌手
        ori_audio_name: item.audio_name, // 歌曲名
        time_length: item.timelength // 时长
      }))

      // 更新歌曲列表
      if (isLoadMore) {
        songs.value = [...songs.value, ...newSongs]
        musicStore.setPlayList({
          count: total.value,
          data: songs.value
        })
      } else {
        songs.value = newSongs
      }

      // 更新分页和是否有更多数据
      if (songs.value.length >= total.value || newSongs.length === 0) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理排序切换
const handleSortChange = newSort => {
  if (sort.value === newSort) return
  sort.value = newSort
  page.value = 1
  hasMore.value = true
  fetchSongs()
}
// 核心：注册给全局播放器调用的加载函数
const loadMoreForStore = async () => {
  // 如果正在加载或没有更多数据，直接返回
  if (loading.value || !hasMore.value) return
  await fetchSongs(true)
}

// 播放全部歌曲
const handlePlayAll = () => {
  if (songs.value.length === 0) return
  // 设置播放列表到 Store
  musicStore.setPlayList({
    count: total.value,
    data: songs.value
  })
  // 注册加载更多函数到Store
  musicStore.setLoadMoreHandler(loadMoreForStore)
  // 播放第一首
  musicStore.switchCurrentMusic(songs.value[0].hash)
}

const loadMore = () => {
  fetchSongs(true)
}

defineExpose({
  loadMore
})

onMounted(() => {
  fetchSongs()
})
</script>

<template>
  <div
    class="singer-songs"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loading || !hasMore"
    :infinite-scroll-distance="100"
    :infinite-scroll-immediate="false"
  >
    <SongList :songs="songs" :scrollable="false" :isSecond="false">
      <div class="list-header">
        <div class="left">
          <span class="play-all-text" @click="handlePlayAll">
            <i class="icon iconfont icon-video-play"></i>
            播放全部
          </span>
          <span class="count">{{ total }}首歌曲</span>
        </div>
        <div class="right">
          <span
            class="sort-item"
            :class="{ active: sort === 'hot' }"
            @click="handleSortChange('hot')"
            >最热</span
          >
          <span class="divider">|</span>
          <span
            class="sort-item"
            :class="{ active: sort === 'new' }"
            @click="handleSortChange('new')"
            >最新</span
          >
        </div>
      </div>
    </SongList>

    <div v-if="loading" class="loading-text">加载中...</div>
    <div v-if="!hasMore && songs.length > 0" class="no-more-text">
      没有更多了
    </div>
  </div>
</template>

<style scoped lang="scss">
.singer-songs {
  padding: 10px;

  .list-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .play-all-text {
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        font-size: 15px;
        color: $text-primary;
        border-radius: 34px;
        padding: 5px 17px 5px 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);

        .icon {
          font-size: 12px;
          margin-left: 5px;
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }

      .count {
        font-size: 13px;
        color: $text-secondary;
      }
    }

    .right {
      font-size: 14px;
      color: $text-secondary;

      .sort-item {
        cursor: pointer;
        padding: 0 5px;

        &.active,
        &:hover {
          color: $accent-color;
        }
      }

      .divider {
        margin: 0 5px;
        color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .loading-text,
  .no-more-text {
    text-align: center;
    padding: 20px;
    color: $text-secondary;
    font-size: 13px;
  }
}
</style>
