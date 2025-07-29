export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/product/index',
    'pages/profile/index',
    'pages/auth/index',
    'pages/productDetail/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    // navigationBarTitleText: 'WeChat',
    // navigationBarTextStyle: 'black',
    // enablePullDownRefresh: true
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/product/index',
        text: '产品',
        iconPath: 'assets/tabbar/product.png',
        selectedIconPath: 'assets/tabbar/product-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.png',
        selectedIconPath: 'assets/tabbar/mine-active.png'
      }
    ],
    color: '#999',
    selectedColor: '#3498db',
    backgroundColor: '#fff',
    borderStyle: 'black'
  }
})
