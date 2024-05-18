import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { StatisticType } from '@/types/statistic.type'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarProps {
  data: StatisticType
}

const OrderBarChart: React.FC<BarProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDate().toString()
  }

  const formattedData: ChartData<'bar'> = {
    labels: data.numOfOrderByDays.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Số đơn hàng theo ngày',
        data: data.numOfOrderByDays.map((item) => item.amount),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê số đơn hàng theo ngày',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số đơn hàng',
        },
        max: Math.max(...data.numOfOrderByDays.map((item) => item.amount)) + 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="w-1/2">
      <Bar data={formattedData} options={options} />
    </div>
  )
}

export default OrderBarChart
