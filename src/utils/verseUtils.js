export const setVerseChartTooltips = ({
  reversedVerse,
  tooltipLabel,
  chartOptions,
  callback = () => {},
}) => {
  var x = {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      return `<div class="mr-2 ml-2 pt-2">
            <div class="d-flex">
              <span class="tipInfo tipInfo2">
                ${w.globals.series[0][dataPointIndex]} 
                <span class="tipLabel">${tooltipLabel}</span>
              </span>
            </div>
            <p class="tipInfo tipText pr-1 pl-2">
              ${reversedVerse[dataPointIndex]}
            </p>
          </div>`
    },
    shared: false,
    followCursor: true,
  }
  Object.assign(chartOptions, { tooltip: x })
  Object.assign(chartOptions.chart || {}, {
    events: {
      mouseMove: function (event, chartContext, config) {
        callback(reversedVerse.length - 1 - config.dataPointIndex)
      },
    },
  })
  return chartOptions
}
