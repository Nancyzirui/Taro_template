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

  return (
    <ScrollView
      className='waterfall-flow'
      scrollY
      onScrollToLower={handleScrollToLower}
      lowerThreshold={100}
    >
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
    </ScrollView>
  )
}

export default WaterfallFlow
