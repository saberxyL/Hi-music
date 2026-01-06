<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { sendCaptchaApi, loginByPhoneCaptchaApi } from '@/api/login'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore() // 用户状态管理
const router = useRouter() // 路由实例
const loading = ref(false) // 提交按钮加载状态
const formRef = ref(null) // 表单引用
const countdown = ref(0) // 验证码倒计时

// 登录表单数据
const form = reactive({
  phone: '',
  captcha: ''
})

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, message: '验证码格式错误', trigger: 'blur' }
  ]
}

// 发送验证码
const sendCaptcha = async () => {
  if (countdown.value > 0) return

  // 先验证手机号
  try {
    await formRef.value.validateField('phone')
  } catch (e) {
    console.error(e.message)
    return
  }

  let timer = null
  try {
    const res = await sendCaptchaApi(form.phone)

    if (res.status === 1) {
      ElMessage.success('验证码已发送')
      countdown.value = 60
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
  } catch (error) {
    ElMessage.error(error.message || '发送验证码失败')
    console.error(error)
  }
}

// 登录
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const params = {
          mobile: form.phone,
          code: form.captcha
        }
        const res = await loginByPhoneCaptchaApi(params)
        if (res.status === 1) {
          ElMessage.success(`登录成功, 欢迎您，${res.data.nickname}`)
          userStore.setToken(res.data.token)
          userStore.setUserInfo(res.data)
          router.push('/')
        }
      } catch (error) {
        ElMessage.error(error.message || '登录失败，请稍后重试')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="login-form"
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
      <div class="captcha-input-group">
        <el-input
          v-model="form.captcha"
          placeholder="请输入验证码"
          prefix-icon="Message"
          maxlength="6"
        />
        <el-button
          class="send-btn"
          :disabled="countdown > 0"
          @click="sendCaptcha"
        >
          {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="submit-btn"
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.login-form {
  margin-top: 10px;
  flex-grow: 1;
}

.captcha-input-group {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;

  .el-input {
    flex: 1;
  }

  .send-btn {
    width: 110px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid transparent;
    color: #333;

    &:hover:not(:disabled) {
      color: #005bea;
      background: #fff;
      border-color: #005bea;
    }

    &:disabled {
      color: #999;
      background: #f5f7fa;
    }
  }
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
