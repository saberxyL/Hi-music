<script setup>
import MusicList from '@/components/MusicList.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { getMusicListApi } from '@/api/recommend'
import { tagList } from '@/utils/tag'
const route = useRoute()

const hotMusicList = ref()
const getHotMusicList = async () => {
  try {
    const res = await getMusicListApi({
      category_id: 0
    })
    hotMusicList.value = res.data.special_list
    console.log('歌单', res)
  } catch (err) {
    console.error(err)
  }
}
getHotMusicList()

const currentTag = tagList.find(tag => tag.tag_id === (route.params.id || '0'))
</script>

<template>
  <div>
    <div class="hot-list-view content-scroll">
      <MusicList :musicList="hotMusicList" :headerInfo="currentTag" />
    </div>
    <BackTop></BackTop>
  </div>
</template>
