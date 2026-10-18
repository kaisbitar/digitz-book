// Chladni plate physics: a grain of sand on a vibrating plate drifts down the
// gradient of |field| until it reaches a nodal line, where the plate is still.
// Pure functions only, so the render loop can call them at 60fps and the maths
// can be reasoned about (or unit tested) without a canvas.

// The real superposition: the sum of both axis orderings, which is what bends
// the nodal lines into curves instead of a plain grid of squares.
// Coordinates are scaled so the plate spans +-1.25 rather than +-1, the
// normalisation the reference visualiser uses; at +-1 the field is forced to
// zero on all four edges and the sand just frames the plate.
export const fieldSigned = (m, n, x, y) =>
  Math.sin(n * Math.PI * x) * Math.sin(m * Math.PI * y) +
  Math.sin(m * Math.PI * x) * Math.sin(n * Math.PI * y)

// Glow gained per frame while resting on a node, and lost while flying.
const SETTLE_INTENSITY = 0.015
const DECAY_INTENSITY = 0.05
// Fraction of velocity kept when a grain hits the rim.
const BOUNCE = 0.55

// Every physics number lives here in the form the sliders show it, so the UI
// binds straight to these keys and the render loop reads them live.
export const CYMATICS_DEFAULTS = {
  count: 3300,
  // Pull towards the nearest node, as a speed rather than an acceleration.
  force: 0.5,
  // Velocity kept per frame. Lower settles but crawls; higher gives more flow.
  damping: 0.7,
  // Velocity kept while crossing onto a node. Below 1 the grain stops crossing.
  settledDamping: 0.04,
  // Share of the along-the-line drift kept while locked. This is what spreads
  // grains evenly along a nodal line instead of dotting them at the crossings.
  slide: 0.04,
  // |field| under which a grain counts as sitting on the line.
  settleLevel: 0.28,
  // Scale the whole field by this. Bigger, lazier lobes read calmer.
  blobScale: 0.8,
  // How fast the figure eases to the next letter, as a fraction of a step.
  morph: 1,
  // Share of grains lifted and dropped at a fresh spot each frame, in percent.
  // Grains that reach a line nodal for every mode are never released on their
  // own, so without churn the sand heaps up on those invariant lines and the
  // figure stops forming. Above about 1.6 the plate visibly shimmers.
  churn: 1.6,
  // Trail persistence: each frame fades the last by this instead of clearing.
  trail: 0.33,
  // Ambient glow behind the sand: alpha of a soft radial wash tinted with the
  // sand hue at the centre of the plate. 0 leaves the theme background flat.
  ambient: 0.16,
  // Sand. Locked grains grow and brighten; flying ones stay a dim streak.
  size: 1.2,
  glow: 0.3,
  lockGlow: 0.6,
}

// Slider bounds live with the labels, so a new control is one entry, not three.
export const CYMATICS_FIELDS = [
  { key: "count", label: "حبيبات", min: 400, max: 9000, step: 100 },
  { key: "force", label: "قوة الجذب", min: 0.5, max: 14, step: 0.5 },
  { key: "damping", label: "الاندفاع", min: 0.7, max: 0.97, step: 0.01 },
  { key: "settledDamping", label: "ثبات الركود", min: 0, max: 0.9, step: 0.02 },
  { key: "slide", label: "انسياب الخط", min: 0, max: 0.99, step: 0.01 },
  { key: "settleLevel", label: "نطاق الخط", min: 0.02, max: 0.4, step: 0.01 },
  { key: "blobScale", label: "اتساع الشكل", min: 0.25, max: 0.8, step: 0.01 },
  { key: "morph", label: "سرعة التحول", min: 0.1, max: 2, step: 0.1 },
  { key: "churn", label: "تجديد الحبيبات", min: 0, max: 1.6, step: 0.1 },
  { key: "trail", label: "طول الأثر", min: 0.02, max: 0.6, step: 0.01 },
  { key: "size", label: "حجم الحبة", min: 0.4, max: 3, step: 0.1 },
  { key: "glow", label: "الوهج", min: 0.2, max: 2, step: 0.1 },
  { key: "lockGlow", label: "توهج الركود", min: 0.2, max: 2, step: 0.1 },
  { key: "ambient", label: "وهج محيط", min: 0, max: 0.6, step: 0.02 },
]

export const makeParticles = (count, w, h) => {
  const p = new Array(count)
  for (let i = 0; i < count; i++) {
    p[i] = {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      intensity: 0,
      // A per-grain ceiling. Without it every grain climbs to full brightness
      // within a second and the figure turns into a hard white skeleton; varied
      // ceilings keep the line textured the way it looks on the first frame.
      peak: 0.3 + Math.random() * 0.65,
      // A per-grain factor, so the size slider can scale the sand live.
      size: 1 + Math.random() * 0.85,
    }
  }
  return p
}

// One physics step. Kept flat so the hot loop stays inline. w and h are the
// plate's pixel extents, so a figure keeps its shape at any aspect ratio.
export const stepParticle = (p, m, n, w, h, cfg) => {
  // Sampled in plate coordinates, not raw pixels, so a figure looks the same at
  // any canvas size.
  const scale = cfg.blobScale
  const u = (p.x / w - 0.5) / scale
  const v = (p.y / h - 0.5) / scale
  const pm = Math.PI * m
  const pn = Math.PI * n
  const snx = Math.sin(pn * u)
  const smx = Math.sin(pm * u)
  const sny = Math.sin(pn * v)
  const smy = Math.sin(pm * v)
  const field = snx * smy + smx * sny
  const level = Math.abs(field)
  // Analytic gradient of the superposition: 8 trig values, shared with the field
  // itself. The finite differences it replaces needed 20 trig calls per grain
  // per frame, which was most of the physics cost at 60fps.
  const sw = Math.sign(field) || 1
  const gx = pn * Math.cos(pn * u) * smy + pm * Math.cos(pm * u) * sny
  const gy = pm * snx * Math.cos(pm * v) + pn * smx * Math.cos(pn * v)
  const swx = sw * gx
  const swy = sw * gy
  const len = Math.sqrt(swx * swx + swy * swy)

  // This branch must run even at rest, otherwise a grain damps to a stop
  // wherever it happens to be and its glow decays away, which is what leaves a
  // sparse plate of dark dots instead of a clean figure.
  if (level < cfg.settleLevel && len > 1e-6) {
    // On a nodal line. Split the velocity into the part crossing the line and
    // the part running along it: kill the first so the grain stops crossing,
    // keep most of the second so grains slide and spread evenly instead of
    // piling up wherever each one happened to land.
    const nx = swx / len
    const ny = swy / len
    const vn = p.vx * nx + p.vy * ny
    p.vx = (p.vx - vn * nx) * cfg.slide + vn * nx * cfg.settledDamping
    p.vy = (p.vy - vn * ny) * cfg.slide + vn * ny * cfg.settledDamping
    p.intensity = Math.min(p.peak, p.intensity + SETTLE_INTENSITY * cfg.lockGlow)
    return finish(p, w, h, cfg)
  }
  // Step shrinks as the node approaches, so the sand eases onto the line instead
  // of always stepping a fixed distance and overshooting across it.
  const pull = len > 1e-6 ? (cfg.force * Math.min(1, level * 3)) / len : 0
  p.vx -= swx * pull
  p.vy -= swy * pull
  p.intensity = Math.max(0, p.intensity - DECAY_INTENSITY)
  return finish(p, w, h, cfg)
}

// Shared tail: damp, integrate, and keep the sand on the plate.
const finish = (p, w, h, cfg) => {
  p.vx *= cfg.damping
  p.vy *= cfg.damping
  p.x += p.vx
  p.y += p.vy
  // Reflection reads as sand hitting the rim.
  if (p.x < 0) ((p.x = 0), (p.vx *= -BOUNCE))
  if (p.x > w) ((p.x = w), (p.vx *= -BOUNCE))
  if (p.y < 0) ((p.y = 0), (p.vy *= -BOUNCE))
  if (p.y > h) ((p.y = h), (p.vy *= -BOUNCE))
}

// How long the plate holds one figure. The sand needs roughly half a second to
// draw a shape and a letter lasts 140ms, so retuning on every letter leaves the
// plate permanently mid-transition. Holding the figure plays each note for its
// own length; the continuous churn now does the work of keeping it forming.
export const FIGURE_HOLD_MS = 550

// Lift a share of the grains (a percent) and drop them at fresh random spots.
// Called every frame, this is the plate being tapped continuously: trapped
// grains are released, the figure keeps redrawing itself, and the shape no
// longer depends on one lucky dense sprinkling forming before the tune changes.
export const refreshParticles = (particles, w, h, share) => {
  if (share <= 0) return
  const rate = share / 100
  for (let i = 0; i < particles.length; i++) {
    if (Math.random() >= rate) continue
    const p = particles[i]
    p.x = Math.random() * w
    p.y = Math.random() * h
    p.vx = 0
    p.vy = 0
    p.intensity = 0
  }
}

// Self-check for the recycle kernel: 0% must leave every grain alone, 100% must
// reset every grain, and a middle share must move some but not all.
export const checkRefresh = () => {
  const seed = () => {
    const ps = makeParticles(100, 10, 10)
    ps.forEach((p, i) => {
      p.x = i
      p.y = 5
      p.vx = 1
      p.vy = 1
      p.intensity = 0.5
    })
    return ps
  }
  const reset = (ps) =>
    ps.filter((p) => p.vx === 0 && p.vy === 0 && p.intensity === 0).length
  const all = seed()
  refreshParticles(all, 10, 10, 100)
  const none = seed()
  refreshParticles(none, 10, 10, 0)
  const some = seed()
  refreshParticles(some, 10, 10, 20)
  return reset(all) === 100 && reset(none) === 0 && reset(some) > 0 && reset(some) < 100
}

// A letter's figure, from its rank among the letters by Quran-wide frequency.
// Ranking is what keeps the letters apart. Mapped straight from the count,
// letters that differ by a fraction of a percent landed on the identical figure
// (ت 10520 and ك 10497 both drew m=3.09 n=3.87), and the whole count range only
// reached order 4.5 — too few orders to give 28 letters 28 figures. Rank adds no
// new input: it only uses the ordering the counts already have, one order step
// per letter, so each letter gets a figure of its own.
export const letterMode = (rank, total, extra = 4) => {
  const k = 1 + (extra * rank) / Math.max(1, total - 1)
  return { m: k, n: k * 1.35 }
}

// Self-check: every rank must draw its own figure, in increasing order and
// inside the intended band. Nothing else stops two letters collapsing together.
export const checkLetterModes = () => {
  const total = 28
  const extra = 4
  const modes = Array.from({ length: total }, (_, i) => letterMode(i, total, extra))
  const keys = new Set(modes.map(({ m, n }) => `${m.toFixed(6)},${n.toFixed(6)}`))
  const ordered = modes.every((x, i) => i === 0 || x.m > modes[i - 1].m)
  // n = m * 1.35, so n is always above m; m tops out at 1 + extra.
  const inBand = modes.every(({ m, n }) => m >= 1 && m <= 1 + extra + 1e-9 && n > m)
  return keys.size === total && ordered && inBand
}

// The figure a single fixed tone produces. The reference visualiser derives one
// mode straight from Hz, so one tone is one fixed, comparable figure.
export const toneMode = (hz) => {
  const f = Math.max(20, hz)
  return {
    m: Math.max(1, Math.round(0.8 * (f / 200))),
    n: Math.max(1, Math.round(0.6 * (f / 200))),
  }
}

// Alpha and radius for a grain, from its own intensity. Settled sand grows and
// brightens, flying sand is a dim streak.
export const grainLook = (p, cfg) => {
  const settled = p.intensity > 0.12
  const r = p.size * cfg.size
  if (!settled) return { r: r * 0.7, alpha: Math.max(0.12, 0.3 * p.intensity) }
  return {
    r: r * (1 + 0.5 * p.intensity * cfg.glow),
    alpha: Math.min(0.9, 0.18 + 0.75 * p.intensity),
  }
}

// The sand colour is the frequency spectrum, chakra-style: red at the lowest
// pitch up through orange, yellow, green, blue to violet at the highest. Hue
// runs 0..280 degrees, the range that reads as a full rainbow without wrapping
// back to red.
//
// Pitch reads logarithmically (an octave is a constant step), so the map is log
// over the hearing band. A linear map over a fixed 396..963 window left every
// frequency below it — which is most of the real ones, letters at 4..284 Hz and
// words at ~300 Hz — clamped to the same red. Log over the whole band gives each
// frequency its own colour, and the same frequency always the same colour.
export const HUE_MAX = 280
const HUE_MIN_HZ = 20
const HUE_MAX_HZ = 16000
const LOG_MIN = Math.log(HUE_MIN_HZ)
const LOG_SPAN = Math.log(HUE_MAX_HZ) - LOG_MIN

// Letters are coloured by their own frequency, not by rank, so a word and the
// letters it is the sum of share one scale. The hook is handed the same hz
// function the audio uses, so the colour can never drift from the pitch.
export const hueForHz = (hz) => {
  if (!Number.isFinite(hz) || hz <= 0) return 0
  const f = Math.min(HUE_MAX_HZ, Math.max(HUE_MIN_HZ, hz))
  return ((Math.log(f) - LOG_MIN) / LOG_SPAN) * HUE_MAX
}

// Self-check: hue must be monotonic in frequency (low red, high violet), stay
// inside the spectrum, and never hand back NaN on a bad input — a NaN hue
// silently turns every grain's fillStyle invalid and the plate goes black.
export const checkHue = () => {
  const rising =
    hueForHz(20) < hueForHz(150) &&
    hueForHz(150) < hueForHz(300) &&
    hueForHz(300) < hueForHz(3000)
  const ends = hueForHz(20) === 0 && Math.abs(hueForHz(16000) - HUE_MAX) < 1e-9
  const clamped = hueForHz(1) === 0 && hueForHz(1e9) === HUE_MAX
  const finite = [hueForHz(0), hueForHz(-5), hueForHz(undefined), hueForHz(NaN)].every(
    (h) => Number.isFinite(h),
  )
  return rising && ends && clamped && finite
}

