import { QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { useQuery } from '@tanstack/react-query'

const fetchDistricts = async (provinceId: string) => {
  const response = await axiosClient.get(`/address/district?provinceId=${provinceId}`)
  return response.data.data
}

const fetchCommunes = async (districtId: string) => {
  const response = await axiosClient.get(`/address/commune-ward-town?districtId=${districtId}`)
  return response.data.data
}

const useLocation = (provinceId: string, districtId: string) => {
  const {
    data: districtData,
    isLoading: isDistrictLoading,
    error: districtError,
    refetch: refetchDistrict,
  } = useQuery({
    queryKey: [QueryKeys.DISTRICTS, provinceId],
    queryFn: () => fetchDistricts(provinceId),
    enabled: !!provinceId,
  })

  const {
    data: communeData,
    isLoading: isCommuneLoading,
    error: communeError,
    refetch: refetchCommune,
  } = useQuery({
    queryKey: [QueryKeys.COMMUNES, districtId],
    queryFn: () => fetchCommunes(districtId),
    enabled: !!districtId,
  })

  return {
    districtData,
    districtError,
    isDistrictLoading,
    communeData,
    communeError,
    isCommuneLoading,
    refetchDistrict,
    refetchCommune,
  }
}
export default useLocation
