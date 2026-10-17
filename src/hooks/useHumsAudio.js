// Web Audio for the همس player: one voice per word, plus a held test tone.
// Every node created here is disconnected when it ends, so nothing leaks.
import { ref } from "vue"

const VOLUME = 0.25
// Fraction of a letter's step spent sliding from the previous pitch.
const GLIDE = 0.35
// Fade used to silence everything, in seconds.
const FADE = 0.1
// The ear is least sensitive at the bottom, where the cheapest letters sit.
const tiltFor = (frequency) => Math.min(1, Math.max(0.35, 900 / frequency))

export function useHumsAudio() {
  const tuneSounding = ref(false)
  let audio = null
  const voices = new Set()
  // The held reference tone, tracked separately so it can be replaced or stopped
  // on its own without touching the word voices.
  let tone = null

  const init = () => {
    if (!audio) {
      audio = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audio.state === "suspended") audio.resume()
    return audio
  }

  // One oscillator per word: the pitch slides between letters, so a word is one
  // phrase instead of separate blips, while each letter still holds its own
  // exact frequency for the rest of its step.
  const play = (notes, hzFor, step) => {
    const live = (notes || []).filter(hzFor)
    if (!live.length) return
    const ctx = init()
    const start = ctx.currentTime
    const end = start + live.length * step
    const attack = Math.min(0.008, step / 4)
    const release = Math.min(0.05, step / 4)
    const glide = step * GLIDE
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const first = hzFor(live[0])

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(first, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(VOLUME * tiltFor(first), start + attack)

    live.forEach((letter, index) => {
      if (!index) return
      const at = start + index * step
      const from = hzFor(live[index - 1])
      const to = hzFor(letter)
      const arrive = Math.min(at + glide, end)
      // Hold the previous pitch until this step, then slide onto the new one.
      oscillator.frequency.setValueAtTime(from, at)
      oscillator.frequency.linearRampToValueAtTime(to, arrive)
      gain.gain.setValueAtTime(VOLUME * tiltFor(from), at)
      gain.gain.linearRampToValueAtTime(VOLUME * tiltFor(to), arrive)
    })

    const last = hzFor(live[live.length - 1])
    gain.gain.setValueAtTime(
      VOLUME * tiltFor(last),
      Math.max(end - release, start + attack),
    )
    gain.gain.linearRampToValueAtTime(0, end)

    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(start)
    oscillator.stop(end)
    voices.add(gain)
    oscillator.onended = () => {
      voices.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  // A single tone held while the plate settles, so one frequency makes one
  // figure. Retuning replaces the previous tone rather than layering another on
  // top, which would leave every frequency you picked still ringing.
  const playTone = (hz) => {
    endTone()
    const ctx = init()
    const gain = ctx.createGain()
    const oscillator = ctx.createOscillator()
    oscillator.type = "sine"
    oscillator.frequency.value = hz
    gain.gain.setValueAtTime(0, ctx.currentTime)
    // A short fade rather than a click, then hold at a level the ear tolerates.
    gain.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 0.02)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start()
    tone = { oscillator, gain }
    voices.add(gain)
    tuneSounding.value = true
    oscillator.onended = () => {
      voices.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  // Fade a held tone out and let its oscillator stop, so it does not outlive its
  // own stop or pile up under the next frequency.
  const endTone = () => {
    if (!tone) return
    const { oscillator, gain } = tone
    const now = audio ? audio.currentTime : 0
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + FADE)
    oscillator.stop(now + FADE)
    tone = null
  }

  // Pausing must silence the notes already sounding, not just cancel the next.
  // currentTime is in seconds, so the fade value is too: 100 here would be a
  // hundred seconds of fade, leaving the tone audible long after stop.
  const silence = () => {
    if (!audio) return
    const now = audio.currentTime
    voices.forEach((gain) => {
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, now + FADE)
    })
  }

  const stopTone = () => {
    tuneSounding.value = false
    endTone()
  }

  const dispose = () => {
    endTone()
    if (!audio) return
    audio.close()
    audio = null
  }

  return { tuneSounding, play, playTone, silence, stopTone, dispose }
}
