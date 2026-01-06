<script setup>
import { replaceImageSize } from '@/utils/img'
defineProps({
  banners: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="featured-section">
    <el-carousel
      aoutopaly
      :interval="3000"
      type="card"
      height="300px"
      indicator-position="none"
    >
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="featured-card">
          <div class="info">
            <h2 class="text-ellipis-3">{{ item.ori_audio_name }}</h2>
            <p class="text-ellipsis-2">{{ item.author_name }}</p>
            <span class="tag" v-if="item.rank_label">{{
              item.rank_label
            }}</span>
          </div>
          <div
            class="cover"
            :style="{
              backgroundImage: `url(${replaceImageSize(item.sizable_cover, 300)})`
            }"
          ></div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<style scoped lang="scss">
.featured-section {
  margin-bottom: 40px;
  // :deep(.el-carousel) {
  //   padding: 25px;
  //   padding-right: 55px;
  // }
  :deep(.el-carousel__container) {
    margin: 30px;
    margin-right: 80px;
  }
  :deep(.el-carousel__item) {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow:
        0 0 30px rgba(255, 255, 255, 0.3),
        inset 0 0 30px rgba(255, 255, 255, 0.15);
    }
  }

  :deep(.el-carousel__mask) {
    background-color: transparent;
  }

  .featured-card {
    height: 100%;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-sizing: border-box;
    background: linear-gradient(
      135deg,
      rgba(20, 30, 40, 0.9),
      rgba(10, 20, 30, 0.95)
    );

    .info {
      position: relative;
      z-index: 2;
      max-width: 55%;
      h2 {
        width: 150px;
        font-size: 36px;
        margin: 8px 0 12px;
        background: linear-gradient(to right, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p {
        color: $text-secondary;
        margin-bottom: 20px;
        font-size: 16px;
      }
      .tag {
        width: 320px;
        position: absolute;
        bottom: -50px;
        left: -100px;
        display: inline-block;
        padding: 6px 16px;
        background: rgba($accent-color, 0.15);
        border: 1px solid rgba($accent-color, 0.3);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.5;
        text-align: center;
        text-indent: 35px;
        letter-spacing: 1.5px;
        overflow: hidden;
        color: $accent-color;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 12px rgba($accent-color, 0.15);
        text-transform: uppercase;
      }

      .actions {
        display: flex;
        gap: 12px;

        .el-button {
          padding: 8px 20px;
          height: auto;

          .iconfont {
            margin-right: 4px;
            font-size: 14px;
          }
        }
      }
    }

    .cover {
      width: 220px;
      height: 220px;
      background: #333;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      transform: rotate(-5deg) translateY(10px);
      z-index: 2;
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 100%;
      background: radial-gradient(
        circle at center,
        rgba(0, 198, 251, 0.1),
        transparent 70%
      );
      pointer-events: none;
    }
  }
}

@media (max-width: 768px) {
  .featured-section {
    :deep(.el-carousel__container) {
      height: 360px !important;
    }

    .featured-card {
      flex-direction: column-reverse;
      padding: 20px;
      text-align: center;
      justify-content: center;

      .info {
        max-width: 100%;
        margin-top: 10px;

        h2 {
          font-size: 24px;
        }
        .actions {
          justify-content: center;
        }
      }

      .cover {
        width: 140px;
        height: 140px;
        margin-bottom: 10px;
        transform: rotate(0);
      }
    }
  }
}
</style>
