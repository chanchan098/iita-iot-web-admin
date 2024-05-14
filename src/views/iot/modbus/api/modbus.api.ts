// modbusInfo api
import request from '@/utils/request'
import { AxiosPromise, AxiosResponse } from 'axios'

enum Api {
  list = '/modbus/list',
  add = '/modbus/add',
  edit = '/modbus/edit',
  delete = '/modbus/deleteModbus',
  objectModelList = '/modbus/getThingModelByProductKey',
  saveObjectModel = '/modbus/thingModel/save',
  syncToProduct = '/modbus/syncToProduct',
}
export interface IModBusInfo {
  id?: number
  name: string
  productKey: string
  remark: string
  createAt: number
  updateAt: number
  uid: string
}
interface IPage {
  pageNum?: number
  pageSize?: number
}
// 获取列表
export const getModbusList = (data?: IPage): AxiosPromise<AxiosResponse<IModBusInfo[]>> => {
  return request({
    url: Api.list,
    method: 'post',
    data,
  })
}

// 编辑、保存
export const saveModbus = (data: IModBusInfo) => {
  return request({
    url: !data.id ? Api.add : Api.edit,
    method: 'post',
    data,
  })
}
export const deleteModbus = (data) => {
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

export const syncToProduct = (data) => {
  return request({
    url: Api.syncToProduct,
    method: 'post',
    data,
  })
}
