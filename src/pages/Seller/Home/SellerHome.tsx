import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import { RiBillFill } from 'react-icons/ri'
import { MdTableRestaurant } from 'react-icons/md'
import IncomeLineChart from './components/IncomeLineChart'
import OrderBarChart from './components/OrderBarChart'
import SoldPieChart from './components/SoldePieChart'

const SellerHome = () => {
  const axiosPrivate = useAxiosPrivate()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  const {
    data: statistics,
    isLoading: loadingStatistics,
    refetch,
  } = useQuery({
    queryKey: [Seller_QueryKeys.SHOP_STATISTICS, month, year],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`seller/statistic?month=${month}&year=${year}`)
      return resp.data.data
    },
  })

  useEffect(() => {
    document.title = 'Fnest - Kênh người bán'
  }, [])

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
        {m}
      </option>
    ))
  }

  const getYearOptions = () => {
    return Array.from({ length: 2 }, (_, i) => currentYear - i).map((y) => (
      <option key={y} value={y}>
        {y}
      </option>
    ))
  }

  if (loadingStatistics) {
    return <div>Loading...</div>
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="">
        <div className="pb-5 lg:text-lg text-sm">
          <div className="grid md:grid-cols-2">
            <div>
              <div className="font-bold capitalize">Tổng quan shop</div>
            </div>
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
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2 my-2 bg-white p-10">
            <div>
              <p className="font-bold">
                Doanh thu tháng {month}/{year}
              </p>
              <p className="text-2xl">{formatPrice(statistics?.income)}</p>
            </div>
            <FaMoneyBillTrendUp className="w-20 h-20 text-yellow-500" />
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2 my-2 bg-white p-10">
            <div>
              <p className="font-bold">Tổng số đơn hàng</p>
              <p className="text-2xl">{statistics?.numOfOrderByMonth}</p>
            </div>
            <RiBillFill className="w-20 h-20 text-red-500" />
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2 my-2 bg-white p-10">
            <div>
              <p className="font-bold">Tổng sản phẩm bán được</p>
              <p className="text-2xl">{statistics?.soldProduct}</p>
            </div>
            <MdTableRestaurant className="w-20 h-20 text-blue-500" />
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2 my-2 bg-white p-10">
            <div>
              <p className="font-bold">Sản phẩm bán chạy</p>
              <p className="">{statistics?.productOfTheMonth?.name}</p>
            </div>
            <img
              src={statistics?.productOfTheMonth?.thumbnail}
              alt={statistics?.productOfTheMonth?.name}
              className="w-[100px]"
            />
          </div>
        </div>
        <div className="rounded-md border w-full py-4 justify-center bg-white my-2">
          <IncomeLineChart data={statistics} />
        </div>
        <div className="flex items-center gap-2 rounded-md border w-full py-4 justify-center bg-white my-2">
          <OrderBarChart data={statistics} />
          <SoldPieChart data={statistics} />
        </div>
      </div>
    </section>
  )
}

export default SellerHome
