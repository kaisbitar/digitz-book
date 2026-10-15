// Word values are letter values summed, so they run from 1 to roughly 200.
// Mapping them straight onto frequency octaves pushes most words past the
// audible range, so walk scale degrees and cap the octave instead.
export const SCALES = {
  pentatonic: [1, 1.125, 1.25, 1.5, 1.667],
  major: [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875],
  minor: [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.8],
  hijaz: [1, 1.059, 1.26, 1.335, 1.5, 1.6, 1.888],
}

const OCTAVES = 2
export const BASE_HZ = 220

export const toneForValue = (value, scaleName = "pentatonic", base = BASE_HZ) => {
  const scale = SCALES[scaleName] || SCALES.pentatonic
  // Fold the pitch index into the scale instead of capping the octave: capping
  // sent every value past the cap to the same handful of notes.
  const span = scale.length * (OCTAVES + 1)
  const pitch = (Math.max(value, 1) - 1) % span
  const degree = pitch % scale.length
  const octave = Math.floor(pitch / scale.length)
  return base * scale[degree] * 2 ** octave
}
