<script setup>
import { replaceImageSize } from '@/utils/img'
import { handleNum } from '@/utils/number'
import { useRouter } from 'vue-router'
defineProps({
  musicList: {
    type: Array,
    default: () => []
  },
  headerInfo: {
    type: Object,
    default: () => ({
      tag_id: '0',
      tag_name: 'Hi-Music',
      des: 'Hi音乐精选歌单，涵盖多种风格，总有一款适合你。'
    })
  }
})
const router = useRouter()
const routerPush = id => {
  console.log(111)

  router.push({
    path: '/slist-page/detail',
    query: {
      id
    }
  })
}

const handlePlay = () => {
  console.log('播放全部音乐')
}
</script>

<template>
  <div class="music-list-wrapper">
    <!-- Header Section -->
    <div class="header-section">
      <div class="title-row">
        <h2 class="section-title">{{ headerInfo.tag_name }}</h2>
        <button class="play-all-btn">
          <span class="icon iconfont icon-video-play"></span>
          全部播放
        </button>
      </div>
      <p class="description">{{ headerInfo.des }}</p>
    </div>

    <!-- Grid Section -->
    <div class="card-grid">
      <div v-for="item in musicList" :key="item.id" class="music-card">
        <div class="cover-box">
          <img
            :src="replaceImageSize(item.imgurl, 240)"
            :alt="item.specialname"
            loading="lazy"
          />
          <div class="play-count">
            <svg viewBox="0 0 24 24" class="icon">
              <path
                fill="currentColor"
                d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28 4.5 4.5 0 1 0 4.5 4.5V6h4V3h-7z"
              />
            </svg>
            {{ handleNum(item.play_count) }}
          </div>
          <div class="overlay" @click="routerPush(item.global_collection_id)">
            <div class="play-btn" @click.stop="handlePlay">
              <span class="icon iconfont icon-video-play"></span>
            </div>
          </div>
        </div>
        <div class="info-box">
          <h3
            class="name"
            @click="routerPush(item.global_collection_id)"
            :title="item.title"
          >
            {{ item.specialname }}
          </h3>
          <div class="subtitle">{{ item.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.music-list-wrapper {
  width: 100%;
  color: $text-primary;

  .header-section {
    margin: 10px 0 30px;

    .title-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 12px;

      .section-title {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: 2px;
        margin: 0;
      }

      .play-all-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 20px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        .icon {
          width: 16px;
          height: 16px;
          border: 1px;
        }

        &:hover {
          border: 1px solid rgba(255, 255, 255, 0.9);
          background-color: $accent-color;
        }
      }
    }

    .description {
      color: $text-secondary;
      font-size: 14px;
      line-height: 1.6;
      max-width: 800px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .card-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 24px;

    .music-card {
      .cover-box {
        position: relative;
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 12px;
        background: #222;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.05);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .play-count {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 2;

          .icon {
            width: 14px;
            height: 14px;
          }
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 3;

          .play-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            color: $griy-color;
            text-align: center;
            line-height: 60px;
            transform: scale(0.8);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
        }

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);

          img {
            transform: scale(1.1);
          }

          .overlay {
            opacity: 1;
          }
        }
      }

      .info-box {
        .name {
          font-size: 15px;
          font-weight: 600;
          color: $text-primary;
          margin: 0 0 6px 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; // 限制两行
          -webkit-box-orient: vertical;
          transition: color 0.2s;

          &:hover {
            color: $accent-color;
            cursor: pointer;
          }
        }

        .subtitle {
          font-size: 13px;
          color: $text-secondary;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .music-list-wrapper {
    .header-section {
      .section-title {
        font-size: 20px;
      }
      .play-all-btn {
        padding: 6px 16px;
        font-size: 12px;
      }
    }

    .card-grid {
      grid-template-columns: repeat(100px, 1fr); // 移动端每行2个
      gap: 16px;

      .music-card {
        .info-box .name {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
