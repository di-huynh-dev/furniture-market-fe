import commonApi from '@/api/commonApi'
import { addAuth, removeAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { store } from '@/redux/store'

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const resp = await commonApi.refreshToken()
      if (resp.status === 200) {
        // localStorage.setItem('accessToken', resp.data.data.accessToken)
        store.dispatch(addAuth(resp.data.data))
        return resp.data.data.accessToken
      } else {
        store.dispatch(removeAuth())
        await commonApi.logout()
      }
    } catch (error) {
      store.dispatch(removeAuth())
    }
  }
  return refresh
}

export default useRefreshToken
