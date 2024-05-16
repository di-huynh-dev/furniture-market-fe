import axiosClient, { axiosPrivateBuyer, axiosPrivateSeller } from '@/libs/axios-client'
import { LoginApiType } from '@/types/user.type'
import { ApiResponse, LoginData } from '@/types/api.type'

const commonApi = {
  loginBuyer(data: LoginApiType) {
    return axiosPrivateBuyer.post<ApiResponse<LoginData>>('/auth/login', data, { withCredentials: true })
  },
  loginSeller(data: LoginApiType) {
    return axiosPrivateSeller.post<ApiResponse<LoginData>>('/auth/login', data, { withCredentials: true })
  },

  getUserProfile() {
    return axiosClient.get('/user')
  },

  refreshToken() {
    return axiosClient.post('/auth/refresh', null, {
      withCredentials: true,
    })
  },
  logout() {
    return axiosClient.post('/auth/logout', null, {
      withCredentials: true,
    })
  },
}

export default commonApi
