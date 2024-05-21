import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { formatDate, formatPrice } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import vnpay from '@/assets/images/vnpay.png'
import { FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { TransactionType } from '@/types/transaction.type'

const BuyerWallet = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const [amount, setAmount] = useState(0)
  const [bankCode, setBankCode] = useState('')
  const client = useQueryClient()
  const [activeTab, setActiveTab] = useState('wallet')

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: [Buyer_QueryKeys.GET_WALLET],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/wallet')
      return resp.data.data
    },
  })

  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: [Buyer_QueryKeys.GET_HISTORY_TRANSACTION],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/transaction-history')
      return resp.data.data
    },
    enabled: !!wallet,
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

  const handleCreatWithdraw = async () => {
    try {
      const resp = await axiosPrivate.put(`/user/wallet/withdraw`, { amount })
      if (resp.status === 200) {
        client.invalidateQueries({ queryKey: [Buyer_QueryKeys.GET_WALLET] })
        setAmount(0)
        toast.success(resp.data.messages[0])
      }
    } catch (error) {
      toast.error('Lỗi')
    }
  }

  if (loadingWallet || loadingHistory) {
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
            <button
              onClick={() => {
                const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn btn-error text-white"
            >
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
          <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Thông tin rút tiền</h3>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Nhập số tiền rút</span>
                </div>
                <input
                  type="number"
                  placeholder="VNĐ"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </label>

              <div className="modal-action">
                <form method="dialog">
                  <div className="flex gap-2">
                    <button onClick={() => handleCreatWithdraw()} className="btn btn-success text-white">
                      Gửi yêu cầu
                    </button>
                    <button className="btn btn-error text-white">Đóng</button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {activeTab === 'historic' && (
        <>
          <div className="mt-5">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Người giao dịch</th>
                  <th>Loại</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item: TransactionType) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.ownerName}</td>
                    <td>{item.type}</td>
                    <td>{formatPrice(item.value)}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length === 0 && (
            <p className="text-center my-2 italic text-gray-500">Tài khoản của bạn chưa có giao dịch nào</p>
          )}
        </>
      )}
    </div>
  )
}

export default BuyerWallet
