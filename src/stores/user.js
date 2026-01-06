import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import config from '@/config'
// import { getUserProfileApi } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const token = ref('')
    const userInfo = ref({})

    // Getters
    const isLogin = computed(() => !!token.value)
    const userId = computed(() => userInfo.value?.userid)
    const avatar = computed(() => userInfo.value?.pic)
    const nickname = computed(() => userInfo.value?.nickname)

    // Actions
    function setToken(val) {
      token.value = val
    }

    async function setUserInfo(value) {
      // const res = await getUserProfileApi()
      // console.log(res)
      userInfo.value = value
    }

    function logout() {
      token.value = ''
      userInfo.value = {}
    }

    return {
      token,
      userInfo,
      isLogin,
      userId,
      avatar,
      nickname,
      setToken,
      setUserInfo,
      logout
    }
  },
  {
    persist: [
      {
        key: config.tokenKey,
        paths: ['token']
      },
      {
        key: 'userInfo',
        paths: ['userInfo']
      }
    ]
  }
)
