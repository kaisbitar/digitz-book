// Web Audio for the همس player: one voice per word, plus a held test tone.
// Every node created here is disconnected when it ends, so nothing leaks.
import { ref, watch } from "vue"
import { encodeWav } from "@/utils/wav"

const VOLUME = 0.25
// Fraction of a letter's step spent sliding from the previous pitch.
const GLIDE = 0.35
// Fade used to silence everything, in seconds.
const FADE = 0.1
// The ear is least sensitive at the bottom, where the cheapest letters sit.
const tiltFor = (frequency) => Math.min(1, Math.max(0.35, 900 / frequency))
// A rendered file keeps the reverb tail, then stops. Longer than this and the
// offline buffer is too big for the browser.
export const WAV_MAX_SECONDS = 15 * 60
const WAV_TAIL = 3
const WAV_RATE = 44100

// Sound shaping, in the form the menu shows. One set colours every voice.
export const AUDIO_DEFAULTS = {
  reverb: 0.65,
  echo: 0.2,
  echoTime: 0.02,
  // Low-pass cutoff: high keeps the tone bright, low dulls it to a hum.
  tone: 2100,
  // Envelope fade in seconds. Longer attack swells, longer release lets a tone
  // ring out past its step.
  attack: 0.146,
  release: 0.17,
}

// Slider bounds live with the labels, so a new control is one entry.
export const AUDIO_FIELDS = [
  { key: "reverb", label: "الصدى الغرفي", min: 0, max: 1, step: 0.05, decimals: 2 },
  { key: "echo", label: "تردد الصدى", min: 0, max: 0.9, step: 0.05, decimals: 2 },
  { key: "echoTime", label: "زمن الصدى", min: 0.02, max: 1, step: 0.01, decimals: 2 },
  { key: "tone", label: "النقاء", min: 200, max: 16000, step: 100, decimals: 0 },
  { key: "attack", label: "ظهور النغمة", min: 0.001, max: 0.3, step: 0.001, decimals: 3 },
  { key: "release", label: "تلاشي النغمة", min: 0.01, max: 1, step: 0.01, decimals: 2 },
]

// A synthetic reverb impulse: decaying noise, so no audio asset has to ship.
// Stereo, so the tail widens rather than sitting in the middle.
const impulseBuffer = (ctx, seconds, decay) => {
  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds))
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay
    }
  }
  return buf
}

export function useHumsAudio() {
  const tuneSounding = ref(false)
  // Master level, 0..1, applied through VOLUME. Read when a voice is built.
  const volume = ref(1)
  // Sound shaping, kept in the form the menu shows. The chain is
  // voice -> filter -> [dry bus, reverb, echo] -> master; every voice goes
  // through it, so one set of settings colours the whole feature.
  const reverb = ref(AUDIO_DEFAULTS.reverb)
  const echo = ref(AUDIO_DEFAULTS.echo)
  const echoTime = ref(AUDIO_DEFAULTS.echoTime)
  const tone = ref(AUDIO_DEFAULTS.tone)
  const attack = ref(AUDIO_DEFAULTS.attack)
  const release = ref(AUDIO_DEFAULTS.release)
  const wave = ref("sine")
  let audio = null
  let master = null
  let filter = null
  let wet = null
  let echoNode = null
  let echoFeedback = null
  let echoMix = null
  const voices = new Set()
  // The held reference tone, tracked separately so it can be replaced or stopped
  // on its own without touching the word voices.
  let toneVoice = null

  // The effects bus: filter, then a dry path plus a reverb send and an echo
  // send into the master. The live context keeps the nodes so sliders can move
  // them; a render builds its own and throws it away with the context.
  const makeBus = (ctx, cfg) => {
    const bus = ctx.createGain()
    bus.gain.value = 1
    bus.connect(ctx.destination)

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = "lowpass"
    lowpass.frequency.value = cfg.tone
    lowpass.connect(bus)

    const wetGain = ctx.createGain()
    const convolver = ctx.createConvolver()
    convolver.buffer = impulseBuffer(ctx, 2.4, 2.8)
    wetGain.gain.value = cfg.reverb
    lowpass.connect(wetGain).connect(convolver).connect(bus)

    const delay = ctx.createDelay(1)
    delay.delayTime.value = cfg.echoTime
    const feedback = ctx.createGain()
    feedback.gain.value = Math.min(0.9, cfg.echo * 0.9)
    const mix = ctx.createGain()
    mix.gain.value = cfg.echo
    lowpass.connect(delay)
    delay.connect(feedback).connect(delay)
    delay.connect(mix).connect(bus)
    return { bus, lowpass, wetGain, delay, feedback, mix }
  }

  const buildBus = (ctx) => {
    const built = makeBus(ctx, shaping())
    master = built.bus
    filter = built.lowpass
    wet = built.wetGain
    echoNode = built.delay
    echoFeedback = built.feedback
    echoMix = built.mix
  }

  const shaping = () => ({
    tone: tone.value,
    reverb: reverb.value,
    echo: echo.value,
    echoTime: echoTime.value,
    attack: attack.value,
    release: release.value,
    wave: wave.value,
    level: VOLUME * volume.value,
  })

  const init = () => {
    if (!audio) {
      audio = new (window.AudioContext || window.webkitAudioContext)()
      buildBus(audio)
    }
    if (audio.state === "suspended") audio.resume()
    return audio
  }

  // Live settings, so a slider moves the sound already playing. Only echo needs
  // a rebuild-ish update: its feedback tracks the mix, so the tail dies with it.
  watch(reverb, (v) => wet && (wet.gain.value = v))
  watch(tone, (v) => filter && (filter.frequency.value = v))
  watch(echoTime, (v) => echoNode && (echoNode.delayTime.value = v))
  watch(echo, (v) => {
    if (!echoFeedback) return
    echoMix.gain.value = v
    echoFeedback.gain.value = Math.min(0.9, v * 0.9)
  })

  // One oscillator per word: the pitch slides between letters, so a word is one
  // phrase instead of separate blips, while each letter still holds its own
  // exact frequency for the rest of its step. `bin` is the live voice set;
  // a render leaves it out and lets the context own the nodes.
  const schedulePhrase = (ctx, dest, notes, hzFor, step, start, cfg, bin) => {
    const live = (notes || []).filter(hzFor)
    if (!live.length) return
    const end = start + live.length * step
    const atk = Math.min(cfg.attack, step / 4)
    const rel = Math.min(cfg.release, step / 4)
    const glide = step * GLIDE
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    const first = hzFor(live[0])

    oscillator.type = cfg.wave
    oscillator.frequency.setValueAtTime(first, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(cfg.level * tiltFor(first), start + atk)

    live.forEach((letter, index) => {
      if (!index) return
      const at = start + index * step
      const from = hzFor(live[index - 1])
      const to = hzFor(letter)
      const arrive = Math.min(at + glide, end)
      oscillator.frequency.setValueAtTime(from, at)
      oscillator.frequency.linearRampToValueAtTime(to, arrive)
      gain.gain.setValueAtTime(cfg.level * tiltFor(from), at)
      gain.gain.linearRampToValueAtTime(cfg.level * tiltFor(to), arrive)
    })

    const last = hzFor(live[live.length - 1])
    gain.gain.setValueAtTime(
      cfg.level * tiltFor(last),
      Math.max(end - rel, start + atk),
    )
    gain.gain.linearRampToValueAtTime(0, end)

    oscillator.connect(gain).connect(dest)
    oscillator.start(start)
    oscillator.stop(end)
    if (!bin) return
    bin.add(gain)
    oscillator.onended = () => {
      bin.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  const scheduleHeld = (ctx, dest, hz, duration, start, cfg, bin) => {
    if (!hz || duration <= 0) return
    const atk = Math.min(cfg.attack, duration / 4)
    const rel = Math.min(cfg.release, duration / 4)
    const level = cfg.level * tiltFor(hz)
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = cfg.wave
    oscillator.frequency.setValueAtTime(hz, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(level, start + atk)
    gain.gain.setValueAtTime(level, Math.max(start + duration - rel, start + atk))
    gain.gain.linearRampToValueAtTime(0, start + duration)
    oscillator.connect(gain).connect(dest)
    oscillator.start(start)
    oscillator.stop(start + duration)
    if (!bin) return
    bin.add(gain)
    oscillator.onended = () => {
      bin.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  const play = (notes, hzFor, step) => {
    if (!(notes || []).filter(hzFor).length) return
    const ctx = init()
    schedulePhrase(ctx, filter, notes, hzFor, step, ctx.currentTime, shaping(), voices)
  }

  const playHeld = (hz, duration) => {
    if (!hz) return
    const ctx = init()
    scheduleHeld(ctx, filter, hz, duration, ctx.currentTime, shaping(), voices)
  }

  // The current sura, with the sliders as they are now, written to a WAV.
  // Same voices as playback, scheduled on the timeline instead of the speakers.
  const renderWav = async ({ seconds, hzFor, events }) => {
    if (!events?.length || seconds <= 0 || seconds > WAV_MAX_SECONDS) return null
    const length = Math.ceil((seconds + WAV_TAIL) * WAV_RATE)
    const ctx = new OfflineAudioContext({
      numberOfChannels: 2,
      length,
      sampleRate: WAV_RATE,
    })
    const { lowpass } = makeBus(ctx, shaping())
    const cfg = shaping()
    events.forEach((event) => {
      if (event.kind === "held") {
        scheduleHeld(ctx, lowpass, event.hz, event.duration, event.at, cfg)
        return
      }
      schedulePhrase(ctx, lowpass, event.notes, hzFor, event.step, event.at, cfg)
    })
    return encodeWav(await ctx.startRendering())
  }

  // A single tone held while the plate settles, so one frequency makes one
  // figure. Retuning replaces the previous tone rather than layering another on
  // top, which would leave every frequency you picked still ringing.
  const playTone = (hz) => {
    endTone()
    const ctx = init()
    const gain = ctx.createGain()
    const oscillator = ctx.createOscillator()
    oscillator.type = wave.value
    oscillator.frequency.value = hz
    gain.gain.setValueAtTime(0, ctx.currentTime)
    // A short fade rather than a click, then hold at a level the ear tolerates.
    gain.gain.linearRampToValueAtTime(VOLUME * volume.value, ctx.currentTime + 0.02)
    oscillator.connect(gain).connect(filter)
    oscillator.start()
    toneVoice = { oscillator, gain }
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
    if (!toneVoice) return
    const { oscillator, gain } = toneVoice
    const now = audio ? audio.currentTime : 0
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.linearRampToValueAtTime(0, now + FADE)
    oscillator.stop(now + FADE)
    toneVoice = null
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
    master = null
    filter = null
    wet = null
    echoNode = null
    echoFeedback = null
    echoMix = null
  }

  return {
    tuneSounding,
    volume,
    reverb,
    echo,
    echoTime,
    tone,
    attack,
    release,
    wave,
    play,
    playHeld,
    renderWav,
    playTone,
    silence,
    stopTone,
    dispose,
  }
}
