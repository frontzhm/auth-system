import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // @配置根目录, 默认是当前目录,index.html所在目录
  base: '/', // @配置基础路径, 默认是/,如果配置/base/，那么访问路径就是http://localhost:3000/base/index.html
  publicDir: 'public', // @配置静态资源目录, 默认是public
  // @配置别名
  resolve: { alias: { '@': '/src', }, },
  server: {
    // port: 3000, // @配置端口号, 默认是3000
    // open: true, // @配置是否自动打开浏览器, 默认是false
    proxy: { // @配置代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },

})
