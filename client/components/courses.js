import { Button, Card } from './ui.js'

export function BrowseCourses() {
  const { useState, useEffect } = React
  const [q, setQ] = useState('')
  const [model, setModel] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (model) params.set('model', model)
    const res = await fetch('/api/courses?' + params.toString())
    const data = await res.json()
    if (res.ok) setCourses(data.courses || []); else setCourses([])
    setLoading(false)
  }
  useEffect(() => { load() }, [])
  return React.createElement('div', { className: 'grid gap-4' },
    React.createElement(Card, null,
      React.createElement('div', { className: 'grid md:grid-cols-3 gap-3' },
        React.createElement('input', { className: 'glass rounded-lg px-4 py-2', placeholder: 'Search courses', value: q, onChange: e => setQ(e.target.value) }),
        React.createElement('select', { className: 'glass rounded-lg px-4 py-2', value: model, onChange: e => setModel(e.target.value) },
          React.createElement('option', { value: '' }, 'All models'),
          React.createElement('option', { value: 'video' }, 'Per Video'),
          React.createElement('option', { value: 'course' }, 'Course Bundle'),
          React.createElement('option', { value: 'subscription' }, 'Teacher Subscription')
        ),
        React.createElement(Button, { onClick: load }, 'Search')
      )
    ),
    loading ? React.createElement(Card, null, React.createElement('div', { className: 'animate-pulse h-24 bg-white/5 rounded-xl' })) :
    React.createElement('div', { className: 'grid md:grid-cols-3 gap-4' },
      courses.map(c => React.createElement(Card, { key: c.id },
        React.createElement('div', { className: 'text-lg font-semibold' }, c.title),
        React.createElement('div', { className: 'text-white/70 text-sm mt-1' }, c.description || ''),
        React.createElement('div', { className: 'text-white/70 text-sm mt-2' }, 'Model: ', c.model),
        React.createElement('div', { className: 'text-white/70 text-sm' }, 'Price: ₹', c.price || 0)
      ))
    )
  )
}
