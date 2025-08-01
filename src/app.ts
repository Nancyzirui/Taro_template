import { PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren<{}>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App
