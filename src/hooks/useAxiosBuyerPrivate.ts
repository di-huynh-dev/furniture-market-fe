import { axiosPrivate } from '@/libs/axios-client'
import { useEffect } from 'react'
import { store } from '@/redux/store'
import useRefreshBuyerToken from './useRefreshBuyerToken'

const useAxiosBuyerPrivate = () => {
  const refresh = useRefreshBuyerToken()
  const user = store.getState().auth.authData

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${user?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [user, refresh])
  return axiosPrivate
}

export default useAxiosBuyerPrivate