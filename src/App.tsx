import router from '@/router'
import { RouterProvider } from 'react-router-dom'
// import { Suspense } from 'react'
// import { Spin } from 'antd'

function App() {
  return (
    <div className='App'>
      {/* <Suspense fallback={<Spin fullscreen size='default' tip='页面正在加载...' />}> */}
      <RouterProvider router={router} />
      {/* </Suspense> */}
    </div>
  )
}
export default App
