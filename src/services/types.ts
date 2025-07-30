// API响应基础类型
export interface BaseResponse<T = any> {
  rows: T
  code: number
  message: string
  data: T,
  timestamp?: number
  requestId?: string
  total?: number
}

// 示例API返回数据类型
export interface SampleData {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

// 产品相关类型
export interface Product {
  goodsId: number
  id: number
  listPrice: number
  logo: string
  name: string
  salePrice: number
}
export interface ProductDetails {
  deductionPeriod?: boolean
  enabledPeriod?: boolean
  enabledSingle?: boolean
  externalUrl?: string
  goodsId: number
  id: number
  introduce: string
  listPrice: number
  logo: string
  name: string
  salePrice: number
  type: number
}
// 添加更多API返回数据类型...
