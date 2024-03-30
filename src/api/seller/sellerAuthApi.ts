import axiosClient from '@/libs/axios-client'
import { RegisterSellerApiType } from '@/types/user.type'

const sellerAuthApi = {
  register(data: RegisterSellerApiType) {
    return axiosClient.post('/auth/register-seller', data)
  },
}

export default sellerAuthApi
