export function showToast(message, variant = 'info') {
  const el = document.getElementById('toast')
  el.className = 'fixed bottom-4 right-4 z-50'
  const bg = variant === 'error' ? 'bg-red-500/90' : variant === 'success' ? 'bg-emerald-500/90' : 'bg-white/10'
  el.innerHTML = `<div class="glass ${bg} text-white px-4 py-3 rounded-xl shadow-lg">${message}</div>`
  el.classList.remove('hidden')
  clearTimeout(el._t)
  el._t = setTimeout(() => el.classList.add('hidden'), 3000)
}

export function Button({ children, onClick, variant = 'primary', disabled = false }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    accent: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white'
  }
  return React.createElement('button', { onClick, disabled, className: base + ' ' + variants[variant] }, children)
}

export function Card({ children, className = '' }) {
  return React.createElement('div', { className: 'glass rounded-2xl p-6 ' + className }, children)
}
