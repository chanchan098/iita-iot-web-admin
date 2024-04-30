<template>
  <div class="relative" :style="{ width: width }">
    <el-input v-if="dataMode===DataModeEnum.LOCAL" v-model="modelValue" readonly @click="visible = !visible" placeholder="点击选择图标">
      <template #prepend>
        <svg-icon :icon-class="modelValue as string" />
      </template>
    </el-input>
    <el-input v-else :value="state.curIcon.iconName" readonly @click="visible = !visible" placeholder="点击选择图标">
      <template #prepend v-if="state.curIcon">
        <svg-icon color="var(--el-text-color-regular)" :dataMode="DataModeEnum.REMOTE" width="2em" height="2em" 
        :viewBox="state.curIcon.viewBox" :xmlns="state.curIcon.xmlns" :version="state.curIcon.version" :pathData="state.curIcon.iconContent"/>
      </template>
    </el-input>

    <el-popover shadow="none" :visible="visible" placement="bottom-end" trigger="click" :width="450">
      <template #reference>
        <div @click="visible = !visible" class="cursor-pointer text-[#999] absolute right-[10px] top-0 height-[32px] leading-[32px]">
          <i-ep-caret-top v-show="visible" />
          <i-ep-caret-bottom v-show="!visible" />
        </div>
      </template>

      <el-input class="p-2" v-model="filterValue" placeholder="搜索图标" clearable @input="filterIcons" />

      <el-scrollbar v-if="dataMode===DataModeEnum.LOCAL" height="300px">
        <ul class="icon-list">
          <el-tooltip v-for="(iconName, index) in iconNames" :key="index" :content="iconName" placement="bottom" effect="light">
            <li :class="['icon-item', {active: modelValue == iconName}]" @click="selectedIcon(iconName)">
              <svg-icon color="var(--el-text-color-regular)" :icon-class="iconName" />
            </li>
          </el-tooltip>
        </ul>
      </el-scrollbar>
      <el-tabs v-else
            v-model="editableTabsValue"
            type="card"
            editable
            class="demo-tabs"
            @edit="tabsEdit"
            @tab-change="changeTab"
            >
              <el-tab-pane
                v-for="item in state.iconTypes"
                :key="item.id"
                :label="item.typeName"
                :name="item.id"
              >
                <el-scrollbar max-height="230px">
                  <ul class="icon-list">
                    <li class="icon-item" @click="addIcon(item)">
                        <div class="p-item">
                          <el-icon><Plus /></el-icon>  
                        </div>
                      </li>
                    <el-tooltip v-for="(icon, index) in svgs" :key="index" :content="icon.iconName" placement="bottom" effect="light">
                      <li :class="['icon-item', {active: modelValue == icon.id}]"  @click="selectedIconRemote(icon)">
                        <svg-icon color="var(--el-text-color-regular)" :dataMode="DataModeEnum.REMOTE" width="2em" height="2em" 
                        :viewBox="icon.viewBox" :xmlns="icon.xmlns" :version="icon.version" :pathData="icon.iconContent"/>
                        <el-icon class="close-i" @click.stop="delIcon(icon.id)"><Close /></el-icon>
                      </li>
                    </el-tooltip>
                  </ul>
                </el-scrollbar>
                <el-pagination :page-size="state.page.pageSize" :current-change="state.page.pageNum" @current-change="changNum" small layout="prev, pager, next, jumper" :total="state.total" />
              </el-tab-pane>
              <el-dialog
                title="添加图标"
                v-model="addIconVisible"
                width="400px"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                append-to-body
                destroy-on-close
                @close="initHandle"
              >
                <el-form v-if="addIconVisible" ref="formRef" :model="state.iconForm" :rules="state.rules" label-width="80px">
                  <el-form-item label="所属分类" prop="iconTypeId">
                    <el-select v-model="state.iconForm.iconTypeId" placeholder="请选择所属分类" style="width: 290px">
                      <el-option
                        v-for="item in state.iconTypes"
                        :key="item.id"
                        :label="item.typeName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="图标名称" prop="iconName">
                    <el-input v-model="state.iconForm.iconName"  placeholder="请输入图标名称"/>
                  </el-form-item>
                  <el-form-item label="图标内容" prop="svgStr">
                    <el-input :autosize="{ minRows: 2, maxRows: 8}" type="textarea" v-model="state.svgStr"  placeholder="请输入SVG代码,建议尽量选择简约风图标"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitAddIcon">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import icons from '@/components/IconSelect/requireIcons'
import { DataModeEnum } from '@/enums/DataModeEnum'
import { PropType } from 'vue';
import type { TabPaneName } from 'element-plus'
import { getIconTypesList,getIconsList,
  deleteIconType,deleteIcon,
  saveIconType,saveIcon
 } from '@/views/iot/equipment/api/products.api'

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    require: true
  },
  width: {
    type: String,
    require: false,
    default: '400px'
  },
  data:{
    type: Object,
    default: {}
  },
  dataMode: {
      type: String as PropType<DataModeEnum>,
      default: DataModeEnum.LOCAL,
      validator: (value: string): boolean => {
        return Object.values(DataModeEnum).includes(value as DataModeEnum);
      }
    }
})
const formRef = ref()
const emit = defineEmits(['update:modelValue'])
const visible = ref(false)
const addIconVisible = ref(false)
const popconfirmOpen = ref(false)
const editableTabsValue = ref()
const { modelValue, width } = toRefs(props)
const iconNames = ref<string[]>(icons)
const filterValue = ref('')
const svgAttrs = ['version', 'viewBox', 'xmlns'];
const initialIconForm = {
  iconTypeId: null,
  iconName: '',
  viewBox: '',
  xmlns: '',
  version: '',
  iconContent: ''
};
const state = reactive<any>({
  page: {
    pageSize: 31,
    pageNum: 1,
  },
  total: 0,
  iconTypes:[],
  icons:[],
  iconTypeForm: {
    typeName: '',
    typeDescribe: ''
  },
  curIcon:{},
  svgStr:'',
  iconForm: {...initialIconForm},
  rules: {
    iconName: [{ required: true, message: '请输入图标名称', trigger: 'blur' }],
    iconTypeId: [{ required: true, message: '请选择图标分类', trigger: 'blur' }]
  }
})
const svgs = computed(() => {
  return state.icons.filter(item => {
        return item.iconContent.replace(/\\\\/g, "\\");
      });
})
/**
 * 筛选图标
 */
const filterIcons = () => {
  if (filterValue.value) {//输入搜索图标后
    if(props.dataMode===DataModeEnum.LOCAL){//本地模式筛选
      iconNames.value = icons.filter(iconName =>
      iconName.includes(filterValue.value)
    )
    }else{//远程模式筛选
      state.icons=state.icons.filter(i =>
      i.iconName.includes(filterValue.value)
    )
    }
  } else {
    if(props.dataMode===DataModeEnum.LOCAL){
      iconNames.value = icons
    }else{
      getIcons(editableTabsValue.value)
    }
  }
}
/**
 * 选择图标
 * @param iconName 选择的图标名称
 */
const selectedIcon = (iconName: string) => {
  emit('update:modelValue', iconName)
  visible.value = false
}
const selectedIconRemote = (icon: any) => {
  emit('update:modelValue', icon.id)
  state.curIcon=icon
  visible.value = false
}
const changNum = (value: number) => {
  state.page.pageNum=value
  getIcons(editableTabsValue.value)
}
const submitAddIcon = () => {
  if(state.svgStr==''){
    ElMessage({
          type: 'warning',
          message: '图标内容不能为空',
        })
    return
  }else{
    formRef.value.validate((valid) => {
      if (valid) {
        const parser = new DOMParser();
        const svgDom = parser.parseFromString(state.svgStr, 'image/svg+xml');
        const svgElement = svgDom.documentElement;
        if(svgElement.nodeName !== 'svg'){
          ElMessage({
          type: 'warning',
          message: '请输入正确的SVG代码',
          })
          return
        }
        for (let i = 0; i < svgElement.attributes.length; i++) {
          const attr = svgElement.attributes[i];
          if(svgAttrs.includes(attr.name)){
            state.iconForm[attr.name]=attr.value
          }
        }
        state.iconForm.iconContent = Array.from(svgElement.children).map(child => child.outerHTML).join('');
        saveIcon(state.iconForm).then(() => {
          ElMessage({
            type: 'success',
            message: '添加成功',
          })
          initHandle()
          getIcons(editableTabsValue.value)
          addIconVisible.value = false
        })
      }
    })
  }
}
const initHandle = () => {
  state.iconForm={...initialIconForm}
  state.svgStr=''
}
const addIcon = (i) => {
  state.iconForm.iconTypeId=i.id
  addIconVisible.value = true
}
const changeTab = (name: TabPaneName) => {
  getIcons(name)
}
const tabsEdit = (
  targetName: TabPaneName | undefined,
  action: 'remove' | 'add'
) => {
  if (action === 'add') {
    ElMessageBox.prompt('', '添加图标分类', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern:/^[\s\S]*.*[^\s][\s\S]*$/,
    inputErrorMessage: '输入内容不能为空',
  })
    .then(({ value }) => {
      saveIconTypeHandle({typeName:value})
    })
    .catch(() => {
    })
  } else if (action === 'remove') {
    ElMessageBox.confirm(
    '确定删除该数据吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delIconType(targetName)
    }).catch(() => {
    })
  }
}

// 获取图标分类列表
const getIconTypes = () => {
  getIconTypesList().then((res) => {
    res = res || {}
    state.iconTypes = res.data || []
    if(state.iconTypes.length>0){
      editableTabsValue.value = state.iconTypes[0].id
    }
  })
}
// 删除图标分类
const delIconType = (id) => {
  deleteIconType(id).then((res) => {
    if(res){
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getIconTypes()
    }else{
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
  })
}
// 删除图标
const delIcon = (id) => {
  ElMessageBox.confirm(
    '确定删除该数据吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteIcon(id).then((res) => {
    if(res){
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getIcons(editableTabsValue.value)
    }else{
      ElMessage({
        type: 'error',
        message: '删除失败',
      })
    }
    })
    }).catch(() => {
    })
  
}
// 获取图标列表
const getIcons = (typeId) => {
  getIconsList({
    ...state.page,
    iconTypeId:typeId
  }).then((res) => {
    state.icons = res.data.rows || []
    state.total = res.data.total
  })
}
// 保存图标分类
const saveIconTypeHandle = (data) => {
  saveIconType(toRaw(data))
    .then((res) => {
      ElMessage.success('添加成功')
      getIconTypes()
    })
}
getIconTypes()
watch(() => props.data, (v) => {
  if(v!=null){
    state.curIcon=v
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.el-divider--horizontal {
  margin: 10px auto !important;
}
.icon-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 0;

  .icon-item {
    cursor: pointer;
    width: 10%;
    margin: 0 10px 10px 0;
    padding: 9px 6px 6px 6px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    border: 1px solid #ccc;
    position: relative;
    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
      transition: all 0.2s;
      transform: scaleX(1.1);
      & .close-i {
        display: inline-block; 
      }
    }
  }
  .close-i{
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background-color: transparent;
    font-size: 0.8em;
    cursor: pointer;
    outline: none;
    display: none;
  }
  .active {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
      .close-i{
        display: inline-block; 
      }
    }
}
.p-2{
  padding: 0.5rem 0;
}
:deep(.el-tabs__header) {
  margin: 0 !important;
}
.p-item{
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
