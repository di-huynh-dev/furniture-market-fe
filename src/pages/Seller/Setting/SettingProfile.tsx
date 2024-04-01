import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'

const SettingProfile = () => {
  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    const getProfile = async () => {
      const response = await axiosPrivate.get('/user')
      console.log(response.data)
    }
    getProfile()
  }, [])

  return (
    <div>
      <button>xxx</button>
    </div>
  )
}

export default SettingProfile
