import axiosClient, { axiosPrivate } from '@/libs/axios-client'
import { LoginApiType } from '@/types/user.type'
import { ApiResponse, LoginData } from '@/types/api.type'

const commonApi = {
  login(data: LoginApiType) {
    return axiosPrivate.post<ApiResponse<LoginData>>('/auth/login', data, { withCredentials: true })
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
