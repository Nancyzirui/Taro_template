import { View, ScrollView, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useCallback } from 'react'
import ProductList from '@/components/ProductList'
import './index.scss'

export default function Product() {
  const [activeTab, setActiveTab] = useState(21)
  const [key, setKey] = useState(0) // 用于强制刷新WaterfallFlow

  // 模拟分类数据
  const categories = [
    { id: 21, name: '推荐' },
    { id: 22, name: '手机' },
    { id: 23, name: '电脑' },
    { id: 24, name: '家电' },
    { id: 25, name: '服饰' },
    { id: 26, name: '食品' },
    { id: 27, name: '美妆' },
    { id: 28, name: '运动' },
    { id: 31, name: '推荐' },
    { id: 32, name: '手机' },
    { id: 33, name: '电脑' },
    { id: 34, name: '家电' },
    { id: 35, name: '服饰' },
    { id: 36, name: '食品' },
    { id: 37, name: '美妆' },
    { id: 38, name: '运动' },
    { id: 41, name: '推荐' },
    { id: 42, name: '手机' },
    { id: 43, name: '电脑' },
    { id: 44, name: '家电' },
    { id: 45, name: '服饰' },
    { id: 46, name: '食品' },
    { id: 47, name: '美妆' },
    { id: 48, name: '运动' }
  ]

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
        {categories.map(category => (
          <View
            key={category.id}
            className={`category-item ${activeTab === category.id ? 'active' : ''}`}
            onClick={() => handleTabChange(category.id)}
          >
            <Text>{category.name}</Text>
          </View>
        ))}
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
        <ProductList tabId={activeTab} />
      </View>
    </View>
  )
}
