import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import vnpay from '@/assets/images/vnpay.png'
import { FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const BuyerWallet = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const [amount, setAmount] = useState(0)
  const [bankCode, setBankCode] = useState('')

  const [activeTab, setActiveTab] = useState('wallet')

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: [Buyer_QueryKeys.GET_WALLET],
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
    <div className="mx-4 my-2">
      <div className="pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Quản lý ví tiền của tôi</div>
            <div className="text-gray-500 text-sm">Thông tin về số dư của bạn, nạp rút tiền trên tài khoản</div>
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-lifted">
        <a
          role="tab"
          onClick={() => setActiveTab('wallet')}
          className={`tab ${
            activeTab === 'wallet' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Số dư
        </a>
        <a
          role="tab"
          onClick={() => setActiveTab('historic')}
          className={`tab ${
            activeTab === 'historic' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Lịch sử giao dịch
        </a>
        <a
          role="tab"
          onClick={() => setActiveTab('account-list')}
          className={`tab ${
            activeTab === 'account-list' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Danh sách tài khoản
        </a>
      </div>

      {/* Tab content */}
      {activeTab === 'wallet' && (
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
      )}
    </div>
  )
}

export default BuyerWallet
