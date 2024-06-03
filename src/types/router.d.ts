import { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  type RouteOption = {
    hidden?: boolean
    permissions?: string[]
    roles?: string[]
    component?: any
    children?: RouteOption[]
    alwaysShow?: boolean
    parentPath?: string
    meta?: {
      title: string
      icon: string
    }
    query?: string
  } & RouteRecordRaw

  interface _RouteLocationBase {
    children?: RouteOption[]
  }

  interface RouteLocationOptions {
    fullPath?: string
  }

  interface TagView extends Partial<_RouteLocationBase> {
    title?: string
    meta?: {
      link?: string
      title?: string
      affix?: boolean
      noCache?: boolean
    }
  }
}

declare global {
  declare interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  declare interface AppCustomRouteRecordRaw
    extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
  }
}

