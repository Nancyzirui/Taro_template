import { View, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
import './index.scss'

interface CategoryItem {
  id: number
  name: string
  icon?: string
  width?: number
}

interface CategoryScrollProps {
  categories: CategoryItem[]
  currentIndex?: number
  onTabClick?: (index: number, id: any) => void
}

export default function CategoryScroll({
  categories = [],
  currentIndex = 0,
  onTabClick
}: CategoryScrollProps) {
  const [scrollLeft, setScrollLeft] = useState(0)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const [screenWidth, setScreenWidth] = useState(375) // 默认375

  useEffect(() => {
    // 获取屏幕宽度
    const systemInfo = Taro.getSystemInfoSync()
    setScreenWidth(systemInfo.windowWidth || 375)
  }, [])

  useEffect(() => {
    if (itemRefs.current.length === 0) return

    // 计算总宽度和各项累计宽度
    let totalWidth = 0
    const accumulatedWidths: number[] = []

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const query = Taro.createSelectorQuery()
        query.select(`#category-item-${index}`).boundingClientRect()
        query.exec(res => {
          if (res && res[0]) {
            const width = res[0].width || 80 // 默认80
            totalWidth += width
            accumulatedWidths[index] = totalWidth
            categories[index].width = width // 更新宽度到数据

            // 如果是当前选中项，计算滚动位置
            if (index === currentIndex) {
              calculateScrollPosition(index, accumulatedWidths)
            }
          }
        })
      }
    })
  }, [categories, currentIndex])

  const calculateScrollPosition = (index: number, accumulatedWidths: number[]) => {
    if (accumulatedWidths.length <= index) return

    const itemWidth = categories[index].width || 80
    const itemPosition = accumulatedWidths[index] - itemWidth
    const targetScrollLeft = itemPosition - (screenWidth / 2) + (itemWidth / 2)

    setScrollLeft(Math.max(0, targetScrollLeft))
  }

  return (
    <View className='category-scroll'>
      <ScrollView
        className='scroll-container'
        scrollX
        scrollWithAnimation
        enhanced
        showScrollbar={false}
        scrollLeft={scrollLeft}
        enableFlex
        enable-passive
      >
        {categories.map((item, index) => (
          <View
            id={`category-item-${index}`}
            ref={el => itemRefs.current[index] = el}
            key={item.id}
            className={`category-item ${currentIndex === index ? 'active' : ''}`}
            onClick={() => onTabClick?.(index, item.id)}
          >
            {item.icon && (
              <Image
                src={item.icon}
                mode='aspectFill'
                className='category-icon'
              />
            )}
            <View className='category-name'>{item.name}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
