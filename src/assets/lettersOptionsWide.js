// Creating categories for the chart to be reversed
const generateCategories = (length) => {
  return Array.from({ length }, (_, i) => i + 1).reverse()
}

export const getLettersChartOptions = (length) => {
  // const categories = generateCategories(length)
  return {
    chart: {
      type: "bar",
      height: 1000,
      offsetY: 20,
      toolbar: {
        show: false,
        offsetY: 2,
      },
      dir: "rtl",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    zoom: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
      },
    },
    zoom: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
      show: true,
      width: 2,
      colors: ["#000"],
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
      // categories: categories,
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
export default getLettersChartOptions

// const chartOptions = {
//   chart: {
//     type: 'bar',
//     offsetY: 20,
//     toolbar: {
//       show: true,
//       offsetY: 2
//     }
//   },
//   fill: {
//     type: 'gradient',
//     gradient: {
//       shade: 'light',
//       type: 'horizontal',
//       shadeIntensity: 0.25,
//       gradientToColors: undefined,
//       inverseColors: true,
//       opacityFrom: 0.85,
//       opacityTo: 0.85,
//       stops: [50, 0, 100]
//     }
//   },
//   zoom: {
//     enabled: false
//   },
//   plotOptions: {
//     bar: {
//       dataLabels: {
//         position: 'top'
//       }
//     }
//   },
//   dataLabels: {
//     enabled: true,
//     offsetY: -30,
//     background: {
//       enabled: true,
//       foreColor: '#616161',
//       color: '#000',
//       padding: 4,
//       borderRadius: 2,
//       borderWidth: 1,
//       borderColor: '#616161'
//     },
//     style: {
//       fontSize: '16px',
//       fontFamily: '"Tajawal", sans-serif !important'
//     }
//   },
//   theme: {
//     monochrome: {
//       enabled: true,
//       color: '#cccccc'
//     }
//   },
//   stroke: {
//     curve: 'smooth',
//     width: 1.2,
//     colors: ['#7c7c7c']
//   },
//   xaxis: {
//     labels: {
//       show: true,
//       style: {
//         fontSize: '16px',
//         fontFamily: '"Tajawal", sans-serif !important'
//       }
//     },
//     axisTicks: {
//       show: true,
//       maxTicksLimit: 40,
//       interval: 30
//     },
//     tickAmount: undefined,
//     tickPlacement: 'between',
//     title: {
//       show: true,
//       text: ' تكرار الحروف',
//       offsetY: 10,
//       style: {
//         fontSize: '18px', fontFamily: '"Tajawal", sans-serif !important'
//       }
//     },
//     min: 1
//   },
//   yaxis: {
//     labels: {
//       show: true,
//       style: {
//         fontFamily: '"Tajawal", sans-serif !important'
//       }
//     },
//     title: {
//       offsetX: 10,
//       style: {
//         fontSize: '18px',
//         fontFamily: '"Tajawal", sans-serif !important'
//       }
//     }
//   },
//   grid: {
//     show: false,
//     padding: {
//       top: 0,
//       right: 30,
//       bottom: 0,
//       left: 30
//     }
//   }

// }
// export default chartOptions
