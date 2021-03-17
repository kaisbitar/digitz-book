var chartOptions = {
  chart: {
    type: 'area',
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
    },
    formatter: function (val, opt) {
      return opt.w.globals.seriesX[0][opt.dataPointIndex] + val
    }

  },
  stroke: {
    curve: 'smooth',
    width: 1.2,
    colors: ['#7c7c7c']
  },
  markers: {
    strokeColors: '#000',
    strokeWidth: 0.5,
    size: 4
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
