import axiosClient from '@/libs/axios-client'
import { ApiResponse, RegisterData } from '@/types/api.type'
import { RegisterApiType } from '@/types/user.type'

const authApi = {
  register(data: RegisterApiType) {
    return axiosClient.post<ApiResponse<RegisterData>>('/auth/register-buyer', data)
  },

  sendOtp(email: string, type: string) {
    return axiosClient.post(
      '/otp',
      { email, type },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
  },
  confirmEmail(email: string, otpCode: string) {
    return axiosClient.patch<ApiResponse<RegisterData>>(
      '/auth/email-confirmation',
      { email, otpCode },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
  },
  confirmResetPassword(email: string, otpCode: string) {
    return axiosClient.patch<ApiResponse<RegisterData>>(
      '/auth/restore-password',
      { email, otpCode },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
  },
}

export default authApi
