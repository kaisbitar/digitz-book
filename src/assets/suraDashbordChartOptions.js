const chartOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: true,
      offsetY: 2
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
    size: [0, 0]
  },
  xaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '18px',
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
    }
    // min: 0,
    // max: undefined,
    // axisTicks: {
    //   autoskip: true,
    //   maxTicksLimit: 100,
    //   interval: 300
    // },
    // tickAmount: undefined,
    // tickPlacement: 'between'
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
