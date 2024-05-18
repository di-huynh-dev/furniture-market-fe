import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js'
import { StatisticType } from '@/types/statistic.type'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

interface PieChartProps {
  data: StatisticType
}

const SoldPieChart: React.FC<PieChartProps> = ({ data }) => {
  // Placeholder product names
  const productNames = data.soldByProductResponses.map((item) => `Sản phẩm ${item.productId}`)
  const soldCounts = data.soldByProductResponses.map((item) => item.soldCount)

  const formattedData: ChartData<'pie'> = {
    labels: productNames,
    datasets: [
      {
        label: 'Tỷ lệ sản phẩm đã bán',
        data: soldCounts,
        backgroundColor: soldCounts.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255,
            )}, 0.5)`,
        ),
        borderColor: soldCounts.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255,
            )}, 1)`,
        ),
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tỷ lệ sản phẩm đã bán',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.raw as number
            return `${label}: ${value} sản phẩm`
          },
        },
      },
    },
  }

  return (
    <div className="w-1/2">
      <Pie data={formattedData} options={options} />
    </div>
  )
}

export default SoldPieChart
