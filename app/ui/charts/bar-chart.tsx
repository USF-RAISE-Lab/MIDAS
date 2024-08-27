import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';
import { stackedBarOptions } from './bar-configs';
import { RiskLevelCategory } from './risk-level-category-type';

Chart.register(...registerables);

function MyBarChart({
  data
}: {
  data: RiskLevelCategory[]
}) {
  const formattedData = {
    labels: data.map(riskLevel => riskLevel.label),
    datasets  : [
      {
        label: "Low Risk",
        data: data.map(riskLevel => riskLevel.lowRisk),
        backgroundColor: "#4ade80",
      },
      {
        label: "Some Risk",
        data: data.map(riskLevel => riskLevel.someRisk),
        backgroundColor: "#fde047",
      },
      {
        label: "High Risk",
        data: data.map(riskLevel => riskLevel.highRisk),
        backgroundColor: "#fb7185",
      },
    ],
  }

  return (
    <Bar data={formattedData} options={stackedBarOptions}/> 
  )
}

export default MyBarChart;