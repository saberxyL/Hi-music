<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const isMobileOpen = ref(false)

const toggleMobile = () => {
  if (window.innerWidth <= 768) {
    isMobileOpen.value = !isMobileOpen.value
  }
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
  isMobileOpen.value = false
}

const navigateTo = path => {
  router.push(path)
  isMobileOpen.value = false
}
</script>

<template>
  <header class="top-bar">
    <div class="search-bar">
      <el-icon><Search /></el-icon>
      <input type="text" placeholder="搜索音乐、歌手、歌词..." />
    </div>

    <div class="user-profile-area">
      <template v-if="userStore.isLogin">
        <div
          class="user-profile-wrapper"
          :class="{ 'mobile-open': isMobileOpen }"
          @click="toggleMobile"
        >
          <!-- 头像容器 -->
          <div class="avatar-box">
            <el-avatar
              :size="40"
              :src="
                userStore.avatar ||
                'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
              "
            />
          </div>

          <!-- 安全交互区域 -->
          <div class="hover-safe-area"></div>

          <!-- 悬浮面板 -->
          <div class="user-popover">
            <div class="popover-header-space"></div>

            <div class="user-info-content">
              <div class="user-name" :title="userStore.nickname">
                {{ userStore.nickname || '音乐爱好者' }}
              </div>

              <div class="user-stats">
                <div class="stat-item">
                  <span class="num">{{
                    userStore.userInfo?.follows || 0
                  }}</span>
                  <span class="label">关注</span>
                </div>
                <div class="stat-item">
                  <span class="num">{{ userStore.userInfo?.fans || 0 }}</span>
                  <span class="label">粉丝</span>
                </div>
                <div class="stat-item">
                  <span class="num">{{
                    userStore.userInfo?.eventCount || 0
                  }}</span>
                  <span class="label">动态</span>
                </div>
              </div>

              <div class="menu-list">
                <div class="menu-item" @click="navigateTo('/user-center')">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                  <el-icon class="arrow"><ArrowRight /></el-icon>
                </div>
                <div class="menu-item" @click="navigateTo('/settings')">
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
                  <el-icon class="arrow"><ArrowRight /></el-icon>
                </div>
              </div>

              <!-- 底部退出按钮 -->
              <div class="logout-area" @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="login-btn" @click="router.push('/login')">登录</div>
      </template>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-bar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  position: relative;

  .search-bar {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0 12px;
    margin-right: 20px;
    height: 32px;
    width: 240px;
    transition: all 0.3s;

    &:focus-within {
      background: #fff;
      .el-icon {
        color: #333;
      }
      input {
        color: #333;
        &::placeholder {
          color: #999;
        }
      }
    }

    .el-icon {
      color: #ccc;
      margin-right: 8px;
    }

    input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 12px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .user-profile-area {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 203;
    // border-color: $accent-color;

    .login-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: #fff;
      transition: all 0.3s;

      &:hover {
        background: $accent-color;
        color: #fff;
      }
    }

    .user-profile-wrapper {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      z-index: 200;

      .hover-safe-area {
        position: absolute;
        top: 0;
        right: -40px;
        width: 340px;
        height: 450px;
        z-index: 199;
        display: none;
      }

      // Avatar container
      .avatar-box {
        position: relative;
        z-index: 202;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); // Bouncy effect
        border-radius: 50%;
        border: 2px solid transparent;
      }

      // Popover container
      .user-popover {
        position: absolute;
        top: 76px;
        right: 26px;
        width: 280px;
        background: #252525;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s ease;
        z-index: 201;
        overflow: hidden;
        pointer-events: none;
        .popover-header-space {
          height: 70px; // Space for the avatar to land
          background: linear-gradient(
            to bottom,
            rgba($accent-color, 0.1),
            transparent
          );
        }

        .user-info-content {
          padding: 0 16px 16px;
        }

        .user-name {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 16px;
          margin-top: 10px;
        }

        .user-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;

            &:hover .num {
              color: $accent-color;
            }

            .num {
              font-size: 16px;
              font-weight: 600;
              color: #fff;
              margin-bottom: 4px;
            }
            .label {
              font-size: 12px;
              color: #888;
            }
          }
        }

        .menu-list {
          margin-bottom: 16px;

          .menu-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            color: #ccc;
            transition: background 0.2s;

            &:hover {
              background: rgba(255, 255, 255, 0.08);
              color: #fff;
              .el-icon {
                color: $accent-color;
              }
            }

            .el-icon {
              margin-right: 12px;
              font-size: 18px;
            }

            span {
              flex: 1;
              font-size: 14px;
            }
            .arrow {
              font-size: 12px;
              color: #666;
              margin-right: 0;
            }
          }
        }

        .logout-area {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          color: #ff4d4f;
          transition: all 0.2s;
          gap: 8px;

          &:hover {
            background: rgba(255, 77, 79, 0.1);
          }

          span {
            font-size: 14px;
          }
        }
      }

      // Hover State
      &:hover {
        @media (min-width: 768px) {
          .hover-safe-area {
            display: block;
          }
        }

        .avatar-box {
          transform: translate(-146px, 56px) scale(2.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 203;
          border-color: $accent-color;
        }

        .user-popover {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }
      }
    }
  }
}
</style>
