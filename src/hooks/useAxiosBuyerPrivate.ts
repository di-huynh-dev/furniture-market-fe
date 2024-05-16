import { axiosPrivateBuyer } from '@/libs/axios-client'
import { useEffect } from 'react'
import { store } from '@/redux/store'
import useRefreshBuyerToken from './useRefreshBuyerToken'

const useAxiosBuyerPrivate = () => {
  const refresh = useRefreshBuyerToken()
  const user = store.getState().auth.authData

  useEffect(() => {
    const requestIntercept = axiosPrivateBuyer.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${user?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = axiosPrivateBuyer.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivateBuyer(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosPrivateBuyer.interceptors.request.eject(requestIntercept)
      axiosPrivateBuyer.interceptors.response.eject(responseIntercept)
    }
  }, [user, refresh])
  return axiosPrivateBuyer
}

export default useAxiosBuyerPrivate
