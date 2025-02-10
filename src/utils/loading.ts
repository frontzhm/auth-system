let countIsRequesting = 0

const loading = document.querySelector('#loading')
export const showLoading = () => {
  countIsRequesting++
  if (loading instanceof HTMLElement) {
    loading.style.display = 'flex'
  }
}
export const hideLoading = () => {
  countIsRequesting--
  if (countIsRequesting === 0) {
    if (loading instanceof HTMLElement) {
      loading.style.display = 'none'
    }
  }
}
