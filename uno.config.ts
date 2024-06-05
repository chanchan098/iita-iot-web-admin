import { defineConfig, toEscapedSelector as e, presetAttributify, presetUno, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { loadEnv } from 'vite'

const root = process.cwd()

const createPresetIcons = () => {
    // ....
}

export default defineConfig({
    // ...UnoCSS options
    rules: [
        [
            /^overflow-ellipsis$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector} {
text-overflow: ellipsis;
}
`
            }
        ],
        [
            /^custom-hover$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector} {
display: flex;
height: 100%;
padding: 1px 10px 0;
cursor: pointer;
align-items: center;
transition: background var(--transition-time-02);
}
/* you can have multiple rules */
${selector}:hover {
background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
background-color: var(--el-bg-color-overlay);
}
`
            }
        ],
        [
            /^layout-border__left$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector}:before {
content: "";
position: absolute;
top: 0;
left: 0;
width: 1px;
height: 100%;
background-color: var(--el-border-color);
z-index: 3;
}
`
            }
        ],
        [
            /^layout-border__right$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector}:after {
content: "";
position: absolute;
top: 0;
right: 0;
width: 1px;
height: 100%;
background-color: var(--el-border-color);
z-index: 3;
}
`
            }
        ],
        [
            /^layout-border__top$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector}:before {
content: "";
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 1px;
background-color: var(--el-border-color);
z-index: 3;
}
`
            }
        ],
        [
            /^layout-border__bottom$/,
            ([], { rawSelector }) => {
                const selector = e(rawSelector)
                return `
${selector}:after {
content: "";
position: absolute;
bottom: 0;
left: 0;
width: 100%;
height: 1px;
background-color: var(--el-border-color);
z-index: 3;
}
`
            }
        ]
    ],
    presets: [presetUno(),  presetAttributify(), presetIcons()],
    shortcuts: {'panel-title':
        'pb-[5px] font-sans leading-[1.1] font-medium text-base text-[#6379bb] border-b border-b-solid border-[var(--el-border-color-light)] mb-5 mt-0',
    },
    transformers: [transformerVariantGroup()],
    content: {
        pipeline: {
            include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/]
        }
    }
})