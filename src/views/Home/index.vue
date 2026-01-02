<script setup>
import FeaturedCard from './components/FeaturedCard.vue'
import SongList from './components/SongList.vue'
import PlaylistGrid from './components/PlaylistGrid.vue'

// 模拟推荐歌单数据
const recommendPlaylists = [
  {
    id: 1,
    title: '夜的第七章',
    artist: '周杰伦',
    cover:
      'https://p1.music.126.net/5zs7IvmLv7Szq9xdhGL26Q==/109951165421200265.jpg'
  },
  {
    id: 2,
    title: '晴天',
    artist: '周杰伦',
    cover:
      'https://p2.music.126.net/0-bTa6Y8sD5qVqJz5y5hIg==/109951165421200265.jpg'
  },
  {
    id: 3,
    title: '七里香',
    artist: '周杰伦',
    cover:
      'https://p2.music.126.net/ZSSns_j_y_q_y_q_y_q_y_q==/109951165421200265.jpg'
  },
  {
    id: 4,
    title: '稻香',
    artist: '周杰伦',
    cover:
      'https://p2.music.126.net/ZSSns_j_y_q_y_q_y_q_y_q==/109951165421200265.jpg'
  }
]

// 模拟排行榜数据
const topList = [
  { id: 1, title: '夜的第七章', artist: '周杰伦', duration: '3:46' },
  { id: 2, title: '晴天', artist: '周杰伦', duration: '4:29' },
  { id: 3, title: '七里香', artist: '周杰伦', duration: '4:58' },
  { id: 4, title: '稻香', artist: '周杰伦', duration: '3:43' },
  { id: 5, title: '青花瓷', artist: '周杰伦', duration: '3:57' }
]
</script>

<template>
  <div class="home-view">
    <!-- Banner / Featured -->
    <FeaturedCard />

    <div class="dashboard-grid">
      <!-- Playlist -->
      <SongList :songs="topList" />

      <!-- Recommended -->
      <PlaylistGrid :playlists="recommendPlaylists" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  width: 100%;

  .dashboard-grid {
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
