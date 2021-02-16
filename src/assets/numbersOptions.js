const chartOptions = {
  chart: {
    type: 'bar',
    offsetY: 20,
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
    enabled: true,
    offsetY: 9,
    background: {
      enabled: true,
      foreColor: '#616161',
      color: '#000',
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#616161'
    },
    style: {
      fontSize: '16px',
      fontFamily: '"Tajawal", sans-serif !important'
    }
  },
  theme: {
    monochrome: {
      enabled: true,
      color: '#cccccc'
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1.2,
    colors: ['#7c7c7c']
  },
  xaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '16px',
        fontFamily: '"Tajawal", sans-serif !important'
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
      show: true,
      text: ' تكرار الحروف',
      offsetY: 10,
      style: {
        fontSize: '18px', fontFamily: '"Tajawal", sans-serif !important'
      }
    },
    min: 1
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontFamily: '"Tajawal", sans-serif !important'
      }
    },
    title: {
      offsetX: 10,
      style: {
        fontSize: '18px',
        fontFamily: '"Tajawal", sans-serif !important'
      }
    }
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
