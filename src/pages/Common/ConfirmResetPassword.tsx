/* eslint-disable @typescript-eslint/no-explicit-any */
import authApi from '@/api/buyer/buyerAuthApi'
import { LoadingButton } from '@/components'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ConfirmResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const registeredBuyerEmail = localStorage.getItem('registeredBuyerEmail')
  const registeredSellerEmail = localStorage.getItem('registeredSellerEmail')
  const email = registeredBuyerEmail || registeredSellerEmail || ''

  const initialSeconds = 5 * 60
  const [countdown, setCountdown] = useState(initialSeconds)
  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1)
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown])

  const inputRefs = useRef<
    [
      HTMLInputElement | null,
      HTMLInputElement | null,
      HTMLInputElement | null,
      HTMLInputElement | null,
      HTMLInputElement | null,
      HTMLInputElement | null,
    ]
  >([null, null, null, null, null, null])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = event.target.value
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp]
      newOtp[index] = value
      if (value.length === 1 && index < inputRefs.current.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]!.focus()
      }
      return newOtp
    })
  }

  const handleConfirmOTP = async () => {
    setIsLoading(true)
    try {
      const otpStr = otp.join('')
      const resp = await authApi.confirmResetPassword(email, otpStr)

      setIsLoading(false)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        if (registeredBuyerEmail) {
          navigate('/buyer/login')
          localStorage.setItem('registeredBuyerEmail', '')
        } else if (registeredSellerEmail) {
          navigate('/seller/login')
          localStorage.setItem('registeredSellerEmail', '')
        }
      } else {
        toast.error('OTP không hợp lệ')
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response.data.messages[0])
    }
  }

  const resendOtp = async () => {
    if (email === '') {
      toast.error('Không có địa chỉ email để gửi OTP')
      return
    }

    setIsLoading(true)
    try {
      const resp = await authApi.sendOtp(email, 'REGISTER_USER')
      if (resp.data.status === 'OK') {
        setIsLoading(false)
        setCountdown(initialSeconds)
        toast.success('Mã xác nhận đã được gửi lại')
      } else {
        setIsLoading(false)
        toast.error('Unknown error occurred')
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="card shadow-xl w-[500px] p-4">
        <div className="flex items-center gap-4 justify-center font-bold">
          <span className="text-xl text-center">Nhập mã xác nhận</span>
        </div>
        <div className="text-center">
          <p className="text-sm m-2">Mã xác minh của bạn đã được gửi bằng tin nhắn đến email</p>
          {registeredBuyerEmail && <p>{registeredBuyerEmail}</p>}
          {registeredSellerEmail && <p>{registeredSellerEmail}</p>}
        </div>
        <div className="grid grid-cols-6 gap-6 my-12">
          {Array.from({ length: 6 }, (_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(event) => handleInputChange(event, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              placeholder="_"
              className="flex-1 h-14 border border-gray-400 rounded-xl text-center font-bold text-xl text-black"
            />
          ))}
        </div>
        <div className="text-center my-4">
          <p>OTP hết hạn sau:</p>
          {countdown > 0 && <p>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>}
        </div>

        <button className="btn btn-primary w-full text-white capitalize" onClick={() => handleConfirmOTP()}>
          {isLoading ? <LoadingButton /> : 'Xác thực email'}
        </button>
        <div className="text-center m-4">
          <p className="text-sm">Bạn vẫn chưa nhận được?</p>
          <p className="text-primary btn" onClick={() => resendOtp()}>
            Gửi lại
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConfirmResetPassword
