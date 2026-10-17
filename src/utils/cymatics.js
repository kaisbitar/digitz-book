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
  count: window.innerWidth < 480 ? 1800 : 4200,
  // Pull towards the nearest node, as a speed rather than an acceleration.
  force: 4,
  // Velocity kept per frame. Lower settles but crawls; higher gives more flow.
  damping: 0.86,
  // Velocity kept while crossing onto a node. Below 1 the grain stops crossing.
  settledDamping: 0.4,
  // Share of the along-the-line drift kept while locked. This is what spreads
  // grains evenly along a nodal line instead of dotting them at the crossings.
  slide: 0.9,
  // |field| under which a grain counts as sitting on the line.
  settleLevel: 0.14,
  // Scale the whole field by this. Bigger, lazier lobes read calmer.
  blobScale: 0.4,
  // How fast the figure eases to the next letter, as a fraction of a step.
  morph: 1,
  // Share of grains lifted and dropped at a fresh spot each frame, in percent.
  // Grains that reach a line nodal for every mode are never released on their
  // own, so without churn the sand heaps up on those invariant lines and the
  // figure stops forming. Above about 1.6 the plate visibly shimmers.
  churn: 0.5,
  // Trail persistence: each frame fades the last by this instead of clearing.
  trail: 0.12,
  // Sand. Locked grains grow and brighten; flying ones stay a dim streak.
  size: 1.4,
  glow: 1,
  lockGlow: 1,
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
]

export const makeParticles = (count, size) => {
  const p = new Array(count)
  for (let i = 0; i < count; i++) {
    p[i] = {
      x: Math.random() * size,
      y: Math.random() * size,
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

// One physics step. Kept flat so the hot loop stays inline.
export const stepParticle = (p, m, n, size, cfg) => {
  // Small step in plate units for the finite difference. A large one samples
  // across a whole lobe, where the difference cancels out and the pull turns to
  // noise, so the sand never converges on a nodal line.
  const h = 0.01
  const scale = cfg.blobScale
  // Sampled in plate coordinates, not raw pixels, so a figure looks the same at
  // any canvas size.
  const u = (p.x / size - 0.5) / scale
  const v = (p.y / size - 0.5) / scale
  const level = Math.abs(fieldSigned(m, n, u, v))
  // Gradient of |field|, normalised to a direction, so sand is pushed towards
  // the nearest node at a fixed speed and dense modes do not fling it off.
  const gx =
    Math.abs(fieldSigned(m, n, u + h, v)) -
    Math.abs(fieldSigned(m, n, u - h, v))
  const gy =
    Math.abs(fieldSigned(m, n, u, v + h)) -
    Math.abs(fieldSigned(m, n, u, v - h))
  const len = Math.sqrt(gx * gx + gy * gy)

  // This branch must run even at rest, otherwise a grain damps to a stop
  // wherever it happens to be and its glow decays away, which is what leaves a
  // sparse plate of dark dots instead of a clean figure.
  if (level < cfg.settleLevel && len > 1e-6) {
    // On a nodal line. Split the velocity into the part crossing the line and
    // the part running along it: kill the first so the grain stops crossing,
    // keep most of the second so grains slide and spread evenly instead of
    // piling up wherever each one happened to land.
    const nx = gx / len
    const ny = gy / len
    const vn = p.vx * nx + p.vy * ny
    p.vx = (p.vx - vn * nx) * cfg.slide + vn * nx * cfg.settledDamping
    p.vy = (p.vy - vn * ny) * cfg.slide + vn * ny * cfg.settledDamping
    p.intensity = Math.min(p.peak, p.intensity + SETTLE_INTENSITY * cfg.lockGlow)
    return finish(p, size, cfg)
  }
  // Step shrinks as the node approaches, so the sand eases onto the line instead
  // of always stepping a fixed distance and overshooting across it.
  const pull = len > 1e-6 ? (cfg.force * Math.min(1, level * 3)) / len : 0
  p.vx -= gx * pull
  p.vy -= gy * pull
  p.intensity = Math.max(0, p.intensity - DECAY_INTENSITY)
  return finish(p, size, cfg)
}

// Shared tail: damp, integrate, and keep the sand on the square plate.
const finish = (p, size, cfg) => {
  p.vx *= cfg.damping
  p.vy *= cfg.damping
  p.x += p.vx
  p.y += p.vy
  // Reflection reads as sand hitting the rim.
  if (p.x < 0) ((p.x = 0), (p.vx *= -BOUNCE))
  if (p.x > size) ((p.x = size), (p.vx *= -BOUNCE))
  if (p.y < 0) ((p.y = 0), (p.vy *= -BOUNCE))
  if (p.y > size) ((p.y = size), (p.vy *= -BOUNCE))
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
export const refreshParticles = (particles, size, share) => {
  if (share <= 0) return
  const rate = share / 100
  for (let i = 0; i < particles.length; i++) {
    if (Math.random() >= rate) continue
    const p = particles[i]
    p.x = Math.random() * size
    p.y = Math.random() * size
    p.vx = 0
    p.vy = 0
    p.intensity = 0
  }
}

// Self-check for the recycle kernel: 0% must leave every grain alone, 100% must
// reset every grain, and a middle share must move some but not all.
export const checkRefresh = () => {
  const seed = () => {
    const ps = makeParticles(100, 10)
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
  refreshParticles(all, 10, 100)
  const none = seed()
  refreshParticles(none, 10, 0)
  const some = seed()
  refreshParticles(some, 10, 20)
  return reset(all) === 100 && reset(none) === 0 && reset(some) > 0 && reset(some) < 100
}

// A letter's figure. Interpolating from its own Quran-wide count gives a shape
// that moves continuously with the letters instead of cutting between integers.
// 1 + up to 3.5 extra cells keeps the commonest letter legible while the rarest
// still shows structure.
export const letterMode = (count, min, max) => {
  if (!count) return { m: 1, n: 1 }
  const span = Math.log(max / min) || 1
  const k = 1 + (3.5 * Math.log(count / min)) / span
  return { m: k, n: k * 1.25 }
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
