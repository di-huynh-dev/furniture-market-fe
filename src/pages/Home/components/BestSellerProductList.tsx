import { LoadingComponent } from '@/components'
import NextArrow from '@/components/ArrowButton/NextArrow'
import PrevArrow from '@/components/ArrowButton/PrevArrow'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'
import Slider from 'react-slick'

const BestSellerProductList = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.BESTSELLER_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/most-buying?currentPage=0&pageSize=12`)
      return resp.data.data
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
      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product: ProductDetailType) => (
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

export default BestSellerProductList
