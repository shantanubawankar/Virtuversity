import { Card } from './ui.js'

export function VideoPlayer({ src }) {
  const { useState } = React
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  return React.createElement(Card, null,
    React.createElement('div', { className: 'relative' },
      !ready && !error && React.createElement('div', { className: 'animate-pulse h-48 md:h-64 w-full rounded-xl bg-white/5' }),
      error && React.createElement('div', { className: 'p-4 text-red-300' }, 'Unable to load video'),
      React.createElement('video', { src, controls: true, className: 'w-full rounded-xl ' + (ready ? '' : 'absolute top-0 opacity-0'), onLoadedData: () => setReady(true), onError: () => setError(true), controlsList: 'nodownload' })
    )
  )
}
