"use strict";

const h = React.createElement;
const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function useRoute() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#/, '') || 'home');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, '') || 'home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => { window.location.hash = r; }];
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    let errText = 'Request failed';
    try {
      if (ct.includes('application/json')) {
        const j = await res.json();
        errText = j.error || JSON.stringify(j);
      } else {
        errText = await res.text();
      }
    } catch {}
    throw new Error(errText);
  }
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

function Toast({ text, kind = 'info', onClose }) {
  if (!text) return null;
  const color = kind === 'error' ? 'bg-red-600' : kind === 'success' ? 'bg-green-600' : 'bg-blue-600';
  return h(
    'div',
    { className: `fixed bottom-4 right-4 z-50 ${color} text-white px-4 py-2 rounded shadow-lg` },
    h('div', { className: 'flex items-center gap-3' },
      h('span', null, text),
      h('button', { className: 'text-white/80 hover:text-white', onClick: onClose }, 'Close')
    )
  );
}

function Nav({ route, navigate }) {
  const link = (r, label) =>
    h('a', {
      href: `#${r}`,
      className: `px-3 py-2 rounded hover:bg-white/10 ${route === r ? 'bg-white/10' : ''}`
    }, label);
  return h('nav', { className: 'flex items-center justify-between px-6 py-4' },
    h('div', { className: 'text-xl font-semibold' }, 'Virtuversity'),
    h('div', { className: 'flex items-center gap-2 text-sm' },
      link('home', 'Home'),
      link('login', 'Login'),
      link('video', 'Video'),
      link('payments', 'Payments'),
      link('profile', 'Profile')
    )
  );
}

function Section({ title, children }) {
  return h('section', { className: 'max-w-4xl mx-auto p-6' },
    h('div', { className: 'glass rounded-xl p-6' },
      h('h2', { className: 'text-2xl font-bold mb-4' }, title),
      children
    )
  );
}

function Home() {
  return Section({
    title: 'Micro-learning for modern students',
    children: h('div', { className: 'space-y-4' },
      h('p', { className: 'text-white/80' },
        'Pay per video, subscribe per course, or follow a teacher.'),
      h('div', { className: 'flex gap-3' },
        h('a', { href: '#video', className: 'px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500' }, 'Watch sample'),
        h('a', { href: '#login', className: 'px-4 py-2 rounded bg-pink-600 hover:bg-pink-500' }, 'Get started')
      )
    )
  });
}

function LoginRegister({ setToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [me, setMe] = useState(null);
  async function register(e) {
    e.preventDefault();
    try {
      const r = await api('/api/auth/register', { method: 'POST', body: { email, password, role } });
      setToast({ text: 'Registered', kind: 'success' });
      setMe(r.user);
    } catch (err) {
      setToast({ text: err.message, kind: 'error' });
    }
  }
  async function login(e) {
    e.preventDefault();
    try {
      const r = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      setToast({ text: 'Logged in', kind: 'success' });
      setMe(r.user);
    } catch (err) {
      setToast({ text: err.message, kind: 'error' });
    }
  }
  async function loadMe() {
    try {
      const r = await api('/api/auth/me');
      setMe(r.user);
    } catch {
      setMe(null);
    }
  }
  useEffect(() => { loadMe(); }, []);
  return Section({
    title: 'Account',
    children: h('div', { className: 'grid md:grid-cols-2 gap-6' },
      h('form', { className: 'space-y-3', onSubmit: register },
        h('div', null,
          h('label', { className: 'block text-sm mb-1' }, 'Email'),
          h('input', {
            type: 'email', value: email, onChange: e => setEmail(e.target.value),
            className: 'w-full rounded bg-white/10 px-3 py-2 outline-none'
          })
        ),
        h('div', null,
          h('label', { className: 'block text-sm mb-1' }, 'Password'),
          h('input', {
            type: 'password', value: password, onChange: e => setPassword(e.target.value),
            className: 'w-full rounded bg-white/10 px-3 py-2 outline-none'
          })
        ),
        h('div', null,
          h('label', { className: 'block text-sm mb-1' }, 'Role'),
          h('select', {
            value: role, onChange: e => setRole(e.target.value),
            className: 'w-full rounded bg-white/10 px-3 py-2 outline-none'
          },
            h('option', { value: 'student' }, 'Student'),
            h('option', { value: 'teacher' }, 'Teacher')
          )
        ),
        h('div', { className: 'flex gap-2' },
          h('button', { type: 'submit', className: 'px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500' }, 'Register'),
          h('button', { type: 'button', onClick: login, className: 'px-4 py-2 rounded bg-pink-600 hover:bg-pink-500' }, 'Login')
        )
      ),
      h('div', { className: 'space-y-3' },
        h('div', { className: 'text-sm text-white/80' }, 'Status'),
        me ?
          h('div', { className: 'p-3 rounded bg-white/10' },
            h('div', null, `ID: ${me.id}`),
            h('div', null, `Email: ${me.email}`),
            h('div', null, `Role: ${me.role}`)
          )
          :
          h('div', { className: 'p-3 rounded bg-white/10' }, 'Not logged in')
      )
    )
  });
}

function Video() {
  return Section({
    title: 'Sample video',
    children: h('div', { className: 'space-y-4' },
      h('video', {
        controls: true,
        className: 'w-full rounded',
        src: '/api/videos/stream/sample'
      }),
      h('div', null,
        h('a', {
          href: '/api/certificates/generate/sample-course?studentName=Student',
          className: 'px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500'
        }, 'Generate certificate')
      )
    )
  });
}

function Payments({ setToast }) {
  const [loading, setLoading] = useState(false);
  async function startCheckout() {
    try {
      setLoading(true);
      const { key } = await api('/api/payments/key');
      const { order } = await api('/api/payments/create-order', { method: 'POST', body: { amount: 50000, currency: 'INR' } });
      const options = {
        key,
        amount: order.amount.toString(),
        currency: order.currency,
        name: 'Virtuversity',
        description: 'Sample purchase',
        order_id: order.id,
        handler: async function (response) {
          try {
            const v = await api('/api/payments/verify', {
              method: 'POST',
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });
            setToast({ text: v.verified ? 'Payment verified' : 'Payment verification failed', kind: v.verified ? 'success' : 'error' });
          } catch (err) {
            setToast({ text: err.message, kind: 'error' });
          }
        },
        theme: { color: '#7c3aed' }
      };
      if (typeof window.Razorpay !== 'function') {
        setToast({ text: 'Razorpay SDK not loaded', kind: 'error' });
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setToast({ text: err.message, kind: 'error' });
      setLoading(false);
    }
  }
  return Section({
    title: 'Payments',
    children: h('div', { className: 'space-y-4' },
      h('p', { className: 'text-white/80' }, 'Demo Razorpay checkout with test keys.'),
      h('button', {
        className: `px-4 py-2 rounded ${loading ? 'bg-white/20' : 'bg-indigo-600 hover:bg-indigo-500'}`,
        disabled: loading,
        onClick: startCheckout
      }, loading ? 'Starting...' : 'Start checkout')
    )
  });
}

function Profile() {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const r = await api('/api/auth/me');
        setUser(r.user);
      } catch (e) {
        setErr('Not logged in');
      }
    })();
  }, []);
  return Section({
    title: 'Profile',
    children: h('div', null,
      user ?
        h('div', { className: 'space-y-2' },
          h('div', null, `Email: ${user.email}`),
          h('div', null, `Role: ${user.role}`)
        )
        :
        h('div', { className: 'text-white/70' }, err || 'Loading...')
    )
  });
}

function App() {
  const [route, navigate] = useRoute();
  const [toast, setToast] = useState(null);
  const clearToast = () => setToast(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  const page = (() => {
    switch (route) {
      case 'home': return h(Home);
      case 'login': return h(LoginRegister, { setToast });
      case 'video': return h(Video);
      case 'payments': return h(Payments, { setToast });
      case 'profile': return h(Profile);
      default: return h(Home);
    }
  })();
  return h('div', null,
    h(Nav, { route, navigate }),
    page,
    h(Toast, { text: toast?.text, kind: toast?.kind, onClose: clearToast })
  );
}

const root = createRoot(document.getElementById('root'));
root.render(h(App));

