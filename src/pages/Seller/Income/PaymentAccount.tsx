import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import vnpay from '@/assets/images/vnpay.png'
import { formatPrice } from '@/utils/helpers'

const PaymentAccount = () => {
  const axiosPrivate = useAxiosPrivate()
  const [amount, setAmount] = useState(0)
  const [bankCode, setBankCode] = useState('')

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: [Seller_QueryKeys.GET_WALLET],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/wallet')
      return resp.data.data
    },
  })

  const handleCreatePayment = async () => {
    if (!amount || !bankCode) {
      toast.error('Vui lòng nhập đầy đủ thông tin nạp tiền!')
      return
    }
    try {
      const resp = await axiosPrivate.get(`/payment/create-payment?amount=${amount}&bankCode=${bankCode}`)
      if (resp.status === 200) {
        setAmount(0)
        setBankCode('')
        window.open(resp.data.data, '_blank')
      } else {
        toast.error('Lỗi')
      }
    } catch (error) {
      toast.error('Lỗi')
    }
  }

  if (loadingWallet) {
    return <div>Loading...</div>
  }
  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg my-2 bg-white p-10">
        <div className="pb-5 lg:text-lg text-sm">
          <div className="grid md:grid-cols-2">
            <div>
              <div className="font-bold capitalize">Quản lý ví tiền của tôi</div>
              <div className="text-gray-500 text-sm">Thông tin về số dư của bạn, nạp rút tiền trên tài khoản</div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <div className="flex items-center gap-2">
            <p>Số dư của bạn:</p>
            <p className="text-primary text-lg font-bold">{formatPrice(wallet.value)}</p>
          </div>
          <img src={vnpay} alt="" />
          <div className="flex gap-2 my-4">
            <button
              onClick={() => {
                const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn btn-success text-white"
            >
              <FaCompressArrowsAlt className="w-6 h-6" />
              Nạp tiền vào ví qua VN Pay
            </button>
            <button className="btn btn-error text-white">
              <FaExpandArrowsAlt className="w-6 h-6" />
              Tạo yêu cầu Rút tiền
            </button>
          </div>
          <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Thông tin nạp tiền</h3>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Nhập số tiền nạp</span>
                </div>
                <input
                  type="number"
                  placeholder="VNĐ"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </label>
              <p className="text-sm">Chọn ngân hàng</p>
              <select
                className="select select-bordered w-full max-w-xs my-2"
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option disabled selected>
                  Chọn ngân hàng
                </option>
                <option value={'NCB'}>NCB</option>
                <option value={'AGRIBANK'}>AGRIBANK</option>
                <option value={'VIETBANK'}>BIDV</option>
                <option value={'VIETINBANK'}>VIETINBANK</option>
                <option value={'MBBANK'}>MBBANK</option>
                <option value={'SACOMBANK'}>SACOMBANK</option>
              </select>
              <div className="modal-action">
                <form method="dialog">
                  <div className="flex gap-2">
                    <button onClick={() => handleCreatePayment()} className="btn btn-success text-white">
                      Tạo giao dịch
                    </button>
                    <button className="btn btn-error text-white">Đóng</button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </section>
  )
}

export default PaymentAccount
