import { LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { StatisticIncomeType } from '@/types/statistic.type'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { CiDollar } from 'react-icons/ci'
import { FaArrowCircleUp } from 'react-icons/fa'
const IncomeManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  const { data, isLoading, refetch } = useQuery({
    queryKey: [Seller_QueryKeys.GET_WALLET],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/seller/statistic/order-income?month=${month}&year=${year}`)

      return resp.data.data
    },
  })

  const columns: TableColumn<StatisticIncomeType>[] = [
    {
      name: 'Mã đơn hàng',
      selector: (row) => row.orderId,
      wrap: true,
    },
    {
      name: 'Tổng tiền hàng',
      selector: (row) => formatPrice(row.totalPrice),
    },
    {
      name: 'Phí giao dịch sàn',
      selector: (row) => formatPrice(row.tax),
    },
    {
      name: 'Lợi nhuận',
      selector: (row) => formatPrice(row.amount),
    },
  ]

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(event.target.value))
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(event.target.value))
  }
  useEffect(() => {
    refetch()
  }, [month, year, refetch])

  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
      <option key={m} value={m}>
        Tháng {m}
      </option>
    ))
  }
  const getYearOptions = () => {
    return Array.from({ length: 2 }, (_, i) => currentYear - i).map((y) => (
      <option key={y} value={y}>
        Năm {y}
      </option>
    ))
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <span className="font-bold">
            Kết quả bán hàng trong tháng {month}/{year}
          </span>
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <CiDollar className="w-20 h-20 text-yellow-500" />
              <div>
                <p>Tổng đơn hàng</p>
                <p className="font-bold text-xl">{data?.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowCircleUp className="w-20 h-20 text-green-500" />
              <div>
                <p className="">Tổng doanh thu</p>
                {/* <p className="font-bold text-xl">{totalIncome}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable
            title={
              <div className="flex justify-between items-center">
                <p className="">CHI TIẾT DOANH THU SHOP</p>
                <div className="flex gap-2">
                  <select className="select select-info w-full max-w-xs" value={month} onChange={handleMonthChange}>
                    <option disabled>Chọn tháng</option>
                    {getMonthOptions()}
                  </select>
                  <select className="select select-info w-full max-w-xs" value={year} onChange={handleYearChange}>
                    <option disabled>Chọn năm</option>
                    {getYearOptions()}
                  </select>
                </div>
              </div>
            }
            columns={columns}
            data={data}
            progressPending={isLoading}
            progressComponent={<LoadingComponent />}
            highlightOnHover
            pagination
          />
        </div>
      </div>
    </section>
  )
}

export default IncomeManagement
