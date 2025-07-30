import { View, Image, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { productService } from '@/services/product'
import type { ProductDetails } from '@/services/types'
import './index.scss'
import homeActive from "@/assets/tabbar/home.png"

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductDetails>({} as ProductDetails)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useLoad(async (options) => {
    const deliveryGoodsId = options.id
    if (!deliveryGoodsId) {
      setError('商品ID无效')
      return
    }

    setLoading(true)
    try {
      const response = await productService.getProductDetail(
        Number(deliveryGoodsId)
      )
      console.log('获取商品详情:', response)
      setProduct(response.data)
    } catch (err) {
      console.error('获取商品详情失败:', err)
      setError('加载商品详情失败，请重试')
    } finally {
      setLoading(false)
    }
  })

  return (
    <View className="product-detail-container">
      {/* 顶部商品展示区域 */}
      <View className="product-top">
        <Image
          className="product-image"
          src={product.logo}
          mode="aspectFill"
          lazyLoad
        />
        <View className="product-info">
          <Text className="product-title">{product.name}</Text>
          <Text className="product-price">¥{product.salePrice}</Text>
        </View>
      </View>

      {/* 使用说明区域 */}
      <View className="product-instruction">
        <Text className="instruction-title">使用说明</Text>
        <Image
          className="instruction-image"
            src={product.introduce}
          mode="widthFix"
          lazyLoad
        />
      </View>

      {/* 底部导航栏 */}
      <View className="footer_box">
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
    </View>
  )
}
