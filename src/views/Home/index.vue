<script setup>
import FeaturedCard from './components/FeaturedCard.vue'
import PlaylistGrid from './components/PlaylistGrid.vue'
import {
  getEverydayRecommendApi,
  getSpecialListApi,
  getHomeBannerApi
} from '@/api/recommend'
import { ref } from 'vue'

const bannerList = ref([])
// 获取首页轮播
const getHomeBanner = async () => {
  try {
    const res = await getHomeBannerApi()
    bannerList.value = res.data.song_list.splice(0, 5)
    console.log('首页轮播：', res)
  } catch (error) {
    console.error('获取首页轮播失败：', error)
  }
}
getHomeBanner()
// 获取每日推荐歌单
const everydayRecommendList = ref([])
const getEverydayRecommendList = async () => {
  try {
    const res = await getEverydayRecommendApi()
    console.log('每日推荐：', res)
    everydayRecommendList.value = res.data.song_list
  } catch (error) {
    console.error('获取每日推荐歌单失败：', error)
  }
}
getEverydayRecommendList()

// 获取精选歌单
const special_list = ref([])
const getSpecialList = async () => {
  try {
    const res = await getSpecialListApi()
    console.log('精选歌单：', res)
    special_list.value = res.data.special_list
  } catch (error) {
    console.error('获取音乐分类失败：', error)
  }
}
getSpecialList()
</script>

<template>
  <div class="home-view">
    <!-- Banner / Featured -->
    <FeaturedCard :banners="bannerList" />

    <div class="dashboard-grid">
      <!-- Playlist -->
      <SongList class="song_list" height="620" :songs="everydayRecommendList" />

      <!-- Recommended -->
      <PlaylistGrid :playlists="special_list" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  width: 100%;

  .dashboard-grid {
    height: 650px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
  }
}

// Responsive
@media (max-width: 768px) {
  .home-view {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
