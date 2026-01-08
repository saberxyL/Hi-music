<script setup>
import { replaceImageSize } from '@/utils/img'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

defineProps({
  info: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['play'])
const handlePlay = () => {
  console.log('播放全部歌曲')
  // 通知父组件播放
  emit('play')
}
</script>

<template>
  <div class="header-container" v-if="info">
    <!-- 背景虚化层 -->
    <div
      class="header-bg"
      :style="{ backgroundImage: `url(${replaceImageSize(info.pic, 400)})` }"
    ></div>

    <!-- 返回按钮 -->
    <div class="back-btn-wrapper" @click="router.back()">
      <div class="icon-box">
        <el-icon><ArrowLeft /></el-icon>
        <span class="back-text">返回上页</span>
      </div>
    </div>

    <div class="header-content">
      <!-- 左侧封面 -->
      <div class="cover-wrapper">
        <img
          :src="replaceImageSize(info.pic, 400)"
          alt="cover"
          class="cover-img"
        />
        <div class="tags-badge" v-if="info.sort">No.{{ info.sort }}</div>
      </div>

      <!-- 右侧信息 -->
      <div class="info-wrapper">
        <h1 class="title">{{ info.name }}</h1>

        <!-- 创建者信息 -->
        <div class="creator" v-if="info.list_create_username">
          <img
            :src="replaceImageSize(info.create_user_pic, 60)"
            class="avatar"
            alt="avatar"
          />
          <span class="nickname">{{ info.list_create_username }}</span>
          <span class="tags" v-if="info.tags">
            <span
              v-for="tag in info.tags.split(' ')"
              :key="tag"
              class="tag-item"
              >#{{ tag }}</span
            >
          </span>
        </div>

        <!-- 简介 -->
        <div
          class="intro text-ellipsis-2"
          v-if="info.intro"
          :title="info.intro"
        >
          {{ info.intro }}
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button class="play-all-btn" @click="handlePlay">
            <i class="iconfont icon-video-play"></i> 播放
          </button>
          <!-- <button class="collect-btn">
            <i class="iconfont icon-collect"></i> 收藏
            ({{ info.collect_total || 0 }})
          </button>
          <button class="more-btn">
            <i class="iconfont icon-more"></i>
            <span>...</span>
          </button>
            -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  position: relative;
  padding: 30px;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
  color: #fff;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(6px) brightness(0.5);
  z-index: 0;
  transform: scale(1.1);
}

.back-btn-wrapper {
  position: fixed;
  top: 12px;
  left: 70px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  .icon-box {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: rgba(255, 255, 255, 0.7);
    overflow: hidden;

    .el-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 20px;
      transition: transform 0.3s ease;
    }

    .back-text {
      position: absolute;
      top: 50%;
      left: 100px;
      display: inline-block;
      opacity: 0;
      text-wrap: nowrap;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      transform: translate(0, -50%);
      transition: all 0.3s ease;
      pointer-events: none; // 防止文字阻挡点击
    }
  }

  &:hover {
    left: 60px;
    .icon-box {
      background: $accent-color;
      border-color: $accent-color;
      color: #fff;
      width: 120px;
      box-shadow: 0 8px 20px rgba($accent-color, 0.4);

      .el-icon {
        transform: translateY(-50%); // 箭头小动画
      }
      .back-text {
        opacity: 1;
        left: 35px;
        top: 50%;
        color: #fff;
      }
    }
  }
}
.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
}

.cover-wrapper {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  position: relative;

  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tags-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: $accent-color;
    color: #fff;
    padding: 2px 8px;
    font-size: 12px;
    border-bottom-left-radius: 8px;
  }
}

.info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .creator {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .nickname {
      font-weight: 500;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .tags {
      margin-left: 10px;
      display: flex;
      gap: 5px;
      .tag-item {
        opacity: 0.8;
      }
    }
  }

  .intro {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 24px;
    line-height: 1.5;
    max-width: 800px;
  }

  .actions {
    display: flex;
    gap: 15px;

    button {
      height: 40px;
      border-radius: 20px;
      border: none;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;

      i,
      .el-icon {
        font-size: 18px;
      }
    }

    .play-all-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      backdrop-filter: blur(10px);
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .collect-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      backdrop-filter: blur(10px);
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .more-btn {
      width: 40px;
      padding: 0;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 50%;
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: center;
    text-align: center;
    margin-top: 40px;
  }

  .cover-wrapper {
    width: 160px;
    height: 160px;
  }

  .info-wrapper {
    width: 100%;
    min-height: auto;
    align-items: center;

    .title {
      font-size: 20px;
      margin-bottom: 12px;
    }

    .creator {
      justify-content: center;
    }

    .meta-info {
      text-align: left;
      width: 100%;
    }

    .actions {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
