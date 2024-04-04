import axiosClient from '@/libs/axios-client'
import { RegisterSellerApiType } from '@/types/user.type'

const infoApi = {
  register(data: RegisterSellerApiType) {
    return axiosClient.post('/auth/register-seller', data)
  },
}

export default infoApi
