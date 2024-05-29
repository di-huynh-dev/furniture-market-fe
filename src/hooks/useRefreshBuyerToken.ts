import commonApi from '@/api/commonApi'
import { addAuth, removeAuth } from '@/redux/reducers/authSlice'
import { store } from '@/redux/store'

const useRefreshBuyerToken = () => {
  const refresh = async () => {
    try {
      const rfToken = store.getState().auth.authData.refreshToken
      const resp = await commonApi.refreshToken(rfToken)

      if (resp.status === 200) {
        // localStorage.setItem('accessTokenBuyer', resp.data.data.accessToken)
        store.dispatch(addAuth(resp.data.data))
        return resp.data.data.accessToken
      } else {
        store.dispatch(removeAuth())
      }
    } catch (error) {
      store.dispatch(removeAuth())
      await commonApi.logout()
    }
  }
  return refresh
}

export default useRefreshBuyerToken
