import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    // 获取用户信息 并储存到 pinia 中
    const user = ref({})
    const getUserInfo = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUserInfo = (newUser) => {
      user.value = newUser
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true // 持久化
  }
)
