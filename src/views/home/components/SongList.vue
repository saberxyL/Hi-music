<script setup>
defineProps({
  songs: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="section-block">
    <div class="section-header">
      <h3>播放列表</h3>
      <span class="more">查看全部</span>
    </div>
    <div class="song-list">
      <div v-for="(song, index) in songs" :key="song.id" class="song-item">
        <span class="index">{{ index + 1 }}</span>
        <div class="song-info">
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
        <div class="duration">{{ song.duration }}</div>
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

.song-list {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 10px;

  .song-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .index {
      width: 30px;
      color: $text-secondary;
      font-size: 14px;
    }

    .song-info {
      flex: 1;

      .title {
        font-size: 15px;
        margin-bottom: 4px;
        color: $text-primary;
      }

      .artist {
        font-size: 12px;
        color: $text-secondary;
      }
    }

    .duration {
      color: $text-secondary;
      font-size: 13px;
    }
  }
}
</style>
