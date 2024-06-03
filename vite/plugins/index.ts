import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import createUnoCss from './unocss'
import createAutoImport from './auto-import'
import createComponents from './components'
import createIcons from './icons'
import createSvgIconsPlugin from './svg-icon'
import createCompression from './compression'
import createVueSetupExtend from './vue-setup-extend'
import path from 'path'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

export default (viteEnv: any, isBuild = false): [] => {
  const vitePlusgins: any = []
  vitePlusgins.push(vue())
  vitePlusgins.push(VueJsx())
  vitePlusgins.push(createUnoCss())
  vitePlusgins.push(createAutoImport(path))
  vitePlusgins.push(createComponents(path))
  vitePlusgins.push(createCompression(viteEnv))
  vitePlusgins.push(createIcons())
  vitePlusgins.push(createSvgIconsPlugin(path, isBuild))
  vitePlusgins.push(createVueSetupExtend())
  // vitePlusgins.push(
  //   createStyleImportPlugin({
  //     resolves: [ElementPlusResolve()],
  //     libs: [
  //       {
  //         libraryName: 'element-plus',
  //         esModule: true,
  //         resolveStyle: (name) => {
  //           if (name === 'click-outside') {
  //             return ''
  //           }
  //           return `element-plus/es/components/${name.replace(/^el-/, '')}/style/css`
  //         }
  //       }
  //     ]
  //   })
  // )
  return vitePlusgins
}
