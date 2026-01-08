<script setup>
import { replaceImageSize } from '@/utils/img'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  playlists: {
    type: Array,
    default: () => []
  }
})
const router = useRouter()
const limitPlayList = computed(() => props.playlists.slice(0, 6))
</script>

<template>
  <section class="section-block">
    <div class="section-header">
      <h3>热门歌单</h3>
      <span class="more" @click="router.push(`/discover/hot`)">更多</span>
    </div>
    <div class="playlist-grid">
      <div
        v-for="list in limitPlayList"
        :key="list.specialid"
        class="playlist-card"
      >
        <div
          class="card-cover"
          :style="{
            backgroundImage: `url(${replaceImageSize(list?.imgurl, '400')})`
          }"
        ></div>
        <div class="card-title text-ellipsis-2">
          {{ list.specialname }}
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

    .more {
      font-size: 14px;
      color: $text-secondary;
      cursor: pointer;
      &:hover {
        color: $accent-color;
      }
    }
  }
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .playlist-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.05);
    }

    .card-cover {
      width: 100%;
      aspect-ratio: 1;
      background: #333;
      border-radius: 8px;
      margin-bottom: 10px;
      background-size: cover;
      background-position: center;
    }

    .card-title {
      font-size: 14px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: $text-primary;
    }
    &:last-child {
      position: relative;
      .card-cover {
        filter: blur(12px);
      }
      &::after {
        content: '···';
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #ccc;
        font-size: 60px;
      }
    }
  }
}
</style>
