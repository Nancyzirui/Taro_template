import { enhanceRequest } from '@/utils/request-helper'
import type { RequestOptions } from '@/utils/request-helper'
import type { SampleData, BaseResponse } from '@/services/types'

export const commonService = {
  // 通用数据获取
  getData: (params?: Record<string, any>, options?: RequestOptions): Promise<BaseResponse<SampleData>> => {
    return enhanceRequest<SampleData>({
      url: '/api/data',
      method: 'GET',
      data: params
    }, options)
  },
  // TT登录（包含用户基础信息）
  ttLogin: (
    code: string,
    anonymousCode?: string,
    options?: RequestOptions & {
      extraData?: {
        nickName?: string
        avatarUrl?: string
      }
    }
  ): Promise<BaseResponse<{token: string}>> => {
    return enhanceRequest({
      url: '/login/douyin',
      method: 'POST',
      data: {
        code,
        anonymousCode,
        ...(options?.extraData || {})
      }
    }, options)
  },

  // 获取用户信息
  getUserInfo: (options?: RequestOptions): Promise<BaseResponse<{
    nickname: string
    avatar: string
  }>> => {
    return enhanceRequest({
      url: '/api/user/info',
      method: 'GET'
    }, options)
  }
}
// 获取分类列表
export const getCategoryList = (options?: RequestOptions): Promise<BaseResponse<Array<{ id: number; name: string }>>> => {
  return enhanceRequest({
    url: '/goods/category/list',
    method: 'GET'
  }, options)
}
