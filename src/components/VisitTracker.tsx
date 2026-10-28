import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../lib/api'

const SESSION_KEY = 'jth_session_id'

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export default function VisitTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return
    const timer = window.setTimeout(() => {
      api.stats.track(getSessionId(), location.pathname)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return null
}
