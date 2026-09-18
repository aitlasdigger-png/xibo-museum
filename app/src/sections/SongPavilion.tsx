import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLang, L } from '@/lib/i18n'
import { PAL } from '@/lib/palette'
import { Seal } from '@/components/Bits'
import song from '@/data/song.json'

type Scene = (typeof song.scenes)[number]
const SCENES = song.scenes
const N = SCENES.length
const DWELL_MS = 9000 // 无音频时每幕停留

const TONE_OVERLAY: Record<string, string> = {
  warm: 'radial-gradient(120% 90% at 50% 110%, rgba(166,58,43,0.18), transparent 60%)',
  cold: 'radial-gradient(120% 90% at 50% 110%, rgba(60,80,110,0.22), transparent 60%)',
}

export default function SongPavilion({ goHome }: { goHome: (anchor?: string) => void }) {
  const { lang, t } = useLang()
  const [phase, setPhase] = useState<'gate' | 'play' | 'outro'>('gate')
  const [idx, setIdx] = useState(0)
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [muted, setMuted] = useState(false)
  const [layerB, setLayerB] = useState(false) // 双层交替做交叉淡入

  const clipRef = useRef<HTMLAudioElement | null>(null)
  const dwellRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchX = useRef<number | null>(null)
  const reduced = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  const scene: Scene = SCENES[idx]

  const clearDwell = () => { if (dwellRef.current) { clearTimeout(dwellRef.current); dwellRef.current = null } }

  const scheduleAdvance = useCallback((i: number) => {
    clearDwell()
    dwellRef.current = setTimeout(() => {
      setIdx((cur) => {
        if (cur !== i) return cur
        if (cur >= N - 1) { setPhase('outro'); return cur }
        return cur + 1
      })
    }, DWELL_MS)
  }, [])

  // 场景推进时：切图；自动模式下计时进幕
  useEffect(() => {
    if (phase !== 'play') return
    setLayerB((b) => !b)
    if (mode === 'auto') scheduleAdvance(idx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, phase])

  useEffect(() => {
    if (phase !== 'play') return
    if (mode === 'auto') scheduleAdvance(idx)
    else clearDwell()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // 静音状态同步
  useEffect(() => {
    if (clipRef.current) clipRef.current.muted = muted
  }, [muted])

  // 预加载后续两幕
  useEffect(() => {
    ;[idx + 1, idx + 2].filter((i) => i < N).forEach((i) => { const im = new Image(); im.src = `/assets/song/${SCENES[i].id}.jpg` })
  }, [idx])

  // 键盘
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (phase !== 'play') return
      if (e.key === 'ArrowRight') setIdx((c) => Math.min(c + 1, N - 1))
      if (e.key === 'ArrowLeft') setIdx((c) => Math.max(c - 1, 0))
      if (e.key === 'Escape') goHome()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [phase, goHome])

  // 离场清理
  useEffect(() => () => { clearDwell(); clipRef.current?.pause() }, [])

  const start = (soundOn: boolean) => {
    setMuted(!soundOn)
    setPhase('play')
    setIdx(0)
    // 延迟播放，确保 audio 元素已挂载（React 渲染是异步的）
    setTimeout(() => {
      if (clipRef.current) {
        clipRef.current.loop = true
        clipRef.current.volume = 0.55
        clipRef.current.muted = !soundOn
        if (soundOn) {
          clipRef.current.play().catch(() => {
            // 如果自动播放被浏览器阻止，静默失败（用户可手动开声）
            console.warn('Audio autoplay blocked by browser. User can enable sound manually.')
          })
        }
      }
    }, 100)
  }

  const goto = (i: number) => { setMode('manual'); setIdx(i) }
  const next = () => { setMode('manual'); setIdx((c) => (c >= N - 1 ? (setPhase('outro'), c) : c + 1)) }
  const prev = () => { setMode('manual'); setIdx((c) => Math.max(c - 1, 0)) }

  /* ---------- 启卷页 ---------- */
  if (phase === 'gate') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: PAL.inkDeep, overflowY: 'auto' }}>
        <div style={{
          position: 'fixed', inset: 0, backgroundImage: 'url(/assets/song/s05.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 35%', opacity: 0.42, filter: 'sepia(0.4) brightness(0.7)',
        }} />
        <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${PAL.inkDeep}d9, ${PAL.inkDeep}80 50%, ${PAL.inkDeep}f2)` }} />
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '13vh 24px 80px', color: PAL.paperLt }}>
          <button onClick={() => goHome()} style={{
            position: 'absolute', top: 24, right: 24, background: 'none', cursor: 'pointer',
            border: `1px solid ${PAL.paperDk}55`, color: `${PAL.paperDk}aa`, borderRadius: 3, padding: '6px 14px', fontSize: 12, letterSpacing: '0.15em',
          }}>
            × {t('song_back')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <Seal size={42} />
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: `${PAL.paperDk}99`, textTransform: 'uppercase', margin: 0 }}>
              {L(lang, song.meta.subtitle_zh, song.meta.subtitle_en)}
            </p>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(38px, 7vw, 76px)', fontWeight: 700, margin: '0 0 6px', letterSpacing: lang === 'zh' ? '0.1em' : '0' }}>
            {L(lang, song.meta.title_zh, song.meta.title_en)}
          </h1>
          <p className="font-display" style={{ fontSize: 'clamp(16px, 2.4vw, 24px)', color: `${PAL.paperDk}bb`, margin: '0 0 34px' }}>
            {lang === 'zh' ? song.meta.title_en : song.meta.title_zh}
          </p>
          <p style={{ maxWidth: 640, lineHeight: 2.1, fontSize: 15, color: `${PAL.paperLt}d9` }}>{L(lang, song.meta.gate_intro_zh, song.meta.gate_intro_en)}</p>
          <p style={{ maxWidth: 640, lineHeight: 1.9, fontSize: 12.5, color: `${PAL.paperDk}99`, marginTop: 14 }}>
            {L(lang, song.meta.song_source_zh, song.meta.song_source_en)}
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 44, flexWrap: 'wrap' }}>
            <button onClick={() => start(true)} style={{
              cursor: 'pointer', border: 'none', background: PAL.vermil, color: PAL.paperLt,
              padding: '15px 42px', fontSize: 16, letterSpacing: '0.3em', borderRadius: 2, fontWeight: 700,
            }}>
              ▶ {t('song_begin')}
            </button>
            <button onClick={() => start(false)} style={{
              cursor: 'pointer', background: 'none', border: `1px solid ${PAL.paperDk}66`, color: PAL.paperDk,
              padding: '15px 26px', fontSize: 14, letterSpacing: '0.15em', borderRadius: 2,
            }}>
              {t('song_begin_mute')}
            </button>
          </div>
          <p style={{ fontSize: 11.5, color: `${PAL.paperDk}77`, marginTop: 26, lineHeight: 1.8 }}>
            {t('song_placeholder')}<br />{L(lang, song.meta.aigc_notice_zh, song.meta.aigc_notice_en)}
          </p>
        </div>
      </div>
    )
  }

  /* ---------- 尾声页 ---------- */
  if (phase === 'outro') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: PAL.inkDeep, overflowY: 'auto', color: PAL.paperLt }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '12vh 24px 90px' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, margin: '0 0 20px' }}>
            {L(lang, song.meta.outro_title_zh, 'Where this song comes from')}
          </h2>
          <p style={{ lineHeight: 2.1, fontSize: 14.5, color: `${PAL.paperLt}d9` }}>{L(lang, song.meta.outro_text_zh, song.meta.outro_text_en)}</p>
          <p style={{ lineHeight: 1.9, fontSize: 12.5, color: `${PAL.paperDk}99`, marginTop: 18 }}>
            {L(lang, song.meta.lyric_attribution_zh, song.meta.lyric_attribution_en)}<br />
            {L(lang, song.meta.adaptation_note_zh, song.meta.adaptation_note_en)}<br />
            {L(lang, song.meta.aigc_notice_zh, song.meta.aigc_notice_en)}
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
            <button onClick={() => goHome('act1')} style={{
              cursor: 'pointer', border: 'none', background: PAL.vermil, color: PAL.paperLt,
              padding: '13px 30px', fontSize: 14, letterSpacing: '0.2em', borderRadius: 2, fontWeight: 700,
            }}>
              {L(lang, '进入主馆第一章 · 西迁', 'Enter Act I · The Road West')}
            </button>
            <button onClick={() => goHome()} style={{
              cursor: 'pointer', background: 'none', border: `1px solid ${PAL.paperDk}66`, color: PAL.paperDk,
              padding: '13px 22px', fontSize: 13, letterSpacing: '0.12em', borderRadius: 2,
            }}>
              {t('song_back')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- 正卷 ---------- */
  const imgA = `/assets/song/${scene.id}.jpg`
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#0b0805', overflow: 'hidden' }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (dx < -50) next(); else if (dx > 50) prev()
        touchX.current = null
      }}
    >
      {/* 双层图像交叉淡入 */}
      {[imgA].map((src) => (
        <div key={src + String(layerB)} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={src} alt=""
            className={reduced ? undefined : 'kenburns'}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              animation: reduced ? undefined : 'songFade 0.9s ease both',
            }}
          />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, #0b0805cc 0%, transparent 26%, transparent 52%, #0b0805e6 88%, #0b0805 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: TONE_OVERLAY[scene.tone] ?? 'none' }} />

      {/* 顶栏 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', padding: '16px 22px', color: PAL.paperLt }}>
        <span style={{ fontSize: 12, letterSpacing: '0.2em', color: `${PAL.paperDk}aa` }}>
          {String(scene.no).padStart(2, '0')} / {N} · {L(lang, scene.title_zh, scene.title_en)}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setMode(mode === 'auto' ? 'manual' : 'auto')} style={topBtn()}>
            {mode === 'auto' ? t('song_mode_auto') : t('song_mode_manual')}
          </button>
          <button onClick={() => setMuted(!muted)} style={topBtn()}>
            {muted ? t('song_unmute') : t('song_mute')}
          </button>
          <button onClick={() => goHome()} style={topBtn()}>×</button>
        </div>
      </div>

      {/* 底部文本 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5, padding: '0 24px 26px', color: PAL.paperLt }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <p className="font-display" style={{
            fontSize: 'clamp(19px, 3.2vw, 30px)', lineHeight: 1.9, fontWeight: 600, margin: '0 0 12px',
            textShadow: '0 2px 18px rgba(0,0,0,0.65)', fontStyle: lang === 'en' ? 'italic' : 'normal',
          }}>
            {L(lang, scene.lyric_zh, scene.lyric_en)}
          </p>
          <p style={{ fontSize: 'clamp(12.5px, 1.5vw, 14px)', lineHeight: 1.95, color: `${PAL.paperLt}c9`, margin: '0 0 10px', maxWidth: 700 }}>
            {L(lang, scene.caption_zh, scene.caption_en)}
          </p>
          <button onClick={() => goHome(scene.link.anchor)} style={{
            cursor: 'pointer', background: 'none', border: 'none', padding: 0,
            color: `${PAL.paperDk}bb`, fontSize: 11.5, letterSpacing: '0.1em', textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            {L(lang, scene.link.label_zh, scene.link.label_en)} →
          </button>

          {/* 进度轨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22 }}>
            <button onClick={prev} style={railBtn()}>‹</button>
            <div style={{ display: 'flex', gap: 6, flex: 1 }}>
              {SCENES.map((s, i) => (
                <button key={s.id} onClick={() => goto(i)} aria-label={s.title_en} style={{
                  flex: 1, height: i === idx ? 5 : 3, border: 'none', cursor: 'pointer', borderRadius: 2,
                  background: i === idx ? PAL.vermil : i < idx ? `${PAL.paperDk}99` : `${PAL.paperDk}44`,
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
            <button onClick={next} style={railBtn()}>›</button>
          </div>
        </div>
      </div>

      <audio ref={clipRef} src={`${song.meta.audio_dir}${song.meta.audio_loop}`} preload="auto" />
    </div>
  )
}

function topBtn(): React.CSSProperties {
  return {
    cursor: 'pointer', background: 'rgba(11,8,5,0.55)', border: `1px solid ${PAL.paperDk}44`,
    color: `${PAL.paperLt}dd`, borderRadius: 3, padding: '6px 12px', fontSize: 11.5, letterSpacing: '0.12em',
    backdropFilter: 'blur(4px)',
  }
}
function railBtn(): React.CSSProperties {
  return {
    cursor: 'pointer', background: 'none', border: `1px solid ${PAL.paperDk}44`, color: PAL.paperLt,
    borderRadius: 3, width: 30, height: 30, fontSize: 16, lineHeight: 1,
  }
}
