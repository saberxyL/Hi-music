<script setup>
import { replaceImageSize } from '@/utils/img'
import { handleNum } from '@/utils/number'
import { useRouter } from 'vue-router'

const props = defineProps({
  singerList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const router = useRouter()
console.log('歌手列表组件收到的歌手数据:', props.singerList)
</script>

<template>
  <div
    class="singer-list"
    v-loading="loading"
    element-loading-background="transparent"
  >
    <div
      v-for="singer in singerList"
      :key="singer.singerid"
      class="singer-card"
      @click="router.push(`/singer?id=${singer.singerid}`)"
    >
      <div class="avatar-wrapper">
        <img
          :src="replaceImageSize(singer.imgurl, 240)"
          :alt="singer.singername"
          loading="lazy"
        />
      </div>
      <div class="info">
        <h3 class="name">{{ singer.singername }}</h3>
        <p class="fans">{{ handleNum(singer.fanscount) }} 粉丝</p>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!loading && singerList.length === 0" class="no-data">
      暂无相关歌手数据
    </div>
  </div>
</template>

<style scoped lang="scss">
.singer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px 24px;
  min-height: 200px;

  .singer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .avatar-wrapper {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 16px;
      border: 4px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(
          circle at center,
          transparent 40%,
          rgba(0, 0, 0, 0.4) 100%
        );
        opacity: 0;
        transition: opacity 0.3s;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
    }

    .info {
      text-align: center;
      transition: transform 0.3s;

      .name {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 6px;
        transition: color 0.3s;
      }

      .fans {
        font-size: 12px;
        color: $text-secondary;
      }
    }

    &:hover {
      .avatar-wrapper {
        border-color: $accent-color;
        box-shadow: 0 12px 30px rgba($accent-color, 0.25);
        transform: translateY(-6px) scale(1.05);

        &::after {
          opacity: 1;
        }

        img {
          transform: scale(1.1);
        }
      }

      .info {
        .name {
          color: $accent-color;
        }
      }
    }
  }

  .no-data {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 0;
    color: $text-secondary;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .singer-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 12px;

    .singer-card {
      .avatar-wrapper {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        border-width: 2px;
      }

      .info {
        .name {
          font-size: 13px;
        }
        .fans {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
