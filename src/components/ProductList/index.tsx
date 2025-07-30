import { View, ScrollView, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { productService } from '@/services/product'
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
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // 真实数据加载
  const loadData = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await productService.getProducts({
        categoryId: tabId,
        pageNum: page,
        pageSize: 10
      })

      const newProducts = response.rows.map(item => ({
        id: item.id,
        image: item.logo || '',
        title: item.name,
        price: item.salePrice,
        loaded: false
      }))

      setProducts(prev => page === 1 ? newProducts : [...prev, ...newProducts])
      setHasMore(response.total ? page * 10 < response.total : false)
      setPage(prev => prev + 1)
    } catch (err) {
      console.error('加载商品失败:', err)
      setError('加载商品失败，请重试')
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
          <View
            key={product.id}
            className='product-item'
            onClick={() => {
              Taro.redirectTo({
                url: `/pages/productDetail/index?id=${product.id}`,
              })
            }}
          >
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
