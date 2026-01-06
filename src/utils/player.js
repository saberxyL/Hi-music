import { Howl, Howler } from 'howler'
import Lyric from 'lyric-parser'

class Player {
  constructor() {
    this.howl = null
    this.lyric = null
    this.soundId = null
  }

  playAudio(url, autoPlay = true, onEnd) {
    if (this.howl) {
      this.howl.unload()
    }

    if (this.lyric) {
      this.lyric.stop()
      this.lyric = null
    }

    this.howl = new Howl({
      src: [url],
      html5: true,
      autoplay: autoPlay,
      onend: onEnd,
      onplay: id => {
        this.soundId = id
        if (this.lyric) {
          this.lyric.play()
        }
      },
      onpause: () => {
        this.lyric && this.lyric.stop()
      },
      onstop: () => {
        this.lyric && this.lyric.stop()
      }
    })
  }

  setPlayState(playing) {
    if (!this.howl) return

    if (playing) {
      if (!this.howl.playing()) {
        this.soundId ? this.howl.play(this.soundId) : this.howl.play()
      }
    } else {
      if (this.howl.playing()) {
        this.howl.pause()
      }
    }
  }

  setLyric(lrc, handler) {
    if (this.lyric) {
      this.lyric.stop()
    }
    this.lyric = new Lyric(lrc, handler)

    if (this.howl && this.howl.playing()) {
      this.lyric.seek(this.howl.seek() * 1000)
      this.lyric.play()
    }
  }

  // 音乐进度跳转
  seek(time) {
    if (this.howl) {
      if (this.soundId) {
        this.howl.seek(time, this.soundId) // 指定 soundId 以防多音轨
      } else {
        this.howl.seek(time) // 默认单音轨
      }

      if (this.lyric) {
        this.lyric.seek(time * 1000)
        if (this.howl.playing()) {
          this.lyric.stop()
          this.lyric.play()
        } else {
          this.lyric.stop()
        }
      }
    }
  }

  setVolume(val) {
    Howler.volume(val)
  }

  currentTime() {
    return this.howl ? this.howl.seek() : 0
  }

  // // 获取当前音频总时长
  // duration() {
  //   return this.howl ? this.howl.duration() : 0
  // }
  duration() {
    // console.log(this.howl)
    if (!this.howl) return 0

    // 拿到 howler 底层的原生 Audio 元素
    const audioNode = this.howl._sounds[0]?._node
    if (!audioNode || !audioNode.buffered || audioNode.buffered.length === 0) {
      return 0
    }

    // buffered 是一个 TimeRanges 对象，存储了已缓冲的时间段（可能是多个片段）
    // 取最后一个缓冲片段的结束时间，就是当前能播放的最大时长
    const lastBufferedRangeIndex = audioNode.buffered.length - 1
    const bufferedEndTime = audioNode.buffered.end(lastBufferedRangeIndex)

    return bufferedEndTime
  }
}

export default new Player()
