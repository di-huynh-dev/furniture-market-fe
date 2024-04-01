import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { UserType } from '@/types/user.type'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useProfile = (options?: Omit<UseQueryOptions<UserType>, 'queryKey' | 'queryFn'>) => {
  const axiosPrivate = useAxiosPrivate()
  return useQuery<UserType>({
    ...options,
    queryKey: [QueryKeys.USER_PROFILE],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user')
      if (response.status === 200) {
        return response.data.data
      } else {
        throw new Error('Network response was not ok')
      }
    },
  })
}
