const chartOptions = {
  chart: {
    type: 'area',
    offsetY: 20,
    toolbar: {
      show: true,
      offsetY: 2
    },
    dir: 'rtl'
  },
  zoom: {
    enabled: true
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true
    // style: { colors: ['grey'] }
  },
  theme: {
    monochrome: {
      enabled: true,
      color: '#9E9E9E'
      // A1887F
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1.2,
    colors: ['#0000001f']
  },
  markers: {
    size: [0, 0],
    color: '#000',
    hover: {
      size: 9,
      sizeOffset: 3,
      color: '#000'

    }
  },
  xaxis: {
    labels: {
      show: true
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
      text: 'تواتر الآيات',
      offsetY: 10,
      style: {
        fontSize: '18px', fontFamily: '"Roboto", sans-serif !important'
      }
    },
    min: 1
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
    min: 1,
    max: undefined,
    axisTicks: {
      show: true,
      maxTicksLimit: 2,
      interval: 2
    },
    tickAmount: 1,
    tickPlacement: 'between'
  },
  colors: ['#000'],
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
