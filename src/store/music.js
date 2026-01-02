import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMusicStore = defineStore(
  'music',
  () => {
    // 状态
    const musicList = ref([])
    const currentIndex = ref(-1)
    const isPlaying = ref(false)
    const playMode = ref('sequence') // sequence, loop, random
    const volume = ref(50)
    const showPlayList = ref(false) // 播放列表显示状态

    // 计算属性：当前播放音乐
    const currentMusic = computed(() => {
      if (
        currentIndex.value >= 0 &&
        currentIndex.value < musicList.value.length
      ) {
        return musicList.value[currentIndex.value]
      }
      return null
    })

    // Actions
    function setMusicList(list) {
      musicList.value = list
    }

    function playMusic(music) {
      const index = musicList.value.findIndex(item => item.id === music.id)
      if (index !== -1) {
        currentIndex.value = index
        isPlaying.value = true
      } else {
        // 如果不在列表中，添加到列表末尾并播放
        musicList.value.push(music)
        currentIndex.value = musicList.value.length - 1
        isPlaying.value = true
      }
    }

    function togglePlay() {
      isPlaying.value = !isPlaying.value
    }

    function setPlaying(status) {
      isPlaying.value = status
    }

    function nextMusic() {
      if (musicList.value.length === 0) return

      if (playMode.value === 'random') {
        currentIndex.value = Math.floor(Math.random() * musicList.value.length)
      } else {
        currentIndex.value = (currentIndex.value + 1) % musicList.value.length
      }
      isPlaying.value = true
    }

    function prevMusic() {
      if (musicList.value.length === 0) return

      if (playMode.value === 'random') {
        currentIndex.value = Math.floor(Math.random() * musicList.value.length)
      } else {
        currentIndex.value =
          (currentIndex.value - 1 + musicList.value.length) %
          musicList.value.length
      }
      isPlaying.value = true
    }

    function togglePlayList() {
      showPlayList.value = !showPlayList.value
    }

    return {
      musicList,
      currentIndex,
      currentMusic,
      isPlaying,
      playMode,
      volume,
      showPlayList,
      setMusicList,
      playMusic,
      togglePlay,
      setPlaying,
      nextMusic,
      prevMusic,
      togglePlayList
    }
  },
  {
    persist: true
  }
)
