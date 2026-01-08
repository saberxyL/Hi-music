<script setup>
defineProps({
  activeInitial: {
    type: String,
    default: '热门'
  }
})

const emit = defineEmits(['update:activeInitial', 'change'])

// 生成字母表
const alphabets = [
  '热门',
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  '#'
]

const handleClick = item => {
  emit('update:activeInitial', item)
  emit('change', item)
}
</script>

<template>
  <div class="alphabet-sidebar">
    <ul class="alphabet-list">
      <li
        v-for="item in alphabets"
        :key="item"
        class="alphabet-item"
        :class="{ active: activeInitial === item }"
        @click="handleClick(item)"
      >
        {{ item === '热门' ? '热' : item }}
        <span class="tooltip" v-if="item === '热门'">热门</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.alphabet-sidebar {
  position: fixed;
  height: 400px; /* 固定列表高度 */
  right: 40px;
  top: 45%;
  transform: translateY(-50%);
  z-index: 99;

  .alphabet-list {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px; /* 子项间距 */
    padding: 12px 6px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    /* 隐藏滚动条 */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    .alphabet-item {
      flex-shrink: 0; /* 防止子元素被压缩 */
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: $text-secondary;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.2s ease;
      position: relative;
      font-weight: 500;

      &:hover {
        color: $text-primary;
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: #fff;
        background: $accent-color;
        box-shadow: 0 4px 10px rgba($accent-color, 0.4);
        font-weight: bold;
      }

      // 热门的Tooltip样式
      .tooltip {
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 12px;
        background: rgba(0, 0, 0, 0.8);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;

        &::after {
          content: '';
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          border-left: 4px solid rgba(0, 0, 0, 0.8);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }
      }

      &:hover .tooltip {
        opacity: 1;
      }
    }
  }
}

@media (max-width: 1200px) {
  .alphabet-sidebar {
    right: 10px;

    .alphabet-list {
      padding: 8px 4px;

      .alphabet-item {
        width: 24px;
        height: 24px;
        font-size: 11px;
      }
    }
  }
}

@media (max-width: 768px) {
  // 移动端隐藏或者改为底部横向滚动，这里暂时隐藏保持页面简洁，
  // 或者是放在内容的上方，根据需求调整。
  // 考虑到移动端侧边点击太小，通常会改为顶部横向滑动条。
  .alphabet-sidebar {
    display: none;
  }
}
</style>
