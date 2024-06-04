import zhCN from 'element-plus/es/locale/lang/zh-cn'
import enUS from 'element-plus/es/locale/lang/en'

import  store  from '../index'

import { setCssVar, humpToUnderline } from '@/utils'

import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage, ComponentSize } from 'element-plus'
import { RemovableRef, useCssVar } from '@vueuse/core'
import { unref } from 'vue'

import { useDark } from '@vueuse/core'


interface Sidebar{
  opened: boolean
  withoutAnimation: boolean
  hide: boolean
}

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  serverDynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  isDark: boolean
  currentSize: ComponentSize
  sizeMap: ComponentSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean

  sidebarStatus: RemovableRef<string>
  sidebar: Sidebar
  device: string
  size2: RemovableRef<string>
  language: RemovableRef<string>
  locale2: any
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    const sidebarStatus = useStorage('sidebarStatus', '1')
    const language = useStorage('language', 'zh_CN')
    const languageObj: any = {
      en_US: enUS,
      zh_CN: zhCN,
    }
    const locale2 = computed(() => {
      return languageObj[language.value]
    })
    return {
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: true, // 是否动态路由
      serverDynamicRouter: true, // 是否服务端渲染动态路由
      fixedMenu: false, // 是否固定菜单

      layout: 'classic', // layout布局
      isDark: false, // 是否是暗黑模式
      currentSize: 'default', // 组件尺寸
      theme: {
        // 主题色
        elColorPrimary: '#409eff',
        // 左侧菜单边框颜色
        leftMenuBorderColor: 'inherit',
        // 左侧菜单背景颜色
        leftMenuBgColor: '#001529',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '#0f2438',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单字体颜色
        leftMenuTextColor: '#bfcbd9',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '#fff',
        // logo字体颜色
        logoTitleTextColor: '#fff',
        // logo边框颜色
        logoBorderColor: 'inherit',
        // 头部背景颜色
        topHeaderBgColor: '#fff',
        // 头部字体颜色
        topHeaderTextColor: 'inherit',
        // 头部悬停颜色
        topHeaderHoverColor: '#f6f6f6',
        // 头部边框颜色
        topToolBorderColor: '#eee'
      },
      sidebarStatus: sidebarStatus,
      sidebar: {
        opened: sidebarStatus.value ? !!+ sidebarStatus.value : true,
        withoutAnimation: false,
        hide: false,
      },
      device: 'desktop',
      size2: useStorage('size', 'default'),
      language: language,
      locale2: locale2
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize
    },
    getSizeMap(): ComponentSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    },
    // old
    getSidebarStatus(): string {
      return this.sidebarStatus
    },
    getSidebar(): Sidebar{
      return this.sidebar
    },
    getDevice(): string{
      return this.device
    },
    getSize2(): string{
      return this.size2
    },
    getLocal2(): any{
      return this.locale2
    },
    getLanguage(): string{
      return this.language
    }
  },
  actions: {
    toggleSideBar(withoutAnimation: boolean) {
      if (this.sidebar.hide) {
        return false
      }
  
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation
      if (this.sidebar.opened) {
        this.sidebarStatus = '1'
      } else {
        this.sidebarStatus = '0'
      }
    },
    closeSideBar({ withoutAnimation }: any): void {
      this.sidebarStatus = '0'
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(d: string): void {
      this.device = d
    },
    setSize(s: string): void {
      this.size2 = s
    },
    toggleSideBarHide(status: boolean): void {
      this.sidebar.hide = status
    },
    changeLanguage(val: string): void {
      this.language = val
    }
  }
}
)

// old
// export const useAppStore = defineStore('app', () => {
//   const sidebarStatus = useStorage('sidebarStatus', '1')
//   const sidebar = reactive({
//     opened: sidebarStatus.value ? !!+sidebarStatus.value : true,
//     withoutAnimation: false,
//     hide: false,
//   })
  
//   const device = ref<string>('desktop')
//   const size = useStorage('size', 'default')

//   // 语言
//   const language = useStorage('language', 'zh_CN')
//   const languageObj: any = {
//     en_US: enUS,
//     zh_CN: zhCN,
//   }
//   const locale = computed(() => {
//     return languageObj[language.value]
//   })

//   const toggleSideBar = (withoutAnimation: boolean) => {
//     if (sidebar.hide) {
//       return false
//     }

//     sidebar.opened = !sidebar.opened
//     sidebar.withoutAnimation = withoutAnimation
//     if (sidebar.opened) {
//       sidebarStatus.value = '1'
//     } else {
//       sidebarStatus.value = '0'
//     }
//   }

//   const closeSideBar = ({ withoutAnimation }: any): void => {
//     sidebarStatus.value = '0'
//     sidebar.opened = false
//     sidebar.withoutAnimation = withoutAnimation
//   }
//   const toggleDevice = (d: string): void => {
//     device.value = d
//   }
//   const setSize = (s: string): void => {
//     size.value = s
//   }
//   const toggleSideBarHide = (status: boolean): void => {
//     sidebar.hide = status
//   }

//   const changeLanguage = (val: string): void => {
//     language.value = val
//   }

//   return {
//     device,
//     sidebar,
//     language,
//     locale,
//     size,
//     changeLanguage,
//     toggleSideBar,
//     closeSideBar,
//     toggleDevice,
//     setSize,
//     toggleSideBarHide,
//   }
// })

export default useAppStore
