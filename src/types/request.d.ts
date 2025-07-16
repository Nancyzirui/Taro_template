declare module '@/utils/request' {
  interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    header?: Record<string, string>
  }

  interface ResponseData<T = any> {
    code: number
    message: string
    data: T
  }

  export default function request<T = any>(options: RequestOptions): Promise<ResponseData<T>>
}