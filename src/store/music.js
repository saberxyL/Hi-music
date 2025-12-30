import { defineStore } from 'pinia'
import { ref } from 'vue'

// 音乐相关的状态管理
export const useMusicStore = defineStore(
  'music',
  () => {
    const musicList = ref([])
    const currentMusic = ref(null)

    function setMusicList(list) {
      musicList.value = list
    }
    function setCurrentMusic(music) {
      currentMusic.value = music
    }

    return {
      musicList,
      currentMusic,
      setMusicList,
      setCurrentMusic
    }
  },
  {
    persist: true // 开启持久化
  }
)
