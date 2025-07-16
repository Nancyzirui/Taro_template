// API响应基础类型
export interface BaseResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: number
  requestId?: string
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
  id: number
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock: number
  images?: string[]
  createdAt?: string
  updatedAt?: string
  status?: 'ON_SHELF' | 'OFF_SHELF'
}

// 添加更多API返回数据类型...
