import { View, ScrollView, Image, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './index.scss'

interface ProductItem {
  id: number
  image: string
  title: string
  price: number
  loaded?: boolean
}

interface ProductListProps {
  tabId: number
}

export default function ProductList({ tabId }: ProductListProps) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initializing, setInitializing] = useState(true)

  // 模拟数据加载
  const loadData = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))

      const newProducts = Array.from({ length: 16 }, (_, i) => ({
        id: i + products.length,
        image: `https://picsum.photos/200/200?random=${i + products.length}`,
        title: `商品${i + products.length}`,
        price: Math.floor(Math.random() * 500) + 100,
        loaded: false
      }))

      setProducts(prev => [...prev, ...newProducts])
      setHasMore(products.length < 50)
    } finally {
      setLoading(false)
      setInitializing(false)
    }
  }

  // 图片加载完成处理
  const handleImageLoad = (id: number) => {
    setProducts(prev =>
      prev.map(item =>
        item.id === id ? {...item, loaded: true} : item
      )
    )
  }

  // 分类切换时重置数据
  useEffect(() => {
    setProducts([])
    setInitializing(true)
    loadData()
  }, [tabId])

  return (
    <ScrollView
      scrollY
      className='product-scroll'
      onScrollToLower={loadData}
    >
      <View className='product-grid'>
        {products.map(product => (
          <View key={product.id} className='product-item'>
            <View className='image-container'>
              <Image
                src={product.image}
                mode='aspectFill'
                className={`product-image ${product.loaded ? 'loaded' : ''}`}
                lazyLoad
                onLoad={() => handleImageLoad(product.id)}
              />
              {!product.loaded && (
                <View className='placeholder' />
              )}
            </View>
            <Text className='product-title'>{product.title}</Text>
            <Text className='product-price'>¥{product.price}</Text>
          </View>
        ))}
      </View>

      {(initializing || loading) && (
        <View className='skeleton-grid'>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`skeleton-${i}`} className='skeleton-item'>
              <View className='skeleton-image' />
              <View className='skeleton-title' />
              <View className='skeleton-price' />
            </View>
          ))}
        </View>
      )}

      {!hasMore && <Text className='no-more'>没有更多了</Text>}
    </ScrollView>
  )
}
