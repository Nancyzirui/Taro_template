import { enhanceRequest } from '@/utils/request-helper'
import type { BaseResponse, Product } from '@/services/types'
import type { RequestOptions } from '@/utils/request-helper'

interface CategoryItem {
  id: number
  name: string
  icon?: string
}

// 产品服务
export const productService = {
  // 获取分类列表
  getCategoryList: (options?: RequestOptions): Promise<BaseResponse<CategoryItem[]>> => {
    return enhanceRequest<CategoryItem[]>({
      url: '/goods/category/list',
      method: 'GET'
    }, {
      showLoading: false,
      ...options
    })
  },
  // 获取商品列表： 首页、产品页
  getProducts: (params?: Partial<{
    pageNum: number
    pageSize: number
    categoryId: number
  }>, options?: RequestOptions): Promise<BaseResponse<Product[]>> => {
    return enhanceRequest<Product[]>({
      url: '/goods/page/category',
      method: 'GET',
      data: params
    }, {
      showLoading: false, // 列表页通常自行处理加载状态
      ...options
    })
  },

  // 创建产品
  // createProduct: (data: Omit<Product, 'id'>, options?: RequestOptions): Promise<Product> => {
  //   return enhanceRequest<Product>({
  //     url: '/api/products',
  //     method: 'POST',
  //     data
  //   }, {
  //     showLoading: true,
  //     loadingText: '创建中...',
  //     retryCount: 1,
  //     ...options
  //   })
  // },
}
