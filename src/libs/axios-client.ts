import { addAuth, selectAuth } from '@/redux/reducers/authSlice'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import authApi from '@/api/buyer/buyerAuthApi'
import { useDispatch } from 'react-redux'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosPrivate.interceptors.response.use(
  async (config) => {
    const dispatch = useDispatch()
    const user = useSelector(selectAuth)

    const currentDate = new Date().getTime() / 1000
    const decodedToken = jwtDecode(user?.authData?.accessToken)

    if (decodedToken?.exp && decodedToken.exp < currentDate) {
      const resp = await authApi.refreshToken()
      if (resp.status === 200) {
        const refreshUser = {
          ...user,
          authData: {
            ...user.authData,
            accessToken: resp.data.data.accessToken,
          },
        }
        dispatch(addAuth(refreshUser.authData))
        config.headers['Authorization'] = `Bearer ${refreshUser.authData.accessToken}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosClient
