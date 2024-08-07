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
import { LoadingComponent } from '@/components'

const SellerHome = () => {
  const axiosPrivate = useAxiosPrivate()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  useEffect(() => {
    document.title = 'Fnest - Kênh người bán'
  }, [])

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

  if (loadingStatistics) {
    return <LoadingComponent />
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
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-2">
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
            <div>
              <p className="font-bold">
                Doanh thu tháng {month}/{year}
              </p>
              <p className="md:text-2xl text-lg">{formatPrice(statistics?.totalIncome)}</p>
            </div>
            <div className="flex justify-end">
              <FaMoneyBillTrendUp className="md:h-20 w-16 h-16 text-yellow-500" />
            </div>
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
            <div>
              <p className="font-bold">Tổng số đơn hàng</p>
              <p className="md:text-2xl text-lg">{statistics?.numOfOrderByMonth}</p>
            </div>
            <div className="flex justify-end">
              <RiBillFill className="md:h-20 w-16 h-16 text-red-500" />
            </div>
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
            <div>
              <p className="font-bold">Tổng sản phẩm bán được</p>
              <p className="md:text-2xl text-lg">{statistics?.soldProduct}</p>
            </div>
            <div className="flex justify-end">
              <MdTableRestaurant className="md:h-20 w-16 h-16 text-blue-500" />
            </div>
          </div>
          <div className="card shadow-lg items-center gap-2 grid grid-cols-2  bg-white px-6 py-4">
            <div>
              <p className="font-bold">Sản phẩm bán chạy</p>
              <p className="">{statistics?.productOfTheMonth?.name}</p>
            </div>
            <div className="flex justify-end">
              <img
                src={statistics?.productOfTheMonth?.thumbnail}
                alt={statistics?.productOfTheMonth?.name}
                className="w-[100px]"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md border w-full py-4 justify-center bg-white my-2">
          <IncomeLineChart data={statistics} />
        </div>
        <div className="lg:flex lg:items-center justify-center gap-2 rounded-md border w-full py-4  bg-white my-2">
          <OrderBarChart data={statistics} />
          <SoldPieChart data={statistics} />
        </div>
      </div>
    </section>
  )
}

export default SellerHome
