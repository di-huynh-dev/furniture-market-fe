import { CiDollar } from 'react-icons/ci'
import { FaArrowCircleUp } from 'react-icons/fa'
const IncomeManagement = () => {
  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <span className="font-bold">Kết quả bán hàng hôm nay</span>
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <CiDollar className="w-20 h-20 text-yellow-500" />
              <div>
                <p>100 hóa đơn</p>
                <p className="font-bold text-xl">100.000đ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowCircleUp className="w-20 h-20 text-green-500" />
              <div>
                <p className="font-bold text-green-500 text-xl">19.3 %</p>

                <p>So với hôm trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <p className="font-bold">DOANH THU THUẦN HÔM NAY</p>
            <select className="select select-success max-w-sn">
              <option disabled selected>
                Tháng này
              </option>
              <option>7 ngày qua</option>
              <option>Tháng trước</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <p className="font-bold">TOP 10 HÀNG HÓA BÁN CHẠY THÁNG NÀY</p>
            <select className="select select-success max-w-sn">
              <option disabled selected>
                Tháng này
              </option>
              <option>7 ngày qua</option>
              <option>Tháng trước</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IncomeManagement
