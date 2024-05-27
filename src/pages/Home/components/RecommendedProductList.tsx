import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'

const RecommendedProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.RECOMMENDED_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/recommend?isExplicit=false&currentPage=0&pageSize=12`)
      return resp.data.data
    },
  })

  if (isLoading) return <LoadingComponent />

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-x-2 gap-y-8">
      {products.map((product: ProductDetailType) => (
        <BuyerProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

export default RecommendedProductList
