// 产品Api
import request from '@/utils/request'
import { AxiosPromise, AxiosResponse } from 'axios'

enum Api {
  list = '/product/list',
  add = '/product/add',
  edit = '/product/edit',
  delete = '/product/deleteProduct',
  objectModelList = '/product/getThingModelByProductKey',
  saveObjectModel = '/product/thingModel/save',
  productModelList = '/product/getModelsByProductKey',
  productModelSave = '/product/productModel/edit',
  productModelDelete = '/product/productModel/delete',
  productIconTypeSave = '/product/icon/saveIconType',
  productIconTypeDel = '/product/icon/deleteIconType',
  productIconTypeList = '/product/icon/getAllIconType',
  productIconSave = '/product/icon/saveIcon',
  productIconDel = '/product/icon/deleteIcon',
  productIconList = '/product/icon/getAllIcon',
}
export interface IProductsVO {
  id?: number
  productKey: string
  category: string
  createAt: number
  img: string
  iconId?: number
  name: string
  nodeType: number
  transparent: string
  isOpenLocate: boolean
  locateUpdateType: string
  uid: string
}
interface IPage {
  pageNum?: number
  pageSize?: number
}
export interface IconsVo {
  id?: number
  iconTypeId: number
  iconName: string
  viewBox: string
  xmlns: string
  version: string
  iconContent: string
}
export interface IconTypesVo {
  id?: number
  typeName: string
  typeDescribe: string
}

// 获取图标分类列表
export const getIconTypesList = () => {
  return request({
    url: Api.productIconTypeList,
    method: 'post'
  })
}

// 获取分页图标列表
export const getIconsList = (data?: IPage): AxiosPromise<AxiosResponse<IconsVo[]>> => {
  return request({
    url: Api.productIconList,
    method: 'post',
    data,
  })
}

// 删除图标分类
export const deleteIconType = (data: string | number) => {
  return request({
    url: Api.productIconTypeDel,
    method: 'post',
    data,
  })
}

// 删除图标
export const deleteIcon = (data: string | number) => {
  return request({
    url: Api.productIconDel,
    method: 'post',
    data,
  })
}
// 保存图标分类
export const saveIconType = (data: IconTypesVo) => {
  return request({
    url: Api.productIconTypeSave,
    method: 'post',
    data,
  })
}
// 保存图标
export const saveIcon = (data: IconsVo) => {
  return request({
    url: Api.productIconSave,
    method: 'post',
    data,
  })
}

// 获取列表
export const getProductsList = (data?: IPage): AxiosPromise<AxiosResponse<IProductsVO[]>> => {
  return request({
    url: Api.list,
    method: 'post',
    data,
  })
}

// 编辑、保存
export const saveProducts = (data: IProductsVO) => {
  return request({
    url: !data.id ? Api.add : Api.edit,
    method: 'post',
    data,
  })
}
export const deleteProduct = (data) => {
  return request({
    url: Api.delete,
    method: 'post',
    data,
  })
}
// 获取物模型
export const getObjectModel = (data: string | number) => {
  return request({
    url: Api.objectModelList,
    method: 'post',
    data,
  })
}

// 保存物模型
export const saveObjectModel = (data) => {
  return request({
    url: Api.saveObjectModel,
    method: 'post',
    data,
  })
}

// 获取型号
export const getProductModelList = (data) => {
  return request({
    url: Api.productModelList,
    method: 'post',
    data,
  })
}
// 保存型号
export const saveProductModel = (data) => {
  return request({
    url: Api.productModelSave,
    method: 'post',
    data,
  })
}

// 删除型号
export const deleteProductModel = (data: string | number) => {
  return request({
    url: Api.productModelDelete,
    method: 'post',
    data,
  })
}
