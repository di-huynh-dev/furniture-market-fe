import { axiosPrivateSeller } from '@/libs/axios-client'
import useRefreshToken from './useRefreshToken'
import { useEffect } from 'react'
import { store } from '@/redux/store'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const user = store.getState().sellerAuth.authData

  useEffect(() => {
    const requestIntercept = axiosPrivateSeller.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${user?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = axiosPrivateSeller.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivateSeller(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosPrivateSeller.interceptors.request.eject(requestIntercept)
      axiosPrivateSeller.interceptors.response.eject(responseIntercept)
    }
  }, [user, refresh])
  return axiosPrivateSeller
}

export default useAxiosPrivate
