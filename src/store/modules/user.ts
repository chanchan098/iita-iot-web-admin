import { to } from 'await-to-js'
import defAva from '@/assets/images/profile.jpg'

import { getToken, removeToken, setToken } from '@/utils/auth'
import { login as loginApi, logout as logoutApi, getInfo as getUserInfo } from '@/api/login'
import { LoginData } from '@/api/types'
import { listByIds } from '@/api/system/oss'
import  store  from '../index'
import { UserLoginType, UserType } from '@/api/types'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
// import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface UserState {
  userInfo?: UserType
  tokenKey: string
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType

  name: string
  nickname: string
  userId: string|number
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,

      name: '',
      nickname: '',
      userId: '',
      avatar: '',
      roles: [],
      permissions: []
    }
  },
  getters: {
    getName(): string{
      return this.name
    },
    getNickname(): string{
      return this.nickname
    },
    getUserId(): string|number{
      return this.userId
    },
    getAvatar(): string{
      return this.avatar
    },
    getRoles(): string[]{
      return this.roles
    },
    getPermissions(): string[]{
      return this.permissions
    },

    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      // const { t } = useI18n()
      // ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      //   confirmButtonText: t('common.ok'),
      //   cancelButtonText: t('common.cancel'),
      //   type: 'warning'
      // })
      //   .then(async () => {
      //     const res = await loginOutApi().catch(() => {})
      //     if (res) {
      //       this.reset()
      //     }
      //   })
      //   .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    // logout() {
    //   this.reset()
    // },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    },
    // old
    async login (userInfo: LoginData): Promise<void>{
      const [err, res] = await to(loginApi(userInfo))
      if (res) {
        const data = res.data
        setToken(data.token)
        this.token = data.token
        return Promise.resolve()
      }
      return Promise.reject(err)
    },
    async getInfo(): Promise<void> {
      const [err, res] = await to(getUserInfo())
      if (res) {
        const data = res.data
        const user = data.user
        const profile = user.avatar
  
        if (data.roles && data.roles.length > 0) {
          // 验证返回的roles是否是一个非空数组
          this.roles = data.roles
          this.permissions = data.permissions
        } else {
          this.roles = ['ROLE_DEFAULT']
        }
        this.name = user.userName
        this.nickname = user.nickName
        if (profile) {
          const ossObj = await listByIds(profile)
          console.log('ossObj', ossObj)
          if (ossObj.data) this.avatar = ossObj.data[0].url
          console.log(this.avatar)
        } else {
          this.avatar = defAva
        }
        this.userId = user.id
        return Promise.resolve()
      }
      return Promise.reject(err)
    },
  
    async logout (): Promise<void> {
      await logoutApi()
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
    }
  }

})

export const useUserStore2 = defineStore('user', () => {
  const token = ref(getToken())
  const name = ref('')
  const nickname = ref('')
  const userId = ref<string | number>('')
  const avatar = ref('')
  const roles = ref<Array<string>>([]) // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]) // 用户权限编码集合 → 判断按钮权限

  /**
   * 登录
   * @param userInfo
   * @returns
   */
  const login = async (userInfo: LoginData): Promise<void> => {
    const [err, res] = await to(loginApi(userInfo))
    if (res) {
      const data = res.data
      setToken(data.token)
      token.value = data.token
      return Promise.resolve()
    }
    return Promise.reject(err)
  }

  // 获取用户信息
  const getInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo())
    if (res) {
      const data = res.data
      const user = data.user
      const profile = user.avatar

      if (data.roles && data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        roles.value = data.roles
        permissions.value = data.permissions
      } else {
        roles.value = ['ROLE_DEFAULT']
      }
      name.value = user.userName
      nickname.value = user.nickName
      if (profile) {
        const ossObj = await listByIds(profile)
        console.log('ossObj', ossObj)
        if (ossObj.data) avatar.value = ossObj.data[0].url
        console.log(avatar.value)
      } else {
        avatar.value = defAva
      }
      userId.value = user.id
      return Promise.resolve()
    }
    return Promise.reject(err)
  }

  // 注销
  const logout = async (): Promise<void> => {
    await logoutApi()
    token.value = ''
    roles.value = []
    permissions.value = []
    removeToken()
  }

  return {
    userId,
    token,
    nickname,
    avatar,
    roles,
    permissions,
    login,
    getInfo,
    logout,
  }
})

export default useUserStore
// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
