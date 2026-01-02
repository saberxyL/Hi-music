<script setup>
import { ref } from 'vue'
import LoginByPhone from './components/LoginByPhone.vue'
import LoginByEmail from './components/LoginByEmail.vue'
import RegisterAccount from './components/RegisterAccount.vue'

const isRegister = ref(false) // 控制登录/注册视图切换
const loginType = ref('phone') // 登录方式：phone | email

// 注册成功回调
const handleRegisterSuccess = () => {
  isRegister.value = false
  loginType.value = 'phone'
  // 这里如果需要自动填充手机号，可以通过 ref 调用子组件方法，或者使用状态管理
  // 简单起见，用户手动输入即可，或者后续优化
}
</script>

<template>
  <div class="login-container">
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <div class="login-box">
      <!-- Left Panel: Illustration/Branding -->
      <div class="left-panel">
        <div class="brand">
          <div class="logo-icon">Hi</div>
          <span class="brand-name">Hi-Music</span>
        </div>
        <div class="illustration">
          <div class="abstract-circle"></div>
          <div class="illustration-img"></div>
        </div>
        <div class="footer-text">啦啦啦，啦啦啦... Hi~听歌随意~</div>
      </div>
      <!-- Right Panel: Form -->
      <div class="right-panel">
        <div class="form-wrapper">
          <div class="header">
            <h2 v-if="!isRegister">欢迎回来</h2>
            <h2 v-else>创建账号</h2>
            <p v-if="!isRegister">登录以继续您的音乐之旅</p>
            <p v-else>加入我们，探索音乐世界</p>
          </div>

          <!-- Login View -->
          <div v-if="!isRegister" class="auth-view">
            <el-tabs v-model="loginType" class="custom-tabs">
              <el-tab-pane label="手机号" name="phone">
                <LoginByPhone />
              </el-tab-pane>
              <el-tab-pane label="邮箱" name="email">
                <LoginByEmail />
              </el-tab-pane>
            </el-tabs>

            <div class="action-links">
              <span class="link" @click="isRegister = true"
                >没有账号? 立即注册</span
              >
            </div>
          </div>

          <!-- Register View -->
          <div v-else class="auth-view">
            <RegisterAccount
              @success="handleRegisterSuccess"
              @cancel="isRegister = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$count: 1000;
$n: 5;
$duration: 400;
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    circle at bottom,
    rgba(1, 5, 40) 10%,
    rgba(0, 0, 0) 90%
  );

  @function star($n) {
    $res: #{random(100)}vw #{random(100)}vh #fff;
    @for $i from 2 through $n {
      $res: '#{$res}, #{random(100)}vw #{random(100)}vh #fff';
    }
    @return unquote($res);
  }

  $n: 5;
  $duration: 400s;
  $count: 1000;
  $zIndex: 1;
  @for $i from 1 through $n {
    $duration: floor($duration / 2);
    $count: floor($count/2);
    $zIndex: $zIndex * $i;
    .layer#{$i} {
      position: fixed;
      left: 0;
      top: 0;
      width: #{$i}px;
      height: #{$i}px;
      border-radius: 50%;
      box-shadow: star($count);
      animation: moveUp $duration linear infinite;
      z-index: $zIndex;
    }
    .layer#{$i}::after {
      content: '';
      position: inherit;
      left: inherit;
      top: 100vh;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      box-shadow: inherit;
    }
  }

  @keyframes moveUp {
    to {
      transform: translateY(-100vh);
    }
  }

  .login-box {
    position: relative;
    width: 1000px;
    height: 640px;
    background: rgba(18, 18, 18, 0.75);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    display: flex;
    overflow: hidden;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.4);
    margin-left: 150px;

    .left-panel {
      width: 45%;
      background: rgba(10, 10, 10, 0.3);
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 40px;
      justify-content: space-between;
      overflow: hidden;

      // Decorative background gradient
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle at center,
          rgba(0, 198, 251, 0.1) 0%,
          transparent 60%
        );
        pointer-events: none;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 2;

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #00c6fb, #005bea);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 18px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
        }
      }

      .illustration {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 2;

        .abstract-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(0, 198, 251, 0.2),
            rgba(0, 91, 234, 0.2)
          );
          filter: blur(40px);
          position: absolute;
        }

        .illustration-img {
          width: 200px;
          height: 200px;
          border-radius: 20px;
          transform: rotate(-10deg);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: url('/src/assets/images/login-sm-bg.jpg') no-repeat center;
          background-size: cover;
          object-fit: cover;
        }
      }

      .footer-text {
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        z-index: 2;
      }
    }

    .right-panel {
      flex: 1;
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: transparent;

      .form-wrapper {
        width: 100%;
        max-width: 360px;
        margin: 0 auto;
      }

      .header {
        margin-bottom: 40px;

        h2 {
          font-size: 28px;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 600;
        }

        p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
      }

      .action-links {
        margin-top: 20px;
        text-align: center;

        .link {
          color: #00c6fb;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.3s;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-tabs__item) {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;

  &.is-active {
    color: #fff;
  }

  &:hover {
    color: #fff;
  }
}

:deep(.el-tabs__active-bar) {
  background-color: #00c6fb;
}

:deep(.el-input__wrapper) {
  background-color: #1e1e1e !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 15px;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }

  &.is-focus {
    border-color: #00c6fb;
    background-color: #1e1e1e !important;
  }

  input {
    color: #fff !important;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
}

:deep(.el-button--primary) {
  background: #005bea;
  border: none;
  height: 44px;
  border-radius: 8px;
  font-weight: 600;

  &:hover {
    background: #00c6fb;
  }
}

// Fix for child components layout
:deep(.login-form) {
  margin-top: 0;
}
</style>
