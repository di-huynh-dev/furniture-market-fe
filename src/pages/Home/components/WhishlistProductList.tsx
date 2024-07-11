import { LoadingComponent } from '@/components'
import NextArrow from '@/components/ArrowButton/NextArrow'
import PrevArrow from '@/components/ArrowButton/PrevArrow'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { LoginData } from '@/types/user.type'
import { useQuery } from '@tanstack/react-query'
import Slider from 'react-slick'

const WhishlistProductList = ({ userLogin }: { userLogin: LoginData }) => {
  const axiosPrivate = useAxiosBuyerPrivate()

  const { data: products, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.WHISHLIST_PRODUCTS],
    queryFn: async () => {
      if (!userLogin.accessToken) {
        const resp = await axiosClient.get(`/product/most-favourite?currentPage=0&pageSize=32`)
        return resp.data.data.content
      } else {
        const resp = await axiosPrivate.get(`/product/most-favourite?currentPage=0&pageSize=32`)
        return resp.data.data.content
      }
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

export default WhishlistProductList
