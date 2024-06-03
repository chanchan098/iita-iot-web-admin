import { FormRules } from 'element-plus'
declare global {
  /**
   * 界面字段隐藏属性
   */
  interface FieldOption {
    key: number
    label: string
    visible: boolean
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string
    /**
     * 是否显示
     */
    visible: boolean
  }

  interface UploadOption {
    /** 设置上传的请求头部 */
    headers: { [key: string]: any }

    /** 上传的地址 */
    url: string
  }

  /**
   * 导入属性
   */
  interface ImportOption extends UploadOption {
    /** 是否显示弹出层 */
    open: boolean
    /** 弹出层标题 */
    title: string
    /** 是否禁用上传 */
    isUploading: boolean

    /** 其他参数 */
    [key: string]: any
  }
  /**
   * 字典数据  数据配置
   */
  interface DictDataOption {
    label: string
    value: string
    elTagType?: ElTagType
    elTagClass?: string
  }

  interface BaseEntity {
    id?: any
    createBy?: any
    createDept?: any
    createTime?: string
    updateBy?: any
    updateTime?: any
  }

  /**
   * 分页数据
   * T : 表单数据
   * D : 查询参数
   */
  interface PageData<T, D> {
    form: T
    queryParams: D
    rules: FormRules
  }
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number
    pageSize: number
  }
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type ComponentRef<T> = InstanceType<T>

  declare type LocaleType = 'zh-CN' | 'en'

  declare type AxiosHeaders = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  declare interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headersType?: string
    responseType?: AxiosResponseType
  }

  declare interface IResponse<T = any> {
    code: string
    data: T extends any ? T : T & any
  }


  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type RemoveReadonly<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type ComponentRef<T> = InstanceType<T>

  declare type LocaleType = 'zh-CN' | 'en'

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger'

  declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

  declare type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  declare interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headers?: RawAxiosRequestHeaders
    responseType?: AxiosResponseType
  }

  declare interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
  }

  declare interface ThemeTypes {
    elColorPrimary?: string
    leftMenuBorderColor?: string
    leftMenuBgColor?: string
    leftMenuBgLightColor?: string
    leftMenuBgActiveColor?: string
    leftMenuCollapseBgActiveColor?: string
    leftMenuTextColor?: string
    leftMenuTextActiveColor?: string
    logoTitleTextColor?: string
    logoBorderColor?: string
    topHeaderBgColor?: string
    topHeaderTextColor?: string
    topHeaderHoverColor?: string
    topToolBorderColor?: string
  }
}
export {}
