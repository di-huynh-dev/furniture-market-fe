import useRefreshToken from '@/hooks/useRefreshToken'
import axiosClient from './axios-client'
import { useEffect } from 'react'
import { store } from '@/redux/store'
import { jwtDecode } from 'jwt-decode'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  useEffect(() => {
    const requestIntercept = axiosClient.interceptors.request.use(
      async (config) => {
        const newConfig = { ...config }

        const token = store.getState().sellerAuth.authData.accessToken
        const currentDate = new Date().getTime() / 1000
        const decodedToken = jwtDecode(token)

        if (decodedToken?.exp && decodedToken.exp < currentDate) {
          await refresh()
          newConfig.headers['Authorization'] = `Bearer ${token}`
        } else {
          newConfig.headers['Authorization'] = `Bearer ${token}`
        }

        return newConfig
      },
      (error) => Promise.reject(error),
    )
    return () => {
      axiosClient.interceptors.request.eject(requestIntercept)
    }
  }, [refresh])

  return axiosClient
}

export default useAxiosPrivate
