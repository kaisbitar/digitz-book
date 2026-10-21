// 16-bit PCM WAV. Interleaved, so a stereo buffer stays stereo.
const writeString = (view, offset, text) => {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
}

export const encodeWav = (buffer) => {
  const channels = buffer.numberOfChannels
  const rate = buffer.sampleRate
  const frames = buffer.length
  const dataSize = frames * channels * 2
  const bytes = new ArrayBuffer(44 + dataSize)
  const view = new DataView(bytes)

  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * channels * 2, true)
  view.setUint16(32, channels * 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  const data = []
  for (let c = 0; c < channels; c++) data.push(buffer.getChannelData(c))
  let offset = 44
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const s = Math.max(-1, Math.min(1, data[c][i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      offset += 2
    }
  }
  return new Blob([bytes], { type: "audio/wav" })
}
