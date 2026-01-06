<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['success', 'cancel'])

const loading = ref(false) // 提交按钮加载状态
const formRef = ref(null) // 表单引用
const captchaCount = ref(0) // 验证码倒计时

// 注册表单数据
const form = reactive({
  phone: '',
  captcha: '',
  password: '',
  nickname: ''
})

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}
</script>

<template>
  <div class="view-container">
    <div class="title">注册账号</div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="login-form register-form"
      size="large"
    >
      <el-form-item prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          prefix-icon="Iphone"
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <div class="captcha-box">
          <el-input
            v-model="form.captcha"
            placeholder="验证码"
            prefix-icon="Message"
          />
          <el-button
            class="send-btn"
            :disabled="captchaCount > 0"
            @click="handleSendCaptcha(form.phone)"
          >
            {{ captchaCount > 0 ? `${captchaCount}s` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入昵称"
          prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="设置密码"
          show-password
          prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <div class="bottom-links">
      <span class="link-text highlight" @click="emit('cancel')">返回登录</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #00c6fb, #005bea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.login-form {
  margin-top: 10px;
  flex-grow: 1;
}

.register-form {
  margin-top: 30px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background: linear-gradient(90deg, #00c6fb 0%, #005bea 100%);
  border: none;
  margin-top: 10px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 91, 234, 0.3);
  }
}

.captcha-box {
  display: flex;
  width: 100%;
  gap: 12px;

  .send-btn {
    width: 130px;
    border-radius: 22px;
    height: 40px; // 匹配输入框高度\
    margin: auto 0;
    border-color: #005bea;
    color: #005bea;

    &:hover {
      background-color: #f0f2f5;
    }
  }
}

.bottom-links {
  margin-top: auto; // 推到底部
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;

  .link-text {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #005bea;
    }

    &.highlight {
      color: #005bea;
      font-weight: 600;
    }
  }
}

:deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 8px 20px;
  background-color: #f5f7fa;
  box-shadow: none;
  border: 1px solid transparent;
  transition: all 0.3s;

  &.is-focus {
    background-color: #fff;
    border-color: #005bea;
    box-shadow: 0 0 0 1px #005bea inset;
  }
}
</style>
