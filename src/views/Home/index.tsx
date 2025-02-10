import React, { useEffect } from 'react'
import request from '@/utils/request'

type HomeProps = {}
const Home: React.FC<HomeProps> = () => {
  useEffect(() => {
    request.get('/api/home').then((res: any) => {
      console.log(res)
    })
  }, [])
  return <div>Home</div>
}

Home.displayName = 'Home'
export default Home
