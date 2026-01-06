<script setup>
import { ref, reactive } from 'vue'

const loading = ref(false)
const formRef = ref(null)
// 登录表单
const form = reactive({
  email: '',
  password: ''
})
//表单校验规则
const rules = {
  email: [
    { required: true, message: '请输入网易邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
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
    <el-form-item prop="email">
      <el-input
        v-model="form.email"
        placeholder="请输入邮箱"
        prefix-icon="Message"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        show-password
        prefix-icon="Lock"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="submit-btn" :loading="loading">
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
