<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSingerDetailApi } from '@/api/singer'
import { replaceImageSize } from '@/utils/img'
import { handleNum } from '@/utils/number'
import BackTop from '@/components/BackTop.vue'

import SingerSongs from './components/SingerSongs.vue'
import SingerAlbums from './components/SingerAlbums.vue'
import SingerProfile from './components/SingerProfile.vue'

const route = useRoute()
const singerInfo = ref({})
const activeTab = ref('songs')
const songsRef = ref(null)
const albumsRef = ref(null)

const getSingerDetail = async () => {
  try {
    const res = await getSingerDetailApi(route.query.id)
    if (res.status === 1) {
      singerInfo.value = res.data
    }
  } catch (error) {
    console.error('获取歌手详情失败：', error)
  }
}

// Handle scroll for sticky bar and infinite scroll
const handleScroll = e => {
  const { scrollTop, clientHeight, scrollHeight } = e.target

  // Infinite scroll trigger (100px threshold)
  if (scrollHeight - scrollTop - clientHeight < 100) {
    if (activeTab.value === 'songs' && songsRef.value) {
      songsRef.value.loadMore()
    } else if (activeTab.value === 'albums' && albumsRef.value) {
      albumsRef.value.loadMore()
    }
  }
}

onMounted(() => {
  if (route.query.id) {
    getSingerDetail()
  }
})
</script>

<template>
  <div class="singer-page-container content-scroll" @scroll="handleScroll">
    <!-- 歌手头部信息 -->
    <div class="singer-header">
      <div class="header-content">
        <GoBack :top="20">返回上页</GoBack>
        <div class="avatar">
          <img
            v-if="singerInfo.sizable_avatar"
            :src="replaceImageSize(singerInfo.sizable_avatar, 200)"
            alt="avatar"
          />
        </div>
        <div class="info">
          <h1 class="name">{{ singerInfo.author_name }}</h1>
          <div class="meta-row">
            <span class="tag" v-if="singerInfo.birthday">
              <i class="iconfont icon-icon-date"></i> {{ singerInfo.birthday }}
            </span>
            <span class="tag" v-if="singerInfo.fansnums">
              <i class="iconfont icon-icon-fans"></i>
              {{ handleNum(singerInfo.fansnums) }}粉丝
            </span>
          </div>
          <div class="intro text-ellipsis-3" :title="singerInfo.intro">
            {{ singerInfo.intro }}
          </div>
        </div>
      </div>
      <!-- 头部背景 -->
      <div
        class="header-bg"
        :style="
          singerInfo.sizable_avatar
            ? `background-image: url(${replaceImageSize(singerInfo.sizable_avatar, 400)})`
            : ''
        "
      ></div>
    </div>

    <!-- 粘性导航栏  -->
    <div class="sticky-bar">
      <div class="nav-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'songs' }"
          @click="activeTab = 'songs'"
        >
          单曲 {{ singerInfo.song_count || 0 }}
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'albums' }"
          @click="activeTab = 'albums'"
        >
          专辑 {{ singerInfo.album_count || 0 }}
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          歌手资料
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 单曲 -->
      <SingerSongs
        v-if="activeTab === 'songs'"
        :singer-id="route.query.id"
        ref="songsRef"
      />
      <!-- 专辑  -->
      <SingerAlbums
        v-if="activeTab === 'albums'"
        :singer-id="route.query.id"
        ref="albumsRef"
      />
      <!-- 歌手资料  -->
      <SingerProfile
        v-if="activeTab === 'profile'"
        :intro="singerInfo.long_intro || []"
      />
    </div>

    <BackTop />
  </div>
</template>

<style scoped lang="scss">
.singer-page-container {
  height: 100vh;
  overflow-y: auto;
  position: relative;
  margin-bottom: 80px;
  background: radial-gradient(circle at bottom left, #1a1f35 0%, #050505 100%);

  .singer-header {
    position: relative;
    padding: 40px 80px;
    height: 260px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(3px) brightness(0.4);
      z-index: 1;
      transform: scale(1.1);
    }

    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;

      .avatar {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info {
        flex: 1;
        color: #fff;

        .name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .meta-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;

          .tag {
            background: rgba(0, 0, 0, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 4px;

            i {
              font-size: 14px;
            }
          }
        }

        .intro {
          font-size: 14px;
          opacity: 0.8;
          line-height: 1.6;
          max-width: 600px;
        }
      }
    }
  }

  .sticky-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    padding: 10px 60px;

    .nav-tabs {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 40px;

      .tab-item {
        padding: 14px 0;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        position: relative;
        transition: all 0.3s ease;
        letter-spacing: 1px;

        &.active {
          color: $accent-color;

          &::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 4px;
            background: $accent-color;
            border-radius: 4px;
          }
        }

        &:hover {
          color: $text-primary;

          &.active {
            color: $accent-color;
          }
        }
      }
    }
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto 80px;
    min-height: 500px;
    padding: 20px 30px 0;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.4);
  }
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

@media (max-width: 768px) {
  .singer-page-container {
    .singer-header {
      height: auto;
      padding: 30px 20px;

      .header-content {
        flex-direction: column;
        text-align: center;

        .meta-row {
          justify-content: center;
        }

        .intro {
          margin: 0 auto;
        }
      }
    }

    .sticky-bar {
      padding: 0 10px;
      .nav-tabs {
        justify-content: space-around;
        gap: 10px;
      }
    }

    .content-wrapper {
      padding: 0 16px;
    }
  }
}
</style>
