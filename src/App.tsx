import router from '@/router'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#24be91',
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  )
}
export default App
