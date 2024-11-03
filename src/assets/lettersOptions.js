export const lettersOptions = () => {
  return {
    chart: {
      type: "bar",
      offsetY: -10,
      toolbar: {
        show: true,
        offsetY: 20,
      },
    },
    tooltip: {
      followCursor: true,
      shared: true,
      intersect: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex]
        const category = w.globals.labels[dataPointIndex]
        return `
          <div class="custom-tooltip d-flex">
            <div class="tipInfo tipInfo2 text-sm-h3 text-h4 pa-5">${category} ${value}<span class="text-caption">مرة</span></div>
          </div>
        `
      },
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
        opacityTo: 0.6,
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
    dataLabels: {
      enabled: true,
      offsetY: -30,
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
        fontFamily: '"Tajawal", sans-serif !important',
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#cccccc",
      },
    },
    stroke: {
      curve: "smooth",
      width: 1.2,
      colors: ["#7c7c7c"],
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "16px",
          fontFamily: '"Tajawal", sans-serif !important',
        },
      },
      axisTicks: {
        show: true,
        maxTicksLimit: 40,
        interval: 30,
      },
      tickAmount: undefined,
      tickPlacement: "between",
      title: {
        show: true,
        text: " حروف الكتاب",
        offsetY: 0,
        style: {
          fontSize: "18px",
          fontFamily: '"Tajawal", sans-serif !important',
        },
      },
      min: 50,
    },
    yaxis: {
      labels: {
        show: false,
      },
      min: 0,
    },
    grid: {
      show: false,
    },
  }
}
export default lettersOptions
