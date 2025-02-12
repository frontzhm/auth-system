
const configMap = {
  dev: {
    baseURL: 'http://localhost:3000',
  },
  test: {
    baseURL: 'http://test.api.example.com',
  },
  prod: {
    baseURL: 'http://api.example.com',
  },
}

const env = (() => {
  const href = window.location.href
  if (href.includes('localhost')) {
    return 'dev'
  }
  if (href.includes('test')) {
    return 'test'
  }
  return 'prod'
})()

export const config = configMap[env]

export default config