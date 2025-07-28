import { View, Text, Button, ScrollView } from '@tarojs/components'
import Banner from '@/components/Banner'
import WaterfallFlow from '@/components/WaterfallFlow'
import CategoryScroll from '@/components/CategoryScroll'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.scss'

interface DataType {
  id: number
  name: string
  // 添加更多字段...
}

export default function Index () {
  const [data, setData] = useState<DataType | null>(null)
  const [error, setError] = useState<string | null>(null)


  useLoad(() => {
    // 可选：页面加载时自动请求
    // fetchData()
  })
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    // 初始加载时自动计算第一个tab的位置
    const screenWidth = Taro.getSystemInfoSync().windowWidth || 375
    const initialScrollLeft = categories[0]?.width ?
      Math.max(0, categories[0].width - screenWidth/2) : 0
    setScrollLeft(initialScrollLeft)
  }, [])

  const categories = [
    { id: 1, name: '推荐', width: 100 },
    { id: 2, name: '热门', width: 100 },
    { id: 3, name: '新品', width: 100 },
    { id: 4, name: '折扣', width: 100 },
    { id: 5, name: '美食', width: 100 },
    { id: 6, name: '服饰', width: 100 },
    { id: 7, name: '数码', width: 100 },
    { id: 8, name: '家居', width: 100 },
    { id: 11, name: '推荐', width: 100 },
    { id: 12, name: '热门', width: 100 },
    { id: 13, name: '新品', width: 100 },
    { id: 14, name: '折扣', width: 100 },
    { id: 15, name: '美食', width: 100 },
    { id: 16, name: '服饰', width: 100 },
    { id: 17, name: '数码', width: 100 },
    { id: 18, name: '家居', width: 100 },
  ]
  const handleTabClick = (index: number, id: any) => {
    setCurrentTabIndex(index)

    // 确保获取有效的屏幕宽度
    const screenWidth = Taro.getSystemInfoSync().windowWidth || 375 // 默认375
    // 计算滚动位置 - 更健壮的计算方式
    let newScrollLeft = 0
    for (let i = 0; i < index; i++) {
      const itemWidth = Number(categories[i]?.width) // 确保转换为数字
      newScrollLeft += itemWidth
    }
    // 减去一半屏幕宽度，使选中项居中
    newScrollLeft = Math.max(0, newScrollLeft - (screenWidth / 2) + (categories[index]?.width || 0)/2)
    // 确保最终值是有效数字
    console.log('Setting scrollLeft:', newScrollLeft)
    setScrollLeft(newScrollLeft)

    console.log('Tab clicked:', index, 'ScrollLeft:', newScrollLeft, scrollLeft)
  }

  return (
    <View className='index'>
      <Banner />
      <CategoryScroll
        categories={categories}
        currentIndex={currentTabIndex}
        onTabClick={handleTabClick}
      />
      <WaterfallFlow tabId={categories[currentTabIndex]?.id || 1} />
    </View>
  )
}
