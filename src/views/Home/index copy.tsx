import React from 'react'
import style from './index.module.less'
import { Button, theme } from 'antd'
import { useEffect, useRef } from 'react'

const { useToken } = theme

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) {
      return
    }
    // 获取 contentRef 的父节点
    // @ts-ignore
    const parent = contentRef.current?.parentElement
    // 创建一个观察者实例
    // 当 MutationObserver 检测到 childList 变化时，它会检查 contentRef.current 是否仍然存在于 document.body 中。如果不存在，说明该元素被删除了，于是我们重新将其添加到 document.body 中。
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 检查 contentRef 是否被删除
          if (!document.body.contains(contentRef.current)) {
            // 如果被删除，重新添加,=，添加到第一个子节点
            parent.insertBefore(contentRef.current, parent.firstChild)
          }
        }
      }
    })

    // 开始观察 body 的子节点变化
    observer.observe(document.body, { childList: true, subtree: true })

    // 清理 observer
    return () => {
      observer.disconnect()
    }
  }, [])
  const { token } = useToken()
  return (
    <div className={style['page-home']}>
      <h1 className={style.title} ref={contentRef}>
        Home
      </h1>
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
