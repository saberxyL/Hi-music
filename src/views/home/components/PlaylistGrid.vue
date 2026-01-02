<script setup>
defineProps({
  playlists: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="section-block">
    <div class="section-header">
      <h3>推荐歌单</h3>
      <span class="more">更多</span>
    </div>
    <div class="playlist-grid">
      <div v-for="list in playlists" :key="list.id" class="playlist-card">
        <div
          class="card-cover"
          :style="{ backgroundImage: `url(${list.cover})` }"
        ></div>
        <div class="card-title">{{ list.title }}</div>
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
  }
}
</style>
