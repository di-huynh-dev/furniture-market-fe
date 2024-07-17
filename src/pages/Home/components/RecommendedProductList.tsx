import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { LoginData } from '@/types/user.type'
import { useQuery } from '@tanstack/react-query'

const RecommendedProductList = ({ userLogin }: { userLogin: LoginData }) => {
  const axiosPrivate = useAxiosBuyerPrivate()

  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.RECOMMENDED_PRODUCTS],
    queryFn: async () => {
      if (!userLogin.accessToken) {
        const resp = await axiosClient.get(`/product/recommend?isExplicit=true&currentPage=0&pageSize=16`)
        return resp.data.data
      } else {
        const resp = await axiosPrivate.get(`/product/recommend?isExplicit=false&currentPage=0&pageSize=16`)
        return resp.data.data
      }
    },
  })

  if (isLoading) return <LoadingComponent />

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-x-2 gap-y-8">
      {products?.map((product: ProductDetailType) => (
        <BuyerProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

export default RecommendedProductList
