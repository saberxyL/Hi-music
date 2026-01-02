<script setup>
import { computed } from 'vue'
import { systemMenuTree, PageEnum } from '@/config/menu'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  activeMenu: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'menuClick'])

// 图标映射
const iconMap = {
  'icon-home': 'House',
  'icon-login': 'SwitchButton',
  'icon-discover': 'Compass',
  'icon-toplist': 'Trophy',
  'icon-recommend': 'Headset',
  'icon-playlist': 'Collection',
  'icon-artist': 'Microphone'
}

// 处理菜单数据
const menuList = computed(() => {
  return systemMenuTree.data
    .filter(item => item.pageType === PageEnum.EMBEDDED)
    .map(item => {
      if (item.children && item.children.length) {
        return {
          ...item,
          children: item.children.filter(
            child => child.pageType === PageEnum.EMBEDDED
          )
        }
      }
      return item
    })
})

const handleMenuSelect = index => {
  emit('menuClick', index)
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="brand">
      <div class="logo-icon">Hi</div>
      <span class="brand-name">Hi-Music</span>
    </div>

    <div class="nav-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        class="custom-menu"
        background-color="transparent"
        text-color="rgba(255, 255, 255, 0.6)"
        active-text-color="#00c6fb"
        :unique-opened="true"
        @select="handleMenuSelect"
      >
        <template v-for="item in menuList" :key="item.id">
          <!-- 有子菜单 -->
          <el-sub-menu
            v-if="item.children && item.children.length"
            :index="item.url || String(item.id)"
          >
            <template #title>
              <el-icon
                ><component :is="iconMap[item.icon] || 'Menu'"
              /></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.id"
              :index="child.url"
            >
              <template #title>
                <el-icon
                  ><component :is="iconMap[child.icon] || 'Menu'"
                /></el-icon>
                <span>{{ child.name }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.url">
            <el-icon><component :is="iconMap[item.icon] || 'Menu'" /></el-icon>
            <template #title>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 24px 0 100px 0; // 增加底部padding，防止被播放栏遮挡
  z-index: 100;
  transition: transform 0.3s ease;

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
    padding: 0 24px; // brand 保持 padding

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #00c6fb, #005bea);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(to right, #fff, #ccc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .nav-menu-wrapper {
    flex: 1;
    overflow-y: auto;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      width: 0;
    }
  }

  // Element Plus Menu 样式覆盖
  :deep(.custom-menu) {
    border-right: none;

    .el-menu-item,
    .el-sub-menu__title {
      border-radius: 0 24px 24px 0; // 右侧圆角
      margin-right: 12px; // 右侧留白
      height: 50px;
      line-height: 50px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
      }
    }

    .el-menu-item.is-active {
      background-color: rgba(0, 198, 251, 0.1);
      font-weight: 500;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background-color: $accent-color;
        border-radius: 0 4px 4px 0;
      }
    }

    .el-icon {
      font-size: 18px;
      margin-right: 12px;
    }
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 20px 24px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    .footer-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      cursor: pointer;
      color: $text-secondary;
      transition: all 0.3s;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }

      .icon {
        font-size: 18px;
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: #121212;

    &.is-open {
      transform: translateX(0);
    }
  }
}
</style>
