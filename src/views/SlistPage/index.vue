<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tagList } from '@/utils/tag'
import { getMusicListApi } from '@/api/recommend'
import MusicList from '@/components/MusicList.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const musicList = ref([])
const getHotMusicList = async () => {
  try {
    console.log('路由参数：', route.query)
    const res = await getMusicListApi({
      category_id: '0'
      // category_id: route.query.id || 0
    })
    musicList.value = res.data.special_list
    console.log('歌单', res)
  } catch (err) {
    console.error(err)
  }
}
getHotMusicList()

const currentTag = tagList.find(tag => tag.tag_id === (route.query.id || '0'))
const handleBack = () => {
  router.push('/discover/song-categories')
}
</script>

<template>
  <div>
    <div class="slist-page-container">
      <!-- Float Back Button -->
      <div class="back-btn-wrapper" @click="handleBack">
        <div class="icon-box">
          <el-icon><ArrowLeft /></el-icon>
          <span class="back-text">返回分类</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper content-scroll">
        <MusicList :headerInfo="currentTag" :musicList="musicList" />
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<style scoped lang="scss">
.slist-page-container {
  width: 100%;
  background: radial-gradient(circle at top left, #1a1c29 0%, $bg-dark 100%);
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  padding-bottom: 80px;

  .back-btn-wrapper {
    position: fixed;
    top: 32px;
    left: 40px;
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
      left: 30px;
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

  .content-wrapper {
    overflow-y: auto;
    width: 100%;
    margin: 0 auto;
    padding: 100px 60px 60px;
    animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .slist-page-container {
    .back-btn-wrapper {
      top: 20px;
      left: 20px;

      .icon-box {
        width: 36px;
        height: 36px;
        background: rgba(0, 0, 0, 0.3); // 移动端背景深一点
      }

      .back-text {
        display: none;
      }
    }

    .content-wrapper {
      padding: 80px 20px 30px;
    }
  }
}
</style>
