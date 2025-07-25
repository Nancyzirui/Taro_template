import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import bannerImg from '../../assets/index/banner1.png'
import './index.scss'

interface BannerProps {
  // 可以添加需要的props
}

export default function Banner(props: BannerProps) {
  return (
    <View className='banner_box'>
      <Swiper
        className='banner-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical={false}
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='banner-item'>
            <Image
              src={bannerImg}
              mode="aspectFill"
              style={{width: '100%', height: '100%'}}
              onError={(e) => console.error('图片加载失败:', e.detail.errMsg)}
            />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='banner-item'>
            <Image
              src={bannerImg}
              mode="aspectFill"
              style={{width: '100%', height: '100%'}}
              onError={(e) => console.error('图片加载失败:', e.detail.errMsg)}
            />
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='banner-item'>
            <Image
              src={bannerImg}
              mode="aspectFill"
              style={{width: '100%', height: '100%'}}
              onError={(e) => console.error('图片加载失败:', e.detail.errMsg)}
            />
          </View>
        </SwiperItem>
      </Swiper>
    </View>
  )
}
