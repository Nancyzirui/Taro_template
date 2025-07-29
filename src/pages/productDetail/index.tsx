import { View, Image, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'
import banner from "@/assets/index/banner1.png"
import homeActive from "@/assets/tabbar/home.png"

export default function ProductDetail() {
  const [product, setProduct] = useState({
    id: 0,
    title: '商品名称',
    price: 99,
    image: 'https://picsum.photos/400/400?random=0'
  })

  useLoad((options) => {
    const id = options.id || 0
    // 模拟根据ID获取商品详情
    setProduct({
      id,
      title: `商品${id}`,
      price: Math.floor(Math.random() * 500) + 100,
    image: `https://picsum.photos/400/400?random=${id}`
    })
  })

  return (
    <View className="product-detail-container">
      {/* 顶部商品展示区域 */}
      <View className="product-top">
        <Image
          className="product-image"
          src={product.image}
          mode="aspectFill"
          lazyLoad
        />
        <View className="product-info">
          <Text className="product-title">{product.title}</Text>
          <Text className="product-price">¥{product.price}</Text>
        </View>
      </View>

      {/* 使用说明区域 */}
      <View className="product-instruction">
        <Text className="instruction-title">使用说明</Text>
        <Image
          className="instruction-image"
            src={banner}
          mode="widthFix"
          lazyLoad
        />
      </View>

      {/* 底部导航栏 */}
      <View className="product-footer">
        <View className="footer-button">
          <Image
            className="footer-icon"
            src={homeActive}
          />
          <Text>首页</Text>
        </View>
        <View className="footer-button primary">
          <Text>单次支付</Text>
        </View>
        <View className="footer-button secondary">
          <Text>包月支付</Text>
        </View>
      </View>
    </View>
  )
}
