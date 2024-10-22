import { useTheme } from "vuetify"

export const getLettersChartOptions = (
  letters = { categories: [], series: [] },
  customOptions = {}
) => {
  const theme = useTheme()

  // Access theme colors
  const primaryColor = theme.current.value.colors["letter-count"]
  const secondaryColor = "#ccc"

  const defaultOptions = {
    chart: {
      type: "bar",
      offsetY: 0,
      toolbar: {
        show: true,
        offsetY: 200,
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        // gradientToColors: undefined,
        // gradientToColors: ["fff"],
        shade: "dark",
        // type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: [secondaryColor],
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [1, 0, 10],
      },
    },
    zoom: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: false,
        barHeight: "80%",
        isFunnel: true,
        dataLabels: {
          position: "top",
        },
        horizontal: true,
      },
    },

    // fillSeriesColor: primaryColor,
    // annotations: {
    //   xaxis: [
    //     {
    //       x: "ص",
    //       x2: "ح",
    //       borderColor: "#000",
    //       fillColor: "#FEB019",
    //     },
    //   ],
    //   yaxis: [
    //     {
    //       y: "ص",
    //       y2: 2000,
    //       borderColor: "#000",
    //       fillColor: "#FEB019",
    //       label: {
    //         text: "Y-axis range",
    //       },
    //     },
    //   ],
    // },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: "#616161",
        color: "#000",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#616161",
      },
      style: {
        fontSize: "16px",
        fontFamily: "unset",
        letterSpacing: "0 !important",
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: primaryColor,
      },
    },
    stroke: {
      curve: "smooth",
      width: 10,
      colors: ["#000"], // Use secondary color for stroke
    },
    xaxis: {
      labels: {
        show: false,
        style: {
          fontSize: "16px",
          fontFamily: "unset",
        },
      },
      axisTicks: {
        show: false,
      },
      tickAmount: undefined,
      tickPlacement: "between",
      title: {
        show: true,
        text: " تكرار الحروف في الكتاب",
        offsetY: 10,
        style: {
          fontSize: "18px",
          fontFamily: "unset",
          letterSpacing: "0 !important",
        },
      },
      min: 1,
    },
    // categories: letters.categories,
    yaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "unset",
        },
      },
      title: {
        offsetX: 10,
        style: {
          fontSize: "18px",
          fontFamily: "unset",
        },
      },
    },
    grid: {
      show: false,
    },
    markers: {
      size: [10, 10],
      color: "#000",
      hover: {
        size: 9,
        sizeOffset: 3,
        color: "#000",
      },
    },
    tooltip: {
      enabled: true,
      // shared: true,
      intersect: false,
      followCursor: true,
      shared: true,
      fixed: {
        enabled: true,
        position: "bottomRight", // Try 'topRight', 'bottomLeft', or 'bottomRight'
        offsetX: -100,
        offsetY: -200,
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex]
        const category = w.globals.labels[dataPointIndex]
        return `
          <div class="custom-tooltip d-flex">
            <div class="tipInfo tipInfo2 text-sm-h3 text-h4 pa-5">${category} ${value}</div>
          </div>
        `
      },
      // onDatasetHover: {
      //   highlightDataSeries: true,
      // },
    },
  }

  // Update themeColors object
  const themeColors = {
    theme: {
      monochrome: {
        enabled: true,
        color: primaryColor,
      },
    },
    stroke: {
      colors: [secondaryColor],
    },
  }

  // // Merge default options, theme colors, and custom options
  const mergedOptions = {
    ...defaultOptions,
    ...themeColors,
    ...customOptions,
    xaxis: {
      ...defaultOptions.xaxis,
      categories: letters.categories,
    },
    series: letters.series,
  }

  return mergedOptions
}

export default getLettersChartOptions
