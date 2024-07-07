/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buyer_QueryKeys, Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import vnpay from '@/assets/images/vnpay.png'
import { formatPrice } from '@/utils/helpers'
import { TransactionType } from '@/types/transaction.type'
import DataTable, { TableColumn } from 'react-data-table-component'
import { LoadingComponent } from '@/components'
import { axiosCommon } from '@/libs/axios-client'
import { BankType } from '@/pages/Buyer/Profile/BuyerWallet'

const PaymentAccount = () => {
  const axiosPrivate = useAxiosPrivate()
  const [amount, setAmount] = useState(0)
  const [bankInfo, setBankInfo] = useState<BankType>({ shortName: '', name: '' })
  const [bankNumber, setBankNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const client = useQueryClient()
  const [bankCode, setBankCode] = useState('')
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest Seller - Số dư ví'
  }, [])

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: [Seller_QueryKeys.GET_WALLET],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/wallet')
      return resp.data.data
    },
  })

  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: [Seller_QueryKeys.GET_HISTORY_TRANSACTION],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/transaction-history')
      return resp.data.data
    },
    enabled: !!wallet,
  })

  const { data: bankList, isLoading: loadingBank } = useQuery({
    queryKey: [Buyer_QueryKeys.BANK_LIST],
    queryFn: async () => {
      const resp = await axiosCommon.get('https://api.vietqr.io/v2/banks')
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
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleCreatWithdraw = async () => {
    try {
      const resp = await axiosPrivate.post(`/user/withdrawal`, {
        value: amount,
        accountNumber: bankNumber,
        bankName: `${bankInfo.shortName} - ${bankInfo.name}`,
        ownerName: ownerName,
      })
      if (resp.status === 200) {
        client.invalidateQueries({ queryKey: [Seller_QueryKeys.GET_WALLET] })
        setAmount(0)
        setBankCode('')
        setBankInfo({ shortName: '', name: '' })
        setBankNumber('')
        setOwnerName('')
        toast.success(resp.data.messages[0])
      }
    } catch (error) {
      toast.error('Lỗi')
    }
  }

  const columns: TableColumn<TransactionType>[] = [
    { name: 'Mã giao dịch', cell: (row) => row.id },
    {
      name: 'Nguời giao dịch',
      cell: (row) => row.ownerName,
    },
    {
      name: 'Hình thức',
      cell: (row) =>
        row.type === 'CHARGE' ? (
          <div className="flex gap-1 items-center">
            <p>Nạp</p>
          </div>
        ) : row.type === 'ORDER_INCOME' ? (
          <div className="flex gap-1 items-center">
            <p>Lợi nhuận đơn hàng</p>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <p>Rút</p>
          </div>
        ),
    },
    {
      name: 'Giá trị',
      cell: (row) => (
        <span
          style={{
            color: row.type === 'PAY' ? 'red' : 'green',
          }}
        >
          {row.type === 'PAY' ? `-${formatPrice(row.value)}` : formatPrice(row.value)}
        </span>
      ),
    },
    { name: 'Thời gian', selector: (row) => row.createdAt },
  ]

  if (loadingWallet || loadingHistory || loadingBank) {
    return <LoadingComponent />
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

        <div role="tablist" className="tabs tabs-lifted">
          <div
            role="tab"
            onClick={() => handleTabClick('')}
            className={`tab ${
              activeTab === '' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
            }`}
          >
            Số dư ví
          </div>
          <div
            role="tab"
            className={`tab ${
              activeTab === 'HISTORY' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
            }`}
            onClick={() => handleTabClick('HISTORY')}
          >
            Lịch sử giao dịch
          </div>
        </div>

        {activeTab === '' && (
          <div className="my-4">
            <div className="flex items-center gap-2">
              <p>Số dư của bạn:</p>
              <p className="text-primary text-lg font-bold">{formatPrice(wallet.value)}</p>
            </div>
            <img src={vnpay} alt="" />
            <div className="md:flex gap-2 my-4">
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                  dialog.showModal()
                }}
                className="btn btn-success text-white my-2"
              >
                <FaCompressArrowsAlt className="w-6 h-6" />
                Nạp tiền vào ví qua VN Pay
              </button>
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                  dialog.showModal()
                }}
                className="btn btn-error text-white my-2"
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

                <select
                  className="select select-bordered w-full  my-2"
                  onChange={(e) => {
                    const selectedBank = bankList?.find(
                      (item: BankType) => `${item.name} - ${item.shortName}` === e.target.value,
                    )
                    if (selectedBank) {
                      setBankInfo(selectedBank)
                    }
                  }}
                >
                  <option disabled selected>
                    Chọn ngân hàng
                  </option>
                  {bankList?.map((item: BankType) => (
                    <option value={`${item.name} - ${item.shortName}`}>
                      {item.shortName} - {item.name}
                    </option>
                  ))}
                </select>
                <label className="form-control w-full  my-2">
                  <div className="label">
                    <span className="label-text">Nhập số tài khoản</span>
                  </div>
                  <input
                    type="string"
                    className="input input-bordered w-full "
                    onChange={(e) => setBankNumber(e.target.value)}
                  />
                </label>

                <label className="form-control w-full  my-2">
                  <div className="label">
                    <span className="label-text">Tên chủ thẻ</span>
                  </div>
                  <input
                    type="string"
                    placeholder="Viết hoa không dấu, không chứa dấu cách"
                    className="input input-bordered w-full "
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </label>

                <label className="form-control w-full  my-2">
                  <div className="label">
                    <span className="label-text">Nhập số tiền rút</span>
                  </div>
                  <input
                    type="number"
                    placeholder="VNĐ"
                    className="input input-bordered w-full "
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

        {activeTab === 'HISTORY' && (
          <>
            <DataTable
              title="Lịch sử giao dịch"
              data={history}
              columns={columns}
              pagination
              progressPending={loadingHistory}
              progressComponent={<LoadingComponent />}
            />
          </>
        )}
      </div>
    </section>
  )
}

export default PaymentAccount
