import { Button } from './ui.js'

export function Navbar({ role, setRole }) {
  return React.createElement('nav', { className: 'sticky top-0 z-40 backdrop-blur bg-black/20 flex items-center justify-between p-4' },
    React.createElement('div', { className: 'flex items-center gap-3' },
      React.createElement('div', { className: 'w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500' }),
      React.createElement('span', { className: 'text-xl font-semibold' }, 'Virtuversity')
    ),
    React.createElement('div', { className: 'flex items-center gap-2' },
      React.createElement(Button, { onClick: () => setRole('student') }, 'Student'),
      React.createElement(Button, { onClick: () => setRole('teacher') }, 'Teacher'),
      React.createElement('a', { href: '#auth', className: 'ml-2 text-sm text-white/80 hover:text-white' }, 'Sign In')
    )
  )
}
