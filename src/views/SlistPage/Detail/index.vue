<script setup>
import { getMusicListSongsApi } from '@/api/list'
import { ref } from 'vue'
import { useMusicStore } from '@/stores/music'
import { useRoute } from 'vue-router'
import PlaylistHeader from './components/PlaylistHeader.vue'

const route = useRoute() // 路由
const musicSotre = useMusicStore() //
const musicListInfo = ref({})
const musicListSongs = ref([]) // 歌单歌曲列表
const musicListLength = ref(null) // 歌单歌曲数量
const loading = ref(false)

// 分页相关状态
const page = ref(1)
const loadingMore = ref(false)
const hasMore = ref(true)
const PAGE_SIZE = 30

const LIST_ID = route.query.id || route.params.id // 获取路由参数中的歌单ID

// 获取歌单歌曲列表
const getMusicListSongs = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
  } else {
    loading.value = true
    page.value = 1
    hasMore.value = true
    musicListSongs.value = []
  }
  try {
    const res = await getMusicListSongsApi({
      id: LIST_ID,
      page: page.value,
      page_size: PAGE_SIZE
    })

    // 只有第一页才更新头部信息，避免不必要的刷新
    if (!isLoadMore) {
      musicListLength.value = res.data.count
      musicListInfo.value = res.data.list_info
    }

    const newSongs = handleSongsData(res.data.songs || [])

    if (isLoadMore) {
      musicListSongs.value = [...musicListSongs.value, ...newSongs]
      // 加载更多完成后，更新播放列表到 store
      // 只有在当前是"指定歌单模式"才需要推送，或者由 store 自己决定
      // 这里简单处理为每次更新都推送，因为如果是 loadMore 触发的，说明现在应该就是在这个歌单上下文
      musicSotre.setPlayList({
        count: musicListLength.value,
        data: musicListSongs.value
      })
    } else {
      musicListSongs.value = newSongs
    }

    // 判断是否还有更多数据
    if (
      musicListSongs.value.length >= res.data.count ||
      newSongs.length < PAGE_SIZE
    ) {
      hasMore.value = false
    } else {
      page.value++
    }
  } catch (err) {
    console.error(err)
    // 出错时如果是在加载更多，允许重试
    if (isLoadMore) loadingMore.value = false
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 处理歌曲数据格式
const handleSongsData = songs => {
  return songs
    .filter(song => !!song.hash) // 过滤无hash的歌曲
    .map(song => ({
      hash: song.hash,
      sizable_cover: song.cover || song.album_img || '',
      author_name: song.name.split('-')[0].trim(),
      ori_audio_name: song.name.split('-')[1].trim(),
      time_length: song.timelen || 0
    }))
}

// 初始加载
getMusicListSongs()

// 核心：注册给全局播放器调用的加载函数
const loadMoreForStore = async () => {
  // 可以直接调用 getMusicListSongs，因为 LIST_ID 已经被闭包捕获
  if (loadingMore.value || !hasMore.value) return
  await getMusicListSongs(true)
}

const handlePlayAll = () => {
  console.log('播放全部歌曲')
  musicSotre.setPlayList({
    count: musicListLength.value,
    data: musicListSongs.value
  })
  // 注册加载更多函数到Store
  musicSotre.setLoadMoreHandler(loadMoreForStore)

  // 播放第一首
  if (musicListSongs.value.length > 0) {
    musicSotre.switchCurrentMusic(musicListSongs.value[0].hash)
  }
}

const loadMore = () => {
  getMusicListSongs(true)
}
</script>

<template>
  <div
    class="playlist-detail-container content-scroll"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loadingMore || !hasMore"
    :infinite-scroll-distance="100"
    :infinite-scroll-immediate="false"
  >
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon> 加载中...
    </div>

    <div v-else>
      <!-- 头部信息 -->
      <PlaylistHeader @play="handlePlayAll" :info="musicListInfo" />

      <!-- 歌曲列表 -->
      <div class="song-list-wrapper">
        <SongList :songs="musicListSongs" :isSecond="false" :scrollable="false">
          <div class="list-header">歌曲{{ musicListLength }}</div>
        </SongList>
      </div>

      <!-- 底部加载状态 -->
      <div class="bottom-loading" v-if="loadingMore">
        <el-icon class="is-loading"><Loading /></el-icon> 正在加载更多...
      </div>
      <div class="no-more" v-if="!hasMore && musicListSongs.length > 0">
        没有更多歌曲了
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<style scoped lang="scss">
// 修复6：核心样式调整，确保全局滚动生效
.playlist-detail-container {
  padding: 0 30px;
  padding-bottom: 80px;
  max-width: 1400px;
  margin: 0 auto 80px;
  // 移除 height: 100vh 和 overflow-y: auto，让页面自然滚动以适配 v-infinite-scroll (通常绑定在 window 或具体容器)
  // 如果希望容器内滚动，则保留。ElementPlus的指令默认向上寻找 overflow 容器
  height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;

  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    color: $text-secondary;
    font-size: 16px;
    gap: 10px;
  }

  .song-list-wrapper {
    margin-top: 20px;
    border-radius: 16px;
    width: 100%;
    // 关键：不限制高度，让列表自然撑开，交由父容器滚动
    height: auto;

    .list-header {
      font-size: 20px;
      padding-left: 20px;
      color: $text-primary;
    }
  }

  .bottom-loading,
  .no-more {
    text-align: center;
    padding: 20px 0;
    color: $text-secondary;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .playlist-detail-container {
    padding: 16px;
  }
}
</style>
