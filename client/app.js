import { Navbar } from './components/navbar.js'
import { Hero } from './components/hero.js'
import { PricingSelector } from './components/pricing.js'
import { Auth } from './components/auth.js'
import { VideoPlayer } from './components/video.js'
import { Account } from './components/account.js'
import { Button, showToast } from './components/ui.js'
import { BrowseCourses } from './components/courses.js'

async function loadRazorpay() {
  if (window.Razorpay) return
  await new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function App() {
  const { useState } = React
  const [role, setRole] = useState('student')
  const [pricing, setPricing] = useState(null)
  const [paying, setPaying] = useState(false)
  const pay = async (amount) => {
    try {
      setPaying(true)
      await loadRazorpay()
      const keyRes = await fetch('/api/payments/key')
      if (!keyRes.ok) throw new Error('Key fetch failed')
      const { key } = await keyRes.json()
      const orderRes = await fetch('/api/payments/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) })
      if (!orderRes.ok) throw new Error('Order creation failed')
      const { order } = await orderRes.json()
      const rzp = new window.Razorpay({ key, order_id: order.id, name: 'Virtuversity', theme: { color: '#7c3aed' } })
      rzp.open()
      showToast('Opening payment...', 'info')
    } catch (e) {
      showToast('Payment unavailable. Try again later.', 'error')
    } finally {
      setPaying(false)
    }
  }
  return React.createElement('div', null,
    React.createElement(Navbar, { role, setRole }),
    React.createElement(Hero),
    React.createElement('section', { id: 'courses', className: 'px-6 pb-10 max-w-5xl mx-auto' },
      React.createElement('h2', { className: 'text-2xl font-semibold mb-4' }, 'Browse courses'),
      React.createElement(BrowseCourses)
    ),
    React.createElement('section', { id: 'pricing', className: 'px-6 pb-10 max-w-5xl mx-auto' },
      React.createElement('h2', { className: 'text-2xl font-semibold mb-4' }, 'Flexible pricing'),
      React.createElement(PricingSelector, { onSelect: setPricing }),
      pricing && React.createElement('div', { className: 'mt-4 flex items-center gap-3' },
        React.createElement('p', { className: 'text-white/80' }, 'Selected: ' + pricing),
        React.createElement(Button, { variant: 'accent', onClick: () => pay(49900), disabled: paying }, paying ? 'Preparing...' : 'Pay ₹499')
      )
    ),
    React.createElement('section', { id: 'auth', className: 'px-6 pb-16 max-w-5xl mx-auto' },
      React.createElement('h2', { className: 'text-2xl font-semibold mb-4' }, 'Account'),
      React.createElement(Auth),
      React.createElement('div', { className: 'mt-8' }, React.createElement(Account))
    ),
    React.createElement('section', { className: 'px-6 pb-24 max-w-5xl mx-auto' },
      React.createElement('h2', { className: 'text-2xl font-semibold mb-4' }, 'Sample video'),
      React.createElement(VideoPlayer, { src: '/api/videos/stream/sample' })
    ),
    React.createElement('footer', { className: 'px-6 py-8 text-sm text-white/60 border-t border-white/10' },
      React.createElement('div', { className: 'max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3' },
        React.createElement('div', null, '© ', new Date().getFullYear(), ' Virtuversity'),
        React.createElement('div', { className: 'flex gap-4' },
          React.createElement('a', { href: '#pricing', className: 'hover:text-white' }, 'Pricing'),
          React.createElement('a', { href: '#auth', className: 'hover:text-white' }, 'Account'),
          React.createElement('a', { href: 'mailto:support@virtuversity.in', className: 'hover:text-white' }, 'Support')
        )
      )
    )
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App))
