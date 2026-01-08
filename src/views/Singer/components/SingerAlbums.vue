<script setup>
import { ref, onMounted } from 'vue'
import { getSingerAlbumApi } from '@/api/singer'
import { replaceImageSize } from '@/utils/img'
import { handleNum } from '@/utils/number'

const props = defineProps({
  singerId: {
    type: [Number, String],
    required: true
  }
})

const albums = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const showDialog = ref(false)
const currentAlbum = ref({})

const fetchAlbums = async (isLoadMore = false) => {
  if (loading.value) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const res = await getSingerAlbumApi({
      id: props.singerId,
      page: page.value,
      pagesize: 30
    })

    if (res.status === 1) {
      const newAlbums = res.data
      if (isLoadMore) {
        albums.value = [...albums.value, ...newAlbums]
      } else {
        albums.value = newAlbums
      }

      if (albums.value.length >= res.data.total || newAlbums.length === 0) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDetail = album => {
  currentAlbum.value = album
  showDialog.value = true
}

const loadMore = () => {
  fetchAlbums(true)
}

defineExpose({
  loadMore
})

onMounted(() => {
  fetchAlbums()
})
</script>

<template>
  <div class="singer-albums">
    <div class="album-list">
      <div v-for="album in albums" :key="album.album_id" class="album-item">
        <div class="cover-wrapper">
          <img
            :src="replaceImageSize(album.sizable_cover, 150)"
            alt="cover"
            loading="lazy"
          />
          <div class="album-bg"></div>
        </div>

        <div class="info">
          <div class="name text-ellipsis" :title="album.album_name">
            {{ album.album_name }}
          </div>
          <div class="date">{{ album.publish_date.split(' ')[0] }}</div>
        </div>

        <button class="detail-btn" @click.stop="openDetail(album)">详情</button>
      </div>
    </div>

    <div v-if="loading" class="loading-text">加载中...</div>
    <div v-if="!hasMore && albums.length > 0" class="no-more-text">
      没有更多了
    </div>

    <!-- Album Detail Dialog -->
    <el-dialog
      v-model="showDialog"
      :show-close="false"
      align-center
      width="750px"
      class="album-detail-dialog"
      append-to-body
      destroy-on-close
    >
      <div class="modal-content-wrapper">
        <!-- 模糊背景层 -->
        <div
          class="modal-bg"
          :style="
            currentAlbum.sizable_cover
              ? `background-image: url(${replaceImageSize(currentAlbum.sizable_cover, 200)})`
              : ''
          "
        ></div>

        <div class="modal-body">
          <div class="close-btn" @click="showDialog = false" title="关闭弹窗">
            <el-icon><Close /></el-icon>
          </div>

          <el-scrollbar height="100%">
            <div class="scroll-inner">
              <!-- 头部：封面与核心信息 -->
              <div class="dialog-header">
                <div class="album-cover">
                  <img
                    :src="replaceImageSize(currentAlbum.sizable_cover, 400)"
                    alt="cover"
                  />
                </div>
                <div class="album-main-info">
                  <h2 class="title">{{ currentAlbum.album_name }}</h2>
                  <div class="singer">{{ currentAlbum.author_name }}</div>

                  <div class="meta-info">
                    <div
                      class="tags-row"
                      v-if="currentAlbum.language || currentAlbum.type"
                    >
                      <el-tag
                        v-if="currentAlbum.language"
                        effect="dark"
                        type="info"
                        size="small"
                        round
                        class="meta-tag"
                        >{{ currentAlbum.language }}</el-tag
                      >
                      <el-tag
                        v-if="currentAlbum.type"
                        effect="dark"
                        type="info"
                        size="small"
                        round
                        class="meta-tag"
                        >{{ currentAlbum.type }}</el-tag
                      >
                    </div>
                    <div class="meta-row">
                      <span class="label">发行时间：</span
                      >{{ currentAlbum.publish_date?.split(' ')[0] }}
                    </div>
                    <div class="meta-row">
                      <span class="label">唱片公司：</span
                      >{{ currentAlbum.publish_company }}
                    </div>
                    <div class="meta-row stats">
                      <span v-if="currentAlbum.grade">
                        <span class="label">评分：</span>
                        <span class="score">{{ currentAlbum.grade }}</span>
                        <span class="count" v-if="currentAlbum.grade_count"
                          >({{ handleNum(currentAlbum.grade_count) }}人)</span
                        >
                      </span>
                      <span
                        class="divider"
                        v-if="currentAlbum.heat && currentAlbum.grade"
                        >|</span
                      >
                      <span v-if="currentAlbum.heat">
                        <span class="label">热度：</span
                        >{{ handleNum(currentAlbum.heat) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 简介内容 -->
              <div class="dialog-content">
                <h3 class="section-title">专辑介绍</h3>
                <div class="intro-text">
                  {{ currentAlbum.intro || '暂无简介' }}
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.singer-albums {
  padding-top: 10px;
  .album-list {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
  }

  .album-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 8px;
    transition: background 0.2s;
    &:nth-child(2n + 1) {
      background: rgba(255, 255, 255, 0.05);
    }
    &:hover {
      background: rgba(255, 255, 255, 0.08);

      .detail-btn {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .cover-wrapper {
      position: relative;
      width: 60px;
      height: 60px;
      margin-right: 20px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        position: relative;
        z-index: 2;
      }

      .album-bg {
        position: absolute;
        top: 0;
        right: -8px;
        width: 100%;
        height: 100%;
        background: url('@/assets/images/disc.png') no-repeat center/contain;
        background-color: #000;
        border-radius: 50%;
        z-index: 1;
      }
    }

    .info {
      flex: 1;

      .name {
        font-size: 16px;
        color: $text-primary;
        margin-bottom: 5px;
        font-weight: 500;
      }

      .date {
        font-size: 13px;
        color: $text-secondary;
      }
    }

    .detail-btn {
      padding: 6px 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: transparent;
      color: $text-primary;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;

      &:hover {
        border-color: $accent-color;
        color: $accent-color;
      }

      @media (max-width: 768px) {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  .loading-text,
  .no-more-text {
    text-align: center;
    padding: 20px;
    color: $text-secondary;
    font-size: 13px;
  }
}

// 弹窗内部样式
.modal-content-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 动态模糊背景层
.modal-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.5);
  z-index: 1;
  transform: scale(1.2);
}

.modal-body {
  position: relative;
  z-index: 2;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255, 255, 255, 0.6);
  z-index: 20;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    transform: rotate(90deg);
  }

  .el-icon {
    font-size: 20px;
  }
}

.scroll-inner {
  padding: 40px;
}

.dialog-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  align-items: flex-start;

  .album-cover {
    width: 160px;
    height: 160px;
    flex-shrink: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .album-main-info {
    flex: 1;
    padding-top: 0;

    .title {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 10px 0;
      line-height: 1.3;
    }

    .singer {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20px;
    }

    .meta-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .tags-row {
        display: flex;
        gap: 8px;
        margin-bottom: 4px;

        .meta-tag {
          border: none;
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .meta-row {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;

        .label {
          color: rgba(255, 255, 255, 0.4);
          margin-right: 5px;
        }

        &.stats {
          margin-top: 5px;

          .score {
            color: $accent-color;
            font-size: 16px;
            font-weight: bold;
            margin: 0 3px;
          }
          .count {
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          }
          .divider {
            margin: 0 10px;
            color: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }
  }
}

.dialog-content {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 25px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
  }

  .intro-text {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    white-space: pre-wrap;
    text-align: justify;
  }
}

@media (max-width: 600px) {
  .scroll-inner {
    padding: 50px 20px 30px;
  }

  .dialog-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;

    .album-cover {
      width: 140px;
      height: 140px;
    }

    .meta-info {
      align-items: center;
    }
  }
}
</style>

<style lang="scss">
.album-detail-dialog {
  background: transparent !important;
  box-shadow: none !important;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0 !important;
    height: 85vh;
    background: #1a1a1a;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
