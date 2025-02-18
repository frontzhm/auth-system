import React from 'react'
import style from './index.module.less'
import { Button } from 'antd'

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  return (
    <div className={style['page-home']}>
      <h1 className={style.title}>Home</h1>
      <p className={style.content}>This is the home page.</p>
      <Button>按钮</Button>
    </div>
  )
}

Home.displayName = 'Home'
export default Home
