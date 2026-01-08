<script setup>
import { getMusicListSongsApi } from '@/api/list'
import { ref, watch } from 'vue'
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
      id: route.query.id || route.params.id, // 兼容 query 和 params
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

// 处理滚动事件，实现上拉加载更多
const handleScroll = e => {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  // 距离底部 100px 时触发出发加载
  if (scrollHeight - scrollTop - clientHeight < 100) {
    getMusicListSongs(true)
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
// 监听musicStore的播放列表加载更多需求
watch(
  [() => musicSotre.isNeedLoadMore, () => musicSotre.loadMoreTrigger],
  ([newVal, newTrigger], [oldVal, oldTrigger]) => {
    console.log(
      '监听到播放列表加载更多需求：',
      newVal,
      newTrigger,
      oldVal,
      oldTrigger
    )
    // 无论是自动播放触发(newVal)还是列表滚动触发(newTrigger变化)
    if (newVal || newTrigger !== oldTrigger) {
      // 如果已经请求了所有歌曲，则不再请求
      if (!hasMore.value) return
      console.log('播放列表需要加载更多歌曲')
      getMusicListSongs(true)
      // 注意：getMusicListSongs内部逻辑是直接更新musicListSongs.value
      // 我们需要在一个合适的时候更新 store。
      // 为简单起见，这里假设 getMusicListSongs 完成后会通过下面的逻辑推送到 setPlayList
      // 或者我们可以把 setPlayList 放在 getMusicListSongs 里？
      // 不，原来的逻辑是先 fetch，然后下面这行代码执行时，fetch还没完？
      // 不对，getMusicListSongs 是 async 的，但这里没 await。
      // 所以 musicSotre.setPlayList 会立即执行，但此时 data: musicListSongs.value 还是旧的？
      // 原来的逻辑可能有问题。getMusicListSongs(true) 是异步的。

      // 让我们修复原来的逻辑问题：应该等待 fetch 完成后再 setPlayList
    }
  }
)
const handlePlayAll = () => {
  console.log('播放全部歌曲')
  musicSotre.setPlayList({
    count: musicListLength.value,
    data: musicListSongs.value
  })
  // 播放第一首
  if (musicListSongs.value.length > 0) {
    musicSotre.switchCurrentMusic(musicListSongs.value[0].hash)
  }
}
</script>

<template>
  <div class="playlist-detail-container content-scroll" @scroll="handleScroll">
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
  height: 100vh;
  box-sizing: border-box; // 避免padding导致宽度溢出
  overflow-y: auto; // 开启全局滚动

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
