<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { tagList } from '@/utils/tag'
import { getMusicListApi } from '@/api/recommend'
import MusicList from '@/components/MusicList.vue'

const route = useRoute()

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
</script>

<template>
  <div>
    <div class="slist-page-container">
      <!-- Float Back Button -->
      <GoBack>返回分类</GoBack>

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

  .content-wrapper {
    overflow-y: auto;
    width: 100%;
    margin: 0 auto;
    padding: 50px 60px 60px;
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
