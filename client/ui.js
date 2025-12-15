;(function () {
  const ensureContainer = () => {
    let c = document.getElementById('toast-container')
    if (!c) {
      c = document.createElement('div')
      c.id = 'toast-container'
      c.className = 'fixed top-4 right-4 z-[1000] space-y-2'
      document.body.appendChild(c)
    }
    return c
  }
  const showToast = (msg, type = 'info') => {
    const c = ensureContainer()
    const t = document.createElement('div')
    const color = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-indigo-600'
    t.className = `toast text-sm text-white px-3 py-2 rounded shadow ${color}`
    t.textContent = msg
    c.appendChild(t)
    setTimeout(() => {
      t.style.opacity = '0'
      t.style.transform = 'translateY(-6px)'
      setTimeout(() => t.remove(), 200)
    }, 2500)
  }
  window.showToast = showToast
})()
