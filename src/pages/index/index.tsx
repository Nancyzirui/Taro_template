import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
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
    console.log('Page loaded.')
    // 可选：页面加载时自动请求
    // fetchData()
  })

  return (
    <View className='index'>
      <Text>首页</Text>

      {error && <Text className="error">{error}</Text>}

      {data && (
        <View className="data-container">
          <Text>数据获取成功：</Text>
          <Text>{JSON.stringify(data)}</Text>
        </View>
      )}
    </View>
  )
}
