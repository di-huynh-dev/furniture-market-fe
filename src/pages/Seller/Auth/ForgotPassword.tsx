/* eslint-disable @typescript-eslint/no-explicit-any */
import authApi from '@/api/buyer/buyerAuthApi'
import { LoadingButton } from '@/components'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async () => {
    setIsLoading(true)
    try {
      const otpResp = await authApi.sendOtp(email, 'RESET_PASSWORD')
      if (otpResp.status === 200) {
        localStorage.setItem('registeredSellerEmail', email)
        toast.success(otpResp.data.messages[0])
        navigate('/seller/confirm-password')
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response.data.messages[0])
    }
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card shadow-xl w-[500px] p-4">
        <div className="flex items-center gap-4 font-bold">
          <Link to={'/seller/login'}>
            {' '}
            <FaArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-xl text-center">Lấy lại mật khẩu</span>
        </div>
        <div className="text-center my-2">
          <p>Vui lòng nhập vào email đã đăng ký tài khoản. Chúng tôi sẽ gửi mã xác thực về email của bạn</p>
        </div>
        <input
          type="email"
          placeholder="ngvana123@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered input-primary w-full my-10"
        />
        <button className="btn btn-primary w-full text-white capitalize" onClick={handleSendOtp}>
          {isLoading ? <LoadingButton /> : 'Gửi mã'}
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
