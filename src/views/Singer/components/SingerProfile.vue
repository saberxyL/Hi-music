<script setup>
defineProps({
  intro: {
    type: Array,
    default: () => []
  }
})

const scrollToSection = index => {
  const element = document.getElementById(`section-${index}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="singer-profile">
    <div v-if="intro.length === 0" class="empty">暂无歌手资料</div>

    <!--  主要内容区域 -->
    <div v-else class="content-left">
      <div
        v-for="(section, index) in intro"
        :key="index"
        :id="`section-${index}`"
        class="profile-section"
      >
        <h3 class="section-title">{{ section.title || '简介' }}</h3>
        <p class="section-content">{{ section.content }}</p>
      </div>
    </div>

    <!-- 侧边悬浮导航面板 -->
    <div class="profile-nav" v-if="intro.length > 0">
      <div
        v-for="(section, index) in intro"
        :key="index"
        class="nav-item"
        @click="scrollToSection(index)"
        :title="section.title"
      >
        {{ section.title[0] || '简介' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.singer-profile {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px 20px 0 0;
  color: $text-primary;
  position: relative;
  max-width: 1400px;

  .empty {
    text-align: center;
    color: $text-secondary;
    padding: 40px 0;
    width: 100%;
  }

  .content-left {
    flex: 1;
  }

  .profile-section {
    margin-bottom: 30px;

    .section-title {
      font-size: 18px;
      margin-bottom: 12px;
      font-weight: 600;
      color: $text-primary;
      border-left: 3px solid $accent-color;
      padding-left: 10px;
    }

    .section-content {
      font-size: 14px;
      line-height: 1.6;
      color: $text-secondary;
      white-space: pre-wrap;
      text-align: justify;
    }
  }

  .profile-nav {
    position: fixed;
    right: 40px;
    bottom: 160px; /* 位于 BackTop 上方 */
    width: 40px;
    height: 180px;
    background: transparent;
    padding: 10px;
    border-radius: 12px;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);

    .nav-item {
      font-size: 12px;
      color: $text-secondary;
      padding: 8px;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.profile-nav::-webkit-scrollbar {
  width: 4px;
}
.profile-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

@media (max-width: 1100px) {
  .profile-nav {
    display: none;
  }
}
</style>
