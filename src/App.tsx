import router from '@/router'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { useEffect } from 'react'

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser)
  useEffect(() => {
    fetchUser()
  }, [])

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
