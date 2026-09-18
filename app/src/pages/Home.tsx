import { useCallback, useEffect, useRef, useState } from 'react'
import TopNav from '@/components/TopNav'
import Prologue from '@/sections/Prologue'
import Act1Migration from '@/sections/Act1Migration'
import Act2Cities from '@/sections/Act2Cities'
import Act3Karun from '@/sections/Act3Karun'
import Act4Burials from '@/sections/Act4Burials'
import Act5Epilogue from '@/sections/Act5Epilogue'
import SongPavilion from '@/sections/SongPavilion'
import { LangProvider, useLang } from '@/lib/i18n'
import { PAL } from '@/lib/palette'

const isSong = () => window.location.hash.startsWith('#/song')

function Museum() {
  const { t } = useLang()
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<'home' | 'song'>(isSong() ? 'song' : 'home')

  // 记录进入民歌馆前的位置和 hash，返回时恢复
  const returnRef = useRef<{ scrollY: number; hash: string }>({ scrollY: 0, hash: '' })

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fn = () => {
      const song = isSong()
      setView(song ? 'song' : 'home')
      if (!song && window.location.hash.length > 1) {
        const id = window.location.hash.slice(1)
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
      }
    }
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])

  const goHome = useCallback((anchor?: string) => {
    if (anchor) {
      // 跳转到主馆指定锚点
      window.location.hash = `#${anchor}`
      setView('home')
    } else {
      // 返回进入民歌馆前的位置
      const { scrollY, hash } = returnRef.current
      if (hash && hash !== '#/song') {
        window.location.hash = hash
      } else {
        window.location.hash = ''
      }
      setView('home')
      // 恢复滚动位置
      setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior }), 50)
    }
  }, [])

  const goSong = useCallback(() => {
    // 记录当前位置和 hash
    returnRef.current = { scrollY: window.scrollY, hash: window.location.hash }
    window.location.hash = '#/song'
    setView('song')
  }, [])

  if (view === 'song') return <SongPavilion goHome={goHome} />

  return (
    <div style={{ minHeight: '100vh', background: PAL.paper, color: PAL.ink }}>
      <TopNav onSongClick={goSong} />
      {!ready && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: PAL.inkDeep,
        }}>
          <p style={{ color: `${PAL.paperDk}aa`, letterSpacing: '0.35em', fontSize: 13 }} className="animate-pulse">
            {t('loading')}
          </p>
        </div>
      )}
      <main>
        <Prologue />
        <Act1Migration />
        <Act2Cities />
        <Act3Karun />
        <Act4Burials />
        <Act5Epilogue />
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <LangProvider>
      <Museum />
    </LangProvider>
  )
}
