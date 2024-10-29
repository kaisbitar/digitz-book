// Creating categories for the chart to be reversed
const generateCategories = (length) => {
  return Array.from({ length }, (_, i) => i + 1).reverse()
}

export const getChartOptions = (length) => {
  const categories = generateCategories(length)
  return {
    chart: {
      type: "area",
      offsetY: 20,
      toolbar: {
        show: false,
        offsetY: 2,
      },
      dir: "rtl",
    },
    zoom: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      // style: { colors: ['grey'] }
    },
    theme: {
      // mode: "dark",
      monochrome: {
        enabled: true,
        color: "#4c4c4c",
        // A1887F
      },
    },
    stroke: {
      curve: "smooth",
      width: 1.2,
      colors: ["#0000001f"],
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      intersect: false,
      shared: false,
      custom: undefined,
      fillSeriesColor: false,
      theme: false,
      style: {
        fontSize: "0px",
      },
      onDatasetHover: {
        highlightDataSeries: false,
      },
      x: { show: false },
      y: { show: false },
      marker: { show: false },
    },
    markers: {
      size: [0, 0],
      color: "#000",
      hover: {
        size: 9,
        sizeOffset: 3,
        color: "#000",
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
        // maxTicksLimit: 200,
        // interval: 5,
      },
      // tickAmount: 20,
      // tickPlacement: "between",
      title: {
        show: true,
        text: "التواتر",
        offsetY: 5,
        style: {
          fontSize: "18px",
          fontFamily: '"Roboto", sans-serif !important',
          color: "#ccc",
        },
      },
      min: 1,
    },
    yaxis: {
      floating: true,
      showAlways: false,
      labels: {
        show: false,
        style: {
          fontFamily: '"Roboto", sans-serif !important',
        },
      },
      title: {
        offsetX: -50,
        style: {
          fontSize: "18px",
          fontFamily: '"Roboto", sans-serif !important',
        },
      },
      min: 0,
      max: undefined,
      axisTicks: {
        show: false,
        maxTicksLimit: 2,
        interval: 2,
      },
      tickAmount: 1,
      tickPlacement: "between",
    },
    colors: ["#000"],
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 30,
      },
    },
  }
}
export default getChartOptions
