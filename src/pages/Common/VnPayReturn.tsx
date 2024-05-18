import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaWindowClose, FaHome, FaWallet } from 'react-icons/fa'
import { formatPrice } from '@/utils/helpers'
import { useEffect } from 'react'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { toast } from 'react-toastify'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { selectAuth } from '@/redux/reducers/authSlice'
import { useSelector } from 'react-redux'

const VnPayReturn = () => {
  const location = useLocation()
  const axiosPrivateBuyer = useAxiosBuyerPrivate()
  const axiosPrivateSeller = useAxiosPrivate()
  const user = useSelector(selectAuth)
  const searchParams = new URLSearchParams(location.search)
  const vnpAmount = searchParams.get('vnp_Amount')
  const vnpBankCode = searchParams.get('vnp_BankCode')
  const vnp_TransactionNo = searchParams.get('vnp_TransactionNo')
  const vnp_TxnRef = searchParams.get('vnp_TxnRef')
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode')

  const navigation = useNavigate()

  useEffect(() => {
    if (vnp_ResponseCode === '00') {
      chargePayment()
    }
  }, [])
  const chargePayment = async () => {
    try {
      if (user && user.authData.user.role === 'BUYER') {
        const resp = await axiosPrivateBuyer.put('/user/wallet/charge', {
          vnpOtp: vnp_TxnRef,
          amount: Number(vnpAmount) / 100,
        })
        if (resp.status === 200) {
          toast.success(resp.data.messages[0])
        }
      } else {
        const resp = await axiosPrivateSeller.put('/user/wallet/charge', {
          vnpOtp: vnp_TxnRef,
          amount: Number(vnpAmount) / 100,
        })
        if (resp.status === 200) {
          toast.success(resp.data.messages[0])
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="card shadow-lg bg-white my-4 mx-40 p-10">
      <p className="text-xl font-bold">Kết quả thanh toán</p>
      <div className="my-4 flex  justify-center">
        {vnp_ResponseCode === '00' ? <FaCheckCircle className="w-20 h-20 text-green-500 " /> : <FaWindowClose />}
      </div>
      <div className="text-center">
        {vnp_ResponseCode === '00' ? (
          <p className="font-bold text-lg">Thanh toán thành công</p>
        ) : (
          <p className="font-bold text-lg text-red-500">Thanh toán thất bại</p>
        )}
        <p>Mã giao dịch: {vnp_TransactionNo}</p>
        <p>Số tiền giao dịch: {formatPrice(Number(vnpAmount) / 100)}</p>
        <p>Ngân hàng: {vnpBankCode}</p>
      </div>
      <div className="flex gap-2 justify-center my-4">
        <button className="btn btn-primary text-white" onClick={() => navigation('/')}>
          <FaHome />
          Trở lại trang chủ
        </button>
        <button className="btn btn-primary text-white" onClick={() => navigation('/buyer/account/wallet')}>
          <FaWallet />
          Ví
        </button>
      </div>
    </div>
  )
}

export default VnPayReturn
