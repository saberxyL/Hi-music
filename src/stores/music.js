import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMusicUrlApi, getMusicLyricApi, getLyricApi } from '@/api/music'

export const useMusicStore = defineStore(
  'music',
  () => {
    const isPlaying = ref(false) // 播放状态
    const currentSong = ref(null) // 当前播放的歌曲对象
    const playMode = ref('sequence') // 播放模式：sequence, loop, random
    const currentTime = ref(0) // 当前播放时间 (秒)
    const song_lyric = ref('') // 歌词
    const currentLyric = ref('听见好音乐') // 当前歌词
    const curr_lyric_index = ref(0) // 当前歌词索引
    const volume = ref(0) // 音量，范围0-100
    const song_list = ref([]) // 历史播放列表
    const song_cache = ref({}) // 歌曲缓存
    const showPlayList = ref(false) // 播放列表显示状态
    const play_list_obj = ref({
      count: 0, // 歌单总数量不是data长度
      data: [] // 播放列表数据
    }) // 指定播放列表
    const current_type = ref('history') //  播放列表默认类型 history, playList
    const loadMoreTrigger = ref(0) // 加载更多触发器

    const isNeedLoadMore = computed(() => {
      // 提前3首判断
      return currentSongIndex.value >= play_list_obj.value.count - 3
    })
    // 计算属性：当前歌曲的总时长
    const duration = computed(() => {
      return currentSong.value ? currentSong.value.time_length / 1000 : 0
    })

    // 计算属性：当前歌曲的URL
    const currentSongUrl = computed(() => {
      return currentSong.value ? currentSong.value.url : '目前没有播放的歌曲'
    })

    // 当前歌曲索引
    const currentSongIndex = computed(() => {
      let index = null
      if (current_type.value === 'playList') {
        index = play_list_obj.value.data.findIndex(
          item => item.hash === currentSong.value?.hash
        )
      } else {
        index = song_list.value.findIndex(
          item => item.hash === currentSong.value?.hash
        )
      }
      return index
    })

    // 获取歌曲信息
    async function getSongInfo(params) {
      if (!params?.hash) return
      try {
        const res = await getMusicUrlApi(params)
        console.log('获取到的音乐信息：', res)
        // 统一映射
        currentSong.value = {
          hash: res.data[0].hash, // 歌曲唯一标识
          url: res.data[0].info.climax_info.url[0], // 歌曲播放地址
          sizable_cover: res.data[0].info.image, // 歌曲封面
          name: res.data[0].name, // 歌手-歌曲名称
          author_name: res.data[0].singername, // 歌手名称
          ori_audio_name: res.data[0].name.split('-')[1], // 原始歌曲名称
          time_length: res.data[0].info.duration // 歌曲时长
        }
        addToSongList(currentSong.value) // 添加到历史播放列表
        song_cache.value[currentSong.value.hash] = currentSong.value // 缓存歌曲信息
      } catch (error) {
        console.error('Failed to get song info:', error)
      }
    }

    //  获取歌词
    async function getLyric(hash = '') {
      hash = hash || currentSong.value?.hash
      if (!hash) return

      try {
        const res = await getMusicLyricApi(hash)
        console.log('获取到的音乐查询信息：', res)
        if (res?.status === 200 && res?.candidates?.length > 0) {
          try {
            const lyricRes = await getLyricApi({
              id: res.candidates[0].id,
              accesskey: res.candidates[0].accesskey,
              fmt: 'lrc',
              decode: true
            })
            song_lyric.value =
              lyricRes.decodeContent || lyricRes.content || lyricRes
            console.log('获取到的歌词信息：', lyricRes)
          } catch (err) {
            console.error('获取歌词失败', err)
          }
        }
      } catch (error) {
        console.error('获取歌词失败:', error)
      }
    }

    // 切换音乐 value: -1 下一首 1 上一首,注意当前播放模式
    function autoPlayMusic(value = -1) {
      let newIndex = currentSongIndex.value + value
      const listLength = // 播放列表长度
        current_type.value === 'history'
          ? song_list.value.length // 播放历史列表长度
          : play_list_obj.value.count // 指定播放列表长度

      if (playMode.value === 'loop') {
        // 循环模式，保持当前索引不变
        newIndex = currentSongIndex.value
      } else if (playMode.value === 'random') {
        // 随机模式，生成一个随机索引
        newIndex = Math.floor(Math.random() * listLength)
      } else {
        // 顺序模式，处理边界情况
        if (newIndex < 0) {
          newIndex = listLength - 1 // 跳到最后一首
        } else if (newIndex >= listLength) {
          newIndex = 0 // 跳到第一首
        }
      }

      // 播放新的歌曲
      const nextSong =
        current_type.value === 'history'
          ? song_list.value[newIndex] // 播放历史列表中的歌曲
          : play_list_obj.value.data[newIndex] // 指定播放列表中的歌曲
      if (nextSong) {
        switchCurrentMusic(nextSong.hash)
      }
    }

    // 切换当前播放的音乐
    function switchCurrentMusic(hash, isPlay = true) {
      if (hash === null) {
        //没有要切换的歌曲则退出
        return
      }
      // 先重置状态
      resetCurrentSongState()
      if (song_cache.value[hash]) {
        currentSong.value = song_cache.value[hash]
      } else {
        // 指定播放音乐
        getSongInfo({ hash })
      }
      isPlaying.value = isPlay
      // 获取歌词
      getLyric(hash)
    }

    // 添加音乐到历史播放列表
    function addToSongList(song) {
      const exists = song_list.value.some(item => item.hash === song.hash)
      // 如果歌曲不存在则添加
      if (!exists) {
        song_list.value.unshift(song)
      }
    }
    // 推入指定歌单
    function setPlayList(play_obj) {
      // 切换模式
      current_type.value = 'playList'
      play_list_obj.value = {
        count: play_obj.count,
        data: play_obj.data
      }
    }
    // 重置当前播放歌曲的状态
    function resetCurrentSongState() {
      currentSong.value = null
      currentTime.value = 0 // 当前播放时间
      song_lyric.value = ''
      currentLyric.value = '听见好音乐'
      curr_lyric_index.value = 0 // 当前歌词索引
    }
    // 触发加载更多
    function reqLoadMore() {
      loadMoreTrigger.value++
    }
    return {
      currentSong,
      isPlaying,
      playMode,
      currentTime,
      song_lyric,
      currentLyric,
      curr_lyric_index,
      volume,
      song_list,
      play_list_obj,
      duration,
      currentSongUrl,
      current_type,
      currentSongIndex,
      showPlayList,
      isNeedLoadMore,
      loadMoreTrigger,
      getSongInfo,
      getLyric,
      switchCurrentMusic,
      autoPlayMusic,
      addToSongList,
      setPlayList,
      resetCurrentSongState,
      reqLoadMore
    }
  },
  {
    persist: {
      paths: ['currentSong', 'volume', 'song_list', 'playMode'] // 指定需要持久化的状态字段
    }
  }
)
