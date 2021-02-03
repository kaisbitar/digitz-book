const chartOptions = {
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
      offsetY: 2
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100]
    }
  },
  zoom: {
    enabled: false
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top'
      }

    }
  },
  dataLabels: {
    enabled: false,
    style: { colors: ['grey'], fontFamily: '"Roboto", sans-serif !important', fontSize: '15px' },
    offsetY: -35
    // a0a0a0de
  },
  theme: {
    monochrome: {
      enabled: true,
      color: '#cccccc'
      // A1887F
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1.2,
    colors: ['#7c7c7c']
  },
  markers: {
    size: [0, 0]
  },
  xaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '15px',
        fontFamily: '"Roboto", sans-serif !important'
      }
    },
    axisTicks: {
      show: true,
      maxTicksLimit: 40,
      interval: 30
    },
    tickAmount: undefined,
    tickPlacement: 'between',
    title: {
      show: false,
      // text: 'آيات',
      style: {
        fontSize: '18px', fontFamily: '"Roboto", sans-serif !important'
      }
    },
    min: 0
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontFamily: '"Roboto", sans-serif !important'
      }
    },
    title: {
      offsetX: -50,
      style: {
        fontSize: '18px',
        fontFamily: '"Roboto", sans-serif !important'
      }
    },
    min: 1
    // max: undefined,
    // axisTicks: {
    //   autoskip: true,
    //   maxTicksLimit: 100,
    //   interval: 300
    // },
    // tickAmount: undefined,
    // tickPlacement: 'between'
  },
  grid: {
    show: false,
    padding: {
      top: 0,
      right: 30,
      bottom: 0,
      left: 30
    }
  }

}
export default chartOptions
