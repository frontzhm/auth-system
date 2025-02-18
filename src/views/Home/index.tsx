import React from 'react'
import style from './index.module.less'
import { Button, theme } from 'antd'

const { useToken } = theme

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  const { token } = useToken()
  return (
    <div className={style['page-home']}>
      <h1 className={style.title}>Home</h1>
      <p
        style={{
          backgroundColor: token.colorPrimaryBg,
          padding: token.padding,
          borderRadius: token.borderRadius,
          color: token.colorPrimaryText,
          fontSize: token.fontSize,
        }}
        className={style.content}
      >
        This is the home page.
      </p>
      <Button type='primary'>按钮</Button>
    </div>
  )
}

Home.displayName = 'Home'
export default Home
