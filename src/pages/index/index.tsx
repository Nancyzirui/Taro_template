import { View } from '@tarojs/components'
import Banner from '@/components/Banner'
import WaterfallFlow from '@/components/WaterfallFlow'
import CategoryScroll from '@/components/CategoryScroll'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { productService } from '@/services/product'
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

  // useEffect(() => {
  //   // 初始加载时自动计算第一个tab的位置
  //   const screenWidth = Taro.getSystemInfoSync().windowWidth || 375
  //   const initialScrollLeft = categories[0]?.width ?
  //     Math.max(0, categories[0].width - screenWidth/2) : 0
  //   setScrollLeft(initialScrollLeft)
  // }, [])

  const [categories, setCategories] = useState<{id: number, name: string, width: number}[]>([])

  useEffect(() => {
    // 获取分类列表
    productService.getCategoryList()
      .then(res => {
        const formattedCategories = res.data.map(item => ({
          id: item.id,
          name: item.name,
          width: 100 // 默认宽度
        }))
        setCategories(formattedCategories)
      })
      .catch(err => {
        console.error('获取分类列表失败:', err)
      })
  }, [])
/**
* 处理标签点击事件
*
* @param index 被点击标签的索引
* @param id 被点击标签的标识符
*/
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
    // console.log('Setting scrollLeft:', newScrollLeft)
    setScrollLeft(newScrollLeft)

    // console.log('Tab clicked:', index, 'ScrollLeft:', newScrollLeft, scrollLeft)
  }

  return (
    <View className='index'>
      <Banner />
      <CategoryScroll
        categories={categories}
        currentIndex={currentTabIndex}
        onTabClick={handleTabClick}
      />
      {categories.length > 0 ? (
        <WaterfallFlow
          key={categories[currentTabIndex]?.id} // 添加key强制重新渲染
          tabId={categories[currentTabIndex]?.id}
        />
      ) : (
        <View className="loading">加载分类中...</View>
      )}
    </View>
  )
}
