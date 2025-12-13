import { Button } from './ui.js'

export function Hero() {
  return React.createElement('section', { className: 'px-6 py-16 text-center max-w-5xl mx-auto' },
    React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' }, 'Micro‑learning for modern students'),
    React.createElement('p', { className: 'mt-4 text-white/80 max-w-2xl mx-auto' }, 'Pay per video, subscribe per course, or follow a teacher. Learn exactly what you need.'),
    React.createElement('div', { className: 'mt-8 flex justify-center gap-4' },
      React.createElement('a', { href: '#courses' }, React.createElement(Button, { variant: 'accent' }, 'Browse Courses')),
      React.createElement('a', { href: '#auth?mode=register&role=teacher' }, React.createElement(Button, null, 'Become a Teacher'))
    )
  )
}
