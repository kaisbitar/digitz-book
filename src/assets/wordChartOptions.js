const chartOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  zoom: { enabled: false },
  theme: {
    monochrome: {
      enabled: true,
      color: '#757575'
    }
  },
  yaxis: {
    show: false
  },
  xaxis: {
    axisTicks: {
      show: true,
      maxTicksLimit: 40,
      interval: 30
    },
    tickAmount: undefined,
    tickPlacement: 'between',
    labels: {
      show: true,
      style: {
        fontSize: '16px',
        fontFamily: '"Tajawal", sans-serif !important'
      }
    }
  },
  onDatasetHover: {
    highlightDataSeries: true
  },
  dataLabels:
  {
    enabled: true,
    offsetY: -10,
    background: {
      enabled: true,
      foreColor: '#fff',
      color: '#000',
      padding: 4,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#616161'
    }
    // formatter: function (val, opt) {
    //   console.log(opt.w.globals.seriesX[0][1])
    //   return opt.w.globals.seriesX[0][opt.dataPointIndex] + val
    // }

  },
  stroke: {
    curve: 'smooth',
    width: 1.2,
    colors: ['#7c7c7c']
  },
  markers: {
    strokeColors: '#000',
    strokeWidth: 0.7,
    size: 3
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top'
      }
    }
  },
  grid: {
    show: false
  }
}
export default chartOptions
