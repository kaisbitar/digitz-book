// ApexCharts draws left-to-right. Flip series so Arabic charts start on the right.
export const rtlIndex = (index, length) => {
  if (index == null || index < 0 || !length) return -1
  return length - 1 - index
}

export const rtlSeries = (series = []) =>
  series.map((item) => ({
    ...item,
    data: [...(item.data || [])].reverse(),
  }))
