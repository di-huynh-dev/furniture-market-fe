import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'

const MarketingProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.MARKETING_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/marketing`)
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

export default MarketingProductList
