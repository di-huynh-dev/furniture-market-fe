import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { StatisticType } from '@/types/statistic.type'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface LineProps {
  data: StatisticType
}

const IncomeLineChart: React.FC<LineProps> = ({ data }) => {
  const formattedData: ChartData<'line'> = {
    labels: data.numOfOrderByDays.map((item) => item.date),
    datasets: [
      {
        label: 'Doanh thu theo ngày trong tháng (triệu đồng)',
        data: data.incomeByDays.map((item) => item.incomeByDay / 1000000), // Convert to triệu đồng (millions)
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu và số đơn hàng theo ngày',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Số tiền (triệu đồng)',
        },
        max: Math.max(...data.incomeByDays.map((item) => item.incomeByDay)) / 1000000 + 1, // Convert to triệu đồng (millions)
        ticks: {
          stepSize: 1,
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Số đơn hàng',
        },
        max: Math.max(...data.numOfOrderByDays.map((item) => item.amount)) + 1,
        ticks: {
          stepSize: 1,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return <Line data={formattedData} options={options} />
}

export default IncomeLineChart
