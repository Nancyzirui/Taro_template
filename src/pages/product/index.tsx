import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { productService } from '@/services/product'
import './index.scss'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  // 获取产品列表
  const fetchProducts = async () => {
    setLoading(true)
    try {
      // 调用产品服务
      const data = await productService.getProducts()
      setProducts(data)
    } catch (error) {
      Taro.showToast({
        title: '获取产品失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 创建新产品
  const createProduct = async () => {
    const newProduct = {
      name: '新产品',
      price: 99.9,
      stock: 100
    }

    try {
      // 调用产品服务
      await productService.createProduct(newProduct)
      Taro.showToast({ title: '创建成功' })
      fetchProducts() // 刷新列表
    } catch (error) {
      Taro.showToast({
        title: '创建失败',
        icon: 'none'
      })
    }
  }

  useLoad(() => {
    fetchProducts()
  })

  return (
    <View className='product'>
      <Text>产品列表</Text>

      <Button onClick={fetchProducts} loading={loading}>
        {loading ? '加载中...' : '刷新列表'}
      </Button>

      <Button onClick={createProduct} style={{marginTop: '20px'}}>
        创建示例产品
      </Button>

      {products.map(item => (
        <View key={item.id} className="product-item">
          <Text>名称：{item.name}</Text>
          <Text>价格：¥{item.price}</Text>
          <Text>库存：{item.stock}</Text>
        </View>
      ))}
    </View>
  )
}
