<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginCellphoneApi } from '@/api/login'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

// 登录表单数据
const form = reactive({
  phone: '',
  password: ''
})

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const res = await loginCellphoneApi({
          phone: form.phone,
          password: form.password
        })
        console.log(res)
        // if (res.code === 200) {
        //   ElMessage.success('登录成功')
        router.push('/')
        // } else {
        //   ElMessage.error(res.msg || '登录失败')
        // }
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
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
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        show-password
        prefix-icon="Lock"
        @keyup.enter="handleLogin"
      />
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
