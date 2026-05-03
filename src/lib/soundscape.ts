'use client'

/**
 * Single shared <audio> instance for the nature soundscape.
 * Used by Nav (toggle button) and WelcomeGate (autoplay on entry) so they
 * never spawn two parallel sources or fight over playback state.
 */

type Listener = (playing: boolean) => void

let audio: HTMLAudioElement | null = null
let playing = false
const listeners = new Set<Listener>()

function ensureAudio() {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio('/nature.mp3')
    audio.loop = true
    audio.volume = 0.55
    audio.addEventListener('play',  () => { playing = true;  notify() })
    audio.addEventListener('pause', () => { playing = false; notify() })
    audio.addEventListener('ended', () => { playing = false; notify() })
  }
  return audio
}

function notify() {
  listeners.forEach(fn => fn(playing))
}

export function isPlaying() { return playing }

export async function play() {
  const a = ensureAudio()
  if (!a) return
  try { await a.play() } catch { /* autoplay blocked — caller can retry on user gesture */ }
}

export function pause() {
  if (!audio) return
  audio.pause()
}

export function toggle() {
  if (playing) pause()
  else play()
}

export function subscribe(fn: Listener) {
  listeners.add(fn)
  fn(playing)
  return () => { listeners.delete(fn) }
}
