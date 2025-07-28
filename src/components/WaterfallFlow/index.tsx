import { View, ScrollView, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.scss'

interface WaterfallItem {
  id: number
  coverImage: string
  title: string
  price: number
  // 其他可能的字段
}

interface WaterfallFlowProps {
  tabId: number
}

const WaterfallFlow: React.FC<WaterfallFlowProps> = ({ tabId }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<WaterfallItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [placeholderHeight, setPlaceholderHeight] = useState(0)

  // 获取图片高度比例，用于占位
  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    const width = (systemInfo.windowWidth || 375) / 2 - 10 // 两列布局，减去间距
    setPlaceholderHeight(width * 1.3) // 假设图片比例为1:1.3
  }, [])

  // 模拟数据获取
  const fetchData = async (currentPage: number) => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟数据 - 实际项目中替换为真实API调用
      const mockData: WaterfallItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + (currentPage - 1) * 10,
        coverImage: `https://picsum.photos/300/400?random=${i + (currentPage - 1) * 10}`,
        title: `商品${i + (currentPage - 1) * 10}`,
        price: Math.floor(Math.random() * 1000) + 100
      }))

      setData(prev => [...prev, ...mockData])
      setPage(currentPage + 1)
      setHasMore(currentPage < 5) // 模拟最多5页数据
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和tab切换时重新加载
  useEffect(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    // 先显示骨架屏，再加载数据
    const timer = setTimeout(() => {
      fetchData(1)
    }, 300) // 稍微延迟让骨架屏显示一会儿
    return () => clearTimeout(timer)
  }, [tabId])

  // 上拉加载更多
  const handleScrollToLower = () => {
    fetchData(page)
  }

  // 监听页面滚动到底部
  useEffect(() => {
    console.log('🔄 初始化滚动监听，当前环境:', process.env.TARO_ENV)
    const handleReachBottom = () => {
      console.log('✅ 触发滚动到底部事件')
      if (!loading && hasMore) {
        console.log('⏳ 开始加载第', page, '页数据...')
        handleScrollToLower()
      }
    }

    // 抖音小程序特殊处理
    if (process.env.TARO_ENV === 'tt') {
      console.log('?? 初始化抖音小程序滚动监听')
      // 抖音小程序需要使用页面事件
      const pageInstance = Taro.getCurrentInstance()
      if (pageInstance?.page?.onReachBottom) {
        console.log('🔔 注册抖音onReachBottom事件')
        pageInstance.page.onReachBottom = () => {
          console.log('🎯 抖音onReachBottom触发')
          handleReachBottom()
        }
      }
      return () => {
        console.log('🧹 清理抖音小程序事件监听')
      }
    }
    // 京东小程序特殊处理
    else if (process.env.TARO_ENV === 'jd') {
      console.log('🛒 初始化京东小程序滚动监听')
      // 京东小程序需要使用页面事件
      const pageInstance = Taro.getCurrentInstance()
      if (pageInstance?.page?.onReachBottom) {
        console.log('🔔 注册京东onReachBottom事件')
        pageInstance.page.onReachBottom = () => {
          console.log('🎯 京东onReachBottom触发')
          handleReachBottom()
        }
      }
      return () => {
        console.log('🧹 清理京东小程序事件监听')
      }
    }
    // 其他环境使用通用监听
    else {
      console.log('🖱️ 初始化通用滚动监听')
      const scrollHandler = () => {
        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const clientHeight = document.documentElement.clientHeight
        const distanceToBottom = scrollHeight - scrollTop - clientHeight
        console.log('📏 当前滚动位置:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          distanceToBottom
        })
        if (distanceToBottom < 100) {
          handleReachBottom()
        }
      }

      window.addEventListener('scroll', scrollHandler)
      return () => {
        window.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [loading, hasMore, handleScrollToLower])

  return (
    <View className='waterfall-flow'>
      <View className='waterfall-container'>
        {data.map(item => (
          <View key={item.id} className='waterfall-item'>
            <View className='image-container'>
              <Image
                src={item.coverImage}
                mode='aspectFill'
                lazyLoad
                className='product-image'
                onLoad={() => console.log('Image loaded:', item.id)}
                onError={() => console.log('Image load error:', item.id)}
              />
              {/* 占位图 - 图片加载前显示 */}
              <View
                className='placeholder'
                style={{ height: `${placeholderHeight}px` }}
              />
            </View>
            <Text className='title'>{item.title}</Text>
            <Text className='price'>¥{item.price}</Text>
          </View>
        ))}
        {loading && page === 1 ? (
          // 首屏加载时显示骨架屏
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`skeleton-${i}`} className='skeleton-item'>
                <View className='skeleton-image' style={{ height: `${placeholderHeight}px` }} />
                <View className='skeleton-title' />
                <View className='skeleton-price' />
              </View>
            ))}
          </>
        ) : loading ? (
          <View className='loading-more'>
            <Text>加载中...</Text>
          </View>
        ) : null}
        {!hasMore && (
          <View className='no-more'>
            <Text>没有更多了</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default WaterfallFlow
