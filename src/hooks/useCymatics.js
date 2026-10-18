// The همس plate: owns the canvas, the frame loop, and the sand physics.
// It is told what figure to draw (setLetter / setTone); it decides nothing about
// sound or the timeline.
import { onUnmounted, reactive, ref, watch } from "vue"
import {
  CYMATICS_DEFAULTS,
  grainLook,
  hueForHz,
  hueForRank,
  letterMode,
  makeParticles,
  refreshParticles,
  stepParticle,
  toneMode,
} from "@/utils/cymatics"

// Reading a CSS variable forces a style recalc, so resolve the theme colours
// once they are actually on the element and keep them. They can still be empty
// on the first frame, so an empty result is retried rather than cached as black.
const canvasRgb = (canvas, name) =>
  getComputedStyle(canvas).getPropertyValue(name).trim() || ""

// Rough perceived luminance of an "r, g, b" string, to pick sand lightness.
const luminance = (rgb) => {
  const [r, g, b] = rgb.split(",").map((n) => parseFloat(n) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const dprSize = (canvas) => Number(canvas.dataset.dpr || 1)

export function useCymatics(canvasRef, morphSeconds) {
  // Live physics values, bound directly by the settings sliders.
  const tune = reactive({ ...CYMATICS_DEFAULTS })
  // Which note of the word is sounding: a word can repeat a letter, and
  // highlighting by the letter alone would light up every copy at once.
  const activeNote = ref(-1)

  const modeCache = {}
  let counts = {}
  // The letters in ascending frequency order, and each one's rank in it. The
  // figure comes from the rank, so two letters with near-identical counts still
  // draw different shapes.
  let ranked = []
  let rankOf = {}
  let plate = null
  let rafId = null
  // The letters the sound is walking, so the shape retunes on the sound's clock.
  let drive = null
  // A fixed tone overrides the drive while it is non-zero.
  let toneHz = 0

  const letterFig = (letter) => {
    if (modeCache[letter]) return modeCache[letter]
    const rank = rankOf[letter]
    if (rank === undefined) return (modeCache[letter] = { m: 1, n: 1.35 })
    return (modeCache[letter] = letterMode(rank, ranked.length))
  }

  // Only a letter with a Quran count has a tone, so only those drive the plate.
  const drivable = (letter) => !!(counts && counts[letter])

  const resize = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const box = canvas.parentElement
    // YouTube's player aspect: the largest 16:9 rectangle that fits the box, so
    // the plate always has a video-shaped frame at any container size.
    const maxW = box.clientWidth
    const maxH = box.clientHeight
    const w = Math.max(Math.min(maxW, (maxH * 16) / 9), 1)
    const h = Math.max(Math.min(maxH, (maxW * 9) / 16), 1)
    // Nothing laid out yet (or hidden): wait for real dimensions rather than
    // blanking the plate.
    if (w <= 1 || h <= 1) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.dataset.dpr = String(dpr)
    // Keep the particles when only the size changed, so a fullscreen toggle does
    // not scatter a pattern that has already settled.
    if (plate && plate.particles.length === tune.count) {
      plate.w = w
      plate.h = h
      return
    }
    plate = {
      w,
      h,
      m: 1,
      n: 1,
      targetM: 1,
      targetN: 1,
      hue: 0,
      lit: 0,
      particles: makeParticles(tune.count, w, h),
      sandColor: "",
      bgColor: "",
    }
  }

  const frame = () => {
    rafId = requestAnimationFrame(frame)
    const canvas = canvasRef.value
    if (!canvas || !plate) return
    const { w, h, particles } = plate
    const ctx = canvas.getContext("2d")
    if (!plate.sandColor)
      plate.sandColor = canvasRgb(canvas, "--v-theme-on-surface")
    // The plate is always black, whatever the app theme, so the sand glows.
    plate.bgColor = "0, 0, 0"
    const { sandColor, bgColor } = plate
    if (!sandColor) return

    // Advance the drive to the letter being heard, then show its figure. A fixed
    // tone has no letter stepping, so it just holds one figure.
    if (toneHz) setTone(toneHz)
    else if (drive) {
      const index = Math.min(
        drive.letters.length - 1,
        Math.floor((performance.now() - drive.start) / drive.stepMs),
      )
      setLetter(drive.letters[index], index)
    }

    // Ease towards the new figure over the letter's own step, so the sand flows
    // between shapes the way it does on a real plate, never jumping.
    const k = 1 - Math.pow(0.001, tune.morph / (60 * morphSeconds.value))
    plate.m += (plate.targetM - plate.m) * k
    plate.n += (plate.targetN - plate.n) * k
    const { m, n } = plate

    // Trails: fade last frame's pixels slightly, never clear, so fast particles
    // smear into soft streaks. The low alpha keeps a glow instead of hard dots.
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = `rgba(${bgColor}, ${tune.trail})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Sand colour is the pitch: a fixed tone by its Hz, a letter by its rank in
    // the frequency order. Red at the low end up to violet at the high end.
    const dpr = dprSize(canvas)
    const hue = toneHz
      ? hueForHz(toneHz)
      : hueForRank(rankOf[plate.letter], ranked.length)
    plate.hue += (hue - plate.hue) * 0.2
    // Lightness comes from the theme background, so the sand lifts on dark and
    // deepens on light without hardcoding a colour.
    if (!plate.lit) plate.lit = luminance(bgColor) < 0.5 ? 62 : 42

    // Ambient halo behind the sand, in the sand hue, additive so it reads as
    // light rather than paint. Drawn after the trail fade so it sits under the
    // grains. A gradient per frame is cheap next to the particle loop.
    if (tune.ambient > 0) {
      const mx = (w * dpr) / 2
      const my = (h * dpr) / 2
      const rr = Math.max(mx, my) * 1.15
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, rr)
      halo.addColorStop(0, `hsla(${plate.hue}, 80%, ${plate.lit}%, ${tune.ambient})`)
      halo.addColorStop(1, `hsla(${plate.hue}, 80%, ${plate.lit}%, 0)`)
      ctx.globalCompositeOperation = "lighter"
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "source-over"
    }

    // Continuous churn: a few grains per frame restart from a fresh spot, the
    // way a real plate keeps shedding and redepositing sand. This is what stops
    // grains camping on lines that are nodal for every mode and keeps the
    // figure redrawing itself instead of hardening into a heap.
    refreshParticles(particles, w, h, tune.churn)

    // Physics + draw in one pass, scaled into device pixels. One fillStyle for
    // the whole batch; only alpha varies, set on the context per grain.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = `hsl(${plate.hue}, 78%, ${plate.lit}%)`
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      stepParticle(p, m, n, w, h, tune)
      const { r, alpha } = grainLook(p, tune)
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  const start = () => {
    if (rafId) return
    observeBox()
    rafId = requestAnimationFrame(frame)
  }

  const stop = () => {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  // Point the plate at a letter's figure. Skips when nothing changed, so the
  // frame loop can call it every frame for free. `note` is which occurrence in
  // the word this is, so a repeated letter highlights only the one sounding.
  const setLetter = (letter, note = -1) => {
    if (!plate || letter === plate.letter) return
    plate.letter = letter
    activeNote.value = note
    if (!letter) return
    const { m, n } = letterFig(letter)
    plate.targetM = m
    plate.targetN = n
  }

  // A fixed tone has no letter, so it only writes the target while it is on.
  const setTone = (hz) => {
    if (!plate) return
    const { m, n } = toneMode(hz)
    plate.targetM = m
    plate.targetN = n
    plate.letter = ""
    activeNote.value = -1
  }

  // Hand the plate the letters a word sounds. The frame loop walks them on a
  // coarser clock than the audio, so each figure gets long enough to actually
  // form before it is replaced.
  const startDrive = (notes, stepMs) => {
    const letters = (notes || []).filter(drivable)
    if (!letters.length) return
    drive = { letters, start: performance.now(), stepMs }
  }

  // Not playing: hold the first letter's figure so the plate is never blank.
  const showStatic = (notes) => {
    if (drive) return
    const letters = (notes || []).filter(drivable)
    drive = letters.length ? { letters, start: 0, stepMs: 1e9 } : null
  }

  const clearDrive = () => {
    drive = null
    setLetter("")
  }

  const setToneHz = (hz) => {
    toneHz = hz
  }

  // The letter counts are the input to the figure mapping, so replacing them
  // also retires the mode cache.
  const setCounts = (next) => {
    counts = next || {}
    // Ascending by count, so rank 0 is the rarest letter. Ties keep a stable
    // order, which is what matters: two letters must not share a rank.
    ranked = Object.keys(counts).sort((a, b) => counts[a] - counts[b] || a.localeCompare(b))
    rankOf = {}
    ranked.forEach((letter, index) => (rankOf[letter] = index))
    Object.keys(modeCache).forEach((key) => delete modeCache[key])
    if (plate) plate.letter = ""
  }

  // Theme colours are dropped on a switch so the loop re-reads them. Trails
  // carry the old palette, so the canvas is wiped too.
  const clear = () => {
    if (!plate) return
    plate.sandColor = ""
    plate.bgColor = ""
    plate.lit = 0
    const canvas = canvasRef.value
    if (canvas) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // A slider moving the count rebuilds the sand; the rest are read live by the
  // frame loop, so they need no watcher.
  watch(
    () => tune.count,
    () => resize(),
  )

  const onResize = () => resize()
  window.addEventListener("resize", onResize)
  // The plate box also changes height on its own: the word block below it grows
  // when the first word arrives, and a word can wrap to more lines mid-play. The
  // canvas is sized in CSS pixels, so without this it keeps its old height and
  // overflows the word block, which then looks like it vanished.
  let observer = null
  const observeBox = () => {
    if (observer) return
    const box = canvasRef.value?.parentElement
    if (!box) return
    observer = new ResizeObserver(onResize)
    observer.observe(box)
  }

  onUnmounted(() => {
    stop()
    window.removeEventListener("resize", onResize)
    observer?.disconnect()
  })

  return {
    tune,
    activeNote,
    start,
    resize,
    setToneHz,
    setCounts,
    startDrive,
    showStatic,
    clearDrive,
    clear,
  }
}
