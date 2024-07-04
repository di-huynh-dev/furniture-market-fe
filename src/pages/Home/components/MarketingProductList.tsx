/* eslint-disable @typescript-eslint/no-explicit-any */
import Slider from 'react-slick'
import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'
import NextArrow from '@/components/ArrowButton/NextArrow'
import PrevArrow from '@/components/ArrowButton/PrevArrow'

const MarketingProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.MARKETING_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/marketing?currentPage=0&pageSize=12`)
      return resp.data.data.content
    },
  })

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  }

  if (isLoading) return <LoadingComponent />

  return (
    <div>
      {products.lenght > 0 ? (
        <Slider {...settings}>
          {products?.map((product: ProductDetailType) => (
            <div key={product.id} className="px-1 py-6">
              <BuyerProductCard {...product} />
            </div>
          ))}
        </Slider>
      ) : (
        <p>Danh sách sản phẩm trống!</p>
      )}
    </div>
  )
}

export default MarketingProductList
