import { View, ScrollView, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useCallback, useEffect } from 'react'
import ProductList from '@/components/ProductList'
import { productService } from '@/services/product'
import './index.scss'

export default function Product() {
  const [activeTab, setActiveTab] = useState(0)
  const [key, setKey] = useState(0) // 用于强制刷新WaterfallFlow
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取分类数据
  useEffect(() => {
    setLoading(true)
    productService.getCategoryList()
      .then(res => {
        setCategories(res.data.map(item => ({
          id: item.id,
          name: item.name
        })))
        // 设置第一个分类为默认选中
        if (res.data.length > 0) {
          setActiveTab(res.data[0].id)
        }
      })
      .catch(err => {
        console.error('获取分类列表失败:', err)
        setError('加载分类失败，请重试')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // 分类切换处理
  const handleTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId)
    setKey(prev => prev + 1) // 改变key强制重新挂载WaterfallFlow
  }, [])

  useLoad(() => {
    // 初始化逻辑
  })

  return (
    <View className='product-container'>
      {/* 左侧分类区域 */}
      <ScrollView scrollY className='category-list'>
        {loading ? (
          <View className="loading">加载中...</View>
        ) : error ? (
          <View className="error">{error}</View>
        ) : categories.length === 0 ? (
          <View className="empty">暂无分类数据</View>
        ) : (
          categories.map(category => (
            <View
              key={category.id}
              className={`category-item ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => handleTabChange(category.id)}
            >
              <Text>{category.name}</Text>
            </View>
          ))
        )}
      </ScrollView>
      {/* 右侧商品区域 */}
      <View className='product-list'>
        {/* 筛选排序栏 */}
        {/* <View className='filter-bar'>
          <View className='filter-item'>
            <Text>综合</Text>
          </View>
          <View className='filter-item'>
            <Text>销量</Text>
          </View>
          <View className='filter-item'>
            <Text>价格</Text>
          </View>
          <View className='filter-item'>
            <Text>筛选</Text>
          </View>
        </View> */}

        {/* 瀑布流商品展示 */}
        {
          categories.length > 0 ? (
            <ProductList
              key={key} // 使用key强制重新渲染
              tabId={activeTab}
            />
          ) : (
            <View className="loading">加载商品中...</View>
          )
        }
      </View>
    </View>
  )
}
