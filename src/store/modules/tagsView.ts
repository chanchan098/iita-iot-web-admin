import { TagView } from 'vue-router'
import router from '@/router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getRawRoute } from '@/utils/routerHelper'
import { defineStore } from 'pinia'
import store from '../index'
import { findIndex } from '@/utils'
import { useUserStoreWithOut } from './user'


export interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[]
  cachedViews: Set<string>
  selectedTag?: RouteLocationNormalizedLoaded

  visitedViews2: TagView[]
  cachedViews2: string[]
  iframeViews: TagView[]
}


export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: new Set(),
    selectedTag: undefined,

    visitedViews2: [],
    cachedViews2: [],
    iframeViews: []
  }),
  getters: {
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews
    },
    getCachedViews(): string[] {
      return Array.from(this.cachedViews)
    },
    getVisitedViews2(): TagView[] {
      return this.visitedViews2
    },
    getCachedViews2(): string[] {
      return Array.from(this.cachedViews2)
    },
    getSelectedTag(): RouteLocationNormalizedLoaded | undefined {
      return this.selectedTag
    }
  },
  actions: {
    addView2(view: TagView) {
      this.addVisitedView2(view)
      this.addCachedView2(view)
    },
    addIframeView(view: TagView): void {
      if (this.iframeViews.some((v) => v.path === view.path)) return
      this.iframeViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name',
        })
      )
    },
    delIframeView(view: TagView): Promise<TagView[]> {
      return new Promise((resolve) => {
        this.iframeViews = this.iframeViews.filter((item) => item.path !== view.path)
        resolve([...this.iframeViews])
      })
    },
    addVisitedView2 (view: TagView): void {
      if (this.visitedViews2.some((v) => v.path === view.path)) return
      this.visitedViews2.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name',
        })
      )
    },
    delView2 (view: TagView): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> {
      return new Promise((resolve) => {
        this.delVisitedView2(view)
        this.delCachedView2(view)
        resolve({
          visitedViews: [...this.visitedViews2],
          cachedViews: [...this.cachedViews2],
        })
      })
    },
  
    delVisitedView2 (view: TagView): Promise<TagView[]> {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews2.entries()) {
          if (v.path === view.path) {
            this.visitedViews2.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews2])
      })
    },
    delCachedView2 (view: TagView): Promise<string[]> {
      const viewName = view.name as string
      return new Promise((resolve) => {
        const index = this.cachedViews2.indexOf(viewName)
        index > -1 && this.cachedViews2.splice(index, 1)
        resolve([...this.cachedViews2])
      })
    },
    delOthersViews2 (view: TagView): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> {
      return new Promise((resolve) => {
        this.delOthersVisitedViews2(view)
        this.delOthersCachedViews2(view)
        resolve({
          visitedViews: [...this.visitedViews2],
          cachedViews: [...this.cachedViews2],
        })
      })
    },
  
    delOthersVisitedViews2 (view: TagView): Promise<TagView[]> {
      return new Promise((resolve) => {
        this.visitedViews2 = this.visitedViews2.filter((v) => {
          return v.meta?.affix || v.path === view.path
        })
        resolve([...this.visitedViews2])
      })
    },
    delOthersCachedViews2 (view: TagView): Promise<string[]> {
      const viewName = view.name as string
      return new Promise((resolve) => {
        const index = this.cachedViews2.indexOf(viewName)
        if (index > -1) {
          this.cachedViews2 = this.cachedViews2.slice(index, index + 1)
        } else {
          this.cachedViews2 = []
        }
        resolve([...this.cachedViews2])
      })
    },
  
    delAllViews2 (): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> {
      return new Promise((resolve) => {
        this.delAllVisitedViews2()
        this.delAllCachedViews2()
        resolve({
          visitedViews: [...this.visitedViews2],
          cachedViews: [...this.cachedViews2],
        })
      })
    },
    delAllVisitedViews2 (): Promise<TagView[]> {
      return new Promise((resolve) => {
        this.visitedViews2 = this.visitedViews2.filter((tag) => tag.meta?.affix)
        resolve([...this.visitedViews2])
      })
    },
  
    delAllCachedViews2 (): Promise<string[]> {
      return new Promise((resolve) => {
        this.cachedViews2 = []
        resolve([...this.cachedViews2])
      })
    },
  
    updateVisitedView2 (view: TagView): void {
      for (let v of this.visitedViews2) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    delRightTags(view: TagView): Promise<TagView[]> {
      return new Promise((resolve) => {
        const index = this.visitedViews2.findIndex((v) => v.path === view.path)
        if (index === -1) {
          return
        }
        this.visitedViews2 = this.visitedViews2.filter((item, idx) => {
          if (idx <= index || (item.meta && item.meta.affix)) {
            return true
          }
          const i = this.cachedViews2.indexOf(item.name as string)
          if (i > -1) {
            this.cachedViews2.splice(i, 1)
          }
          return false
        })
        resolve([...this.visitedViews2])
      })
    },
    delLeftTags(view: TagView): Promise<TagView[]> {
      return new Promise((resolve) => {
        const index = this.visitedViews2.findIndex((v) => v.path === view.path)
        if (index === -1) {
          return
        }
        this.visitedViews2 = this.visitedViews2.filter((item, idx) => {
          if (idx >= index || (item.meta && item.meta.affix)) {
            return true
          }
          const i = this.cachedViews2.indexOf(item.name as string)
          if (i > -1) {
            this.cachedViews2.splice(i, 1)
          }
          return false
        })
        resolve([...this.visitedViews2])
      })
    },
  
    addCachedView2(view: TagView): void {
      const viewName = view.name as string
      if (this.cachedViews2.includes(viewName)) return
      if (!view.meta?.noCache) {
        this.cachedViews2.push(viewName)
      }
    },
    // --------------------------------------
    // 新增缓存和tag
    addView(view: RouteLocationNormalizedLoaded): void {
      this.addVisitedView(view)
      this.addCachedView()
    },
    // 新增tag
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      if (view.meta?.noTagsView) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name'
        })
      )
    },
    // 新增缓存
    addCachedView() {
      const cacheMap: Set<string> = new Set()
      for (const v of this.visitedViews) {
        const item = getRawRoute(v)
        const needCache = !item?.meta?.noCache
        if (!needCache) {
          continue
        }
        const name = item.name as string
        cacheMap.add(name)
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return
      this.cachedViews = cacheMap
    },
    // 删除某个
    delView(view: RouteLocationNormalizedLoaded) {
      this.delVisitedView(view)
      this.addCachedView()
    },
    // 删除tag
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    // 删除缓存
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex<string>(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },
    // 删除所有缓存和tag
    delAllViews() {
      this.delAllVisitedViews()
      this.addCachedView()
    },
    // 删除所有tag
    delAllVisitedViews() {
      const userStore = useUserStoreWithOut()

      // const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
      this.visitedViews = userStore.getUserInfo
        ? this.visitedViews.filter((tag) => tag?.meta?.affix)
        : []
    },
    // 删除其它
    delOthersViews(view: RouteLocationNormalizedLoaded) {
      this.delOthersVisitedViews(view)
      this.addCachedView()
    },
    // 删除其它tag
    delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v?.meta?.affix || v.path === view.path
      })
    },
    // 删除左侧
    delLeftViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i > index
        })
        this.addCachedView()
      }
    },
    // 删除右侧
    delRightViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.path === view.path
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i < index
        })
        this.addCachedView()
      }
    },
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    // 设置当前选中的tag
    setSelectedTag(tag: RouteLocationNormalizedLoaded) {
      this.selectedTag = tag
    },
    setTitle(title: string, path?: string) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title
          break
        }
      }
    }
  },
  persist: false
})

export const useTagsViewStore2 = defineStore('tagsView', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])
  const iframeViews = ref<TagView[]>([])

  const addView = (view: TagView) => {
    addVisitedView(view)
    addCachedView(view)
  }

  const addIframeView = (view: TagView): void => {
    if (iframeViews.value.some((v) => v.path === view.path)) return
    iframeViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name',
      })
    )
  }
  const delIframeView = (view: TagView): Promise<TagView[]> => {
    return new Promise((resolve) => {
      iframeViews.value = iframeViews.value.filter((item) => item.path !== view.path)
      resolve([...iframeViews.value])
    })
  }
  const addVisitedView = (view: TagView): void => {
    if (visitedViews.value.some((v) => v.path === view.path)) return
    visitedViews.value.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name',
      })
    )
  }
  const delView = (view: TagView): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> => {
    return new Promise((resolve) => {
      delVisitedView(view)
      delCachedView(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  const delVisitedView = (view: TagView): Promise<TagView[]> => {
    return new Promise((resolve) => {
      for (const [i, v] of visitedViews.value.entries()) {
        if (v.path === view.path) {
          visitedViews.value.splice(i, 1)
          break
        }
      }
      resolve([...visitedViews.value])
    })
  }
  const delCachedView = (view: TagView): Promise<string[]> => {
    const viewName = view.name as string
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName)
      index > -1 && cachedViews.value.splice(index, 1)
      resolve([...cachedViews.value])
    })
  }
  const delOthersViews = (view: TagView): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> => {
    return new Promise((resolve) => {
      delOthersVisitedViews(view)
      delOthersCachedViews(view)
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }

  const delOthersVisitedViews = (view: TagView): Promise<TagView[]> => {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((v) => {
        return v.meta?.affix || v.path === view.path
      })
      resolve([...visitedViews.value])
    })
  }
  const delOthersCachedViews = (view: TagView): Promise<string[]> => {
    const viewName = view.name as string
    return new Promise((resolve) => {
      const index = cachedViews.value.indexOf(viewName)
      if (index > -1) {
        cachedViews.value = cachedViews.value.slice(index, index + 1)
      } else {
        cachedViews.value = []
      }
      resolve([...cachedViews.value])
    })
  }

  const delAllViews = (): Promise<{ visitedViews: TagView[]; cachedViews: string[] }> => {
    return new Promise((resolve) => {
      delAllVisitedViews()
      delAllCachedViews()
      resolve({
        visitedViews: [...visitedViews.value],
        cachedViews: [...cachedViews.value],
      })
    })
  }
  const delAllVisitedViews = (): Promise<TagView[]> => {
    return new Promise((resolve) => {
      visitedViews.value = visitedViews.value.filter((tag) => tag.meta?.affix)
      resolve([...visitedViews.value])
    })
  }

  const delAllCachedViews = (): Promise<string[]> => {
    return new Promise((resolve) => {
      cachedViews.value = []
      resolve([...cachedViews.value])
    })
  }

  const updateVisitedView = (view: TagView): void => {
    for (let v of visitedViews.value) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
  const delRightTags = (view: TagView): Promise<TagView[]> => {
    return new Promise((resolve) => {
      const index = visitedViews.value.findIndex((v) => v.path === view.path)
      if (index === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = cachedViews.value.indexOf(item.name as string)
        if (i > -1) {
          cachedViews.value.splice(i, 1)
        }
        return false
      })
      resolve([...visitedViews.value])
    })
  }
  const delLeftTags = (view: TagView): Promise<TagView[]> => {
    return new Promise((resolve) => {
      const index = visitedViews.value.findIndex((v) => v.path === view.path)
      if (index === -1) {
        return
      }
      visitedViews.value = visitedViews.value.filter((item, idx) => {
        if (idx >= index || (item.meta && item.meta.affix)) {
          return true
        }
        const i = cachedViews.value.indexOf(item.name as string)
        if (i > -1) {
          cachedViews.value.splice(i, 1)
        }
        return false
      })
      resolve([...visitedViews.value])
    })
  }

  const addCachedView = (view: TagView): void => {
    const viewName = view.name as string
    if (cachedViews.value.includes(viewName)) return
    if (!view.meta?.noCache) {
      cachedViews.value.push(viewName)
    }
  }

  return {
    visitedViews,
    cachedViews,
    iframeViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    updateVisitedView,
    addView,
    delView,
    delAllViews,
    delAllVisitedViews,
    delAllCachedViews,
    delOthersViews,
    delRightTags,
    delLeftTags,
    addIframeView,
    delIframeView,
  }
})

export default useTagsViewStore
