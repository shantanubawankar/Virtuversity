import { Button, Card } from './ui.js'

export function PricingSelector({ onSelect }) {
  return React.createElement('div', { className: 'grid md:grid-cols-3 gap-6' },
    React.createElement(Card, null,
      React.createElement('h3', { className: 'text-lg font-semibold' }, 'Per Video'),
      React.createElement('p', { className: 'text-white/70 mt-2' }, 'One-off purchase per video.'),
      React.createElement(Button, { onClick: () => onSelect('video') }, 'Choose')
    ),
    React.createElement(Card, null,
      React.createElement('h3', { className: 'text-lg font-semibold' }, 'Course Bundle'),
      React.createElement('p', { className: 'text-white/70 mt-2' }, 'Access all videos of a course.'),
      React.createElement(Button, { onClick: () => onSelect('course') }, 'Choose')
    ),
    React.createElement(Card, null,
      React.createElement('h3', { className: 'text-lg font-semibold' }, 'Teacher Subscription'),
      React.createElement('p', { className: 'text-white/70 mt-2' }, 'Subscribe to all content by a teacher.'),
      React.createElement(Button, { onClick: () => onSelect('subscription') }, 'Choose')
    )
  )
}
