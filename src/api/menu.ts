import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { RouteRecordRaw } from 'vue-router'

// 获取路由
export function getRouters(): AxiosPromise<RouteRecordRaw[]> {
  return request({
    url: '/system/menu/getRouters',
    method: 'post',
  })
}


export function getRouters2(): AxiosPromise<AppCustomRouteRecordRaw[]> {
  return request({
    url: '/system/menu/getRouters',
    method: 'post',
  })
}