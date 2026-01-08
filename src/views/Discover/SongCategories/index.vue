<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCategoriesApi } from '@/api/recommend'
import BackTop from '@/components/BackTop.vue'

const router = useRouter()
const categories = ref([])

const getCategories = async () => {
  try {
    const res = await getCategoriesApi()
    // 根据返回数据结构，res.data 是分类数组
    categories.value = res.data || []
  } catch (error) {
    console.error('获取歌单分类失败：', error)
  }
}
getCategories()

const handleTagClick = item => {
  router.push({
    path: '/slist-page',
    query: {
      id: item.tag_id
    }
  })
}
</script>

<template>
  <div>
    <div class="categories-container content-scroll">
      <div class="header">
        <h1 class="page-title">歌单分类</h1>
      </div>

      <div class="categories-list">
        <div
          v-for="group in categories"
          :key="group.tag_id"
          class="category-group"
        >
          <h2 class="group-title">{{ group.tag_name }}</h2>
          <div class="tags-wrapper">
            <div
              v-for="tag in group.son"
              :key="tag.tag_id"
              class="tag-item"
              @click="handleTagClick(tag)"
            >
              {{ tag.tag_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<style scoped lang="scss">
.categories-container {
  padding: 40px;
  color: $text-primary;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;

  .header {
    margin-bottom: 40px;
    text-align: start;
    position: relative;

    .page-title {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 4px;
      background: linear-gradient(135deg, #fff 0%, $text-secondary 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
    }
  }

  .category-group {
    margin-bottom: 30px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 30px; /* 增加内边距 */
    border: 1px solid rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease;

    /* 改为弹性布局，实现左右两栏 */
    display: flex;
    align-items: center; /* 垂直居中 */

    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .group-title {
      font-size: 24px; /* 加大字号 */
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9); /* 更亮的颜色 */
      width: 40px; /* 固定左侧宽度 */
      flex-shrink: 0;
      margin-right: 30px; /* 与右侧的间距 */
      margin-bottom: 0px; /* 移除底部间距 */

      /* 移除原有的小圆点 */
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 左对齐或居中 */
      letter-spacing: 2px;
    }

    .tags-wrapper {
      flex: 1; /* 占据剩余空间 */
      border-left: 1px solid rgba(255, 255, 255, 0.05); /* 添加左分割线，增强分割感 */
      padding-left: 30px; /* 分割线后的内边距 */

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;

      .tag-item {
        position: relative;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        user-select: none;

        /* 光效扫过动画 */
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.5s;
        }

        &:hover {
          color: #fff;
          background: rgba($accent-color, 0.1);
          border-color: rgba($accent-color, 0.4);
          transform: translateY(-3px);
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 0 8px rgba($accent-color, 0.2);
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);

          &::after {
            left: 150%;
            transition: 0.7s ease-in-out;
          }
        }

        &:active {
          transform: scale(0.96);
          background: rgba($accent-color, 0.2);
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .categories-container {
    padding: 20px 16px;

    .header {
      margin-bottom: 30px;
      .page-title {
        font-size: 24px;
      }
    }

    .category-group {
      padding: 16px;
      flex-direction: column; /* 移动端垂直排列 */
      align-items: stretch; /* 拉伸占满 */

      .group-title {
        width: 100%;
        margin-right: 0;
        margin-bottom: 16px;
        font-size: 18px;
      }

      .tags-wrapper {
        border-left: none; /* 移除左竖线 */
        padding-left: 0;

        grid-template-columns: repeat(3, 1fr) !important;
        gap: 10px;

        .tag-item {
          font-size: 12px;
          height: 36px;
        }
      }
    }
  }
}
</style>
