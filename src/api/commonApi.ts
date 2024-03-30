import axiosClient from '@/libs/axios-client'
import { LoginApiType } from '@/types/user.type'
import { ApiResponse, LoginData } from '@/types/api.type'

const commonApi = {
  login(data: LoginApiType) {
    return axiosClient.post<ApiResponse<LoginData>>('/auth/login', data)
  },
}

export default commonApi
