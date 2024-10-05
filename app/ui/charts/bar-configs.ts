import { BarElement, CategoryScale, Chart, ChartOptions, Legend, LinearScale, Title, Tooltip } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const stackedBarOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x',
  datasets: {
    bar: {
      barPercentage: 0.7
    }
  },
  plugins: {
    datalabels: {
      color: "#404040",
      formatter: function (value) {

        // Hide the label if it is less than 2.5%
        if (value < 0.025) {
          return null;
        } 
        else {
          return (value * 100).toFixed(1) + '%';
        }
      },
      font: {
        weight: 'lighter',
        size: 16,
      }
    },
    
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Stacked Bar Chart',
    },
    tooltip: {
      backgroundColor: "#262626"
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      stacked: true,
      title: {
        display: false
      },
      max: 1,
      ticks: {
        display: true
      },
      border: {
        display: false
      }
    },
  },
};
