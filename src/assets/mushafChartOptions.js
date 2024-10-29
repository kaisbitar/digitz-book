// Creating categories for the mushaf chart
const generateCategories = (length) => {
  return Array.from({ length }, (_, i) => i + 1).reverse()
}

export const getMushafChartOptions = (length) => {
  const categories = generateCategories(length)
  return {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      dir: "rtl",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      width: 1.2,
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#4c4c4c",
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      shared: true,
      followCursor: true,
      custom: undefined, // This will be set by setMushafToolTip function
    },
    grid: {
      show: false,
    },
  }
}

export default getMushafChartOptions
