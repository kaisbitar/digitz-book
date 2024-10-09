export const setVerseChartTooltips = ({
  reversedVerse,
  tooltipLabel,
  chartOptions,
}) => {
  var x = {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const reversedIndex = reversedVerse.length - 1 - dataPointIndex
      return `<div class="mr-2 ml-2 pt-2">
          <div class="d-flex">
            <span class="tipInfo tipInfo2">
              ${w.globals.series[0][reversedIndex]} 
              <span class="tipLabel">${tooltipLabel}</span>
            </span>
          </div>
          <p class="tipInfo tipText pr-1 pl-2">
            ${reversedVerse[reversedIndex]}
          </p>
        </div>`
    },
    // shared: false,
    // intersect: true,
    followCursor: true,
  }

  Object.assign(chartOptions, { tooltip: x })

  return chartOptions
}
