import Slider from 'react-slick'
import { IoBagCheck } from 'react-icons/io5'
import NextArrow from '@/components/ArrowButton/NextArrow'
import PrevArrow from '@/components/ArrowButton/PrevArrow'
import axiosClient from '@/libs/axios-client'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { LoadingComponent } from '@/components'
import { useNavigate } from 'react-router-dom'
import { ProductDetailType } from '@/types/product.type'
import BuyerProductCard from './BuyerProductCard'

type ShopType = {
  id: string
  avgRating: number
  logo: string
  soldAmount: number
  name: string
}

const TopShopList = () => {
  const navigate = useNavigate()

  const { data: topShopList, isLoading } = useQuery<ShopType[]>({
    queryKey: [Buyer_QueryKeys.POPULAR_SHOPS],
    queryFn: async () => {
      const res = await axiosClient.get('/store/marketing')
      return res.data.data
    },
  })

  const fetchProducts = async (shopId: string) => {
    const res = await axiosClient.get(`/product/search-filter?store.equals=id,${shopId}&sold.min=1000`)
    return res.data.data.content
  }

  const productQueries = useQueries({
    queries: (topShopList || []).map((shop: ShopType) => ({
      queryKey: [Buyer_QueryKeys.TOP_OF_SHOP, shop.id],
      queryFn: () => fetchProducts(shop.id),
      enabled: !!topShopList,
    })),
  })

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: false,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  if (isLoading || productQueries.some((query) => query.isLoading)) {
    return <LoadingComponent />
  }

  return (
    <div className="my-4 bg-white p-4">
      <div className="flex gap-2">
        <IoBagCheck size={20} className="text-green-500" />
        <p>Shop nổi bật</p>
      </div>
      <Slider {...settings}>
        {topShopList?.map((shop: ShopType, index: number) => {
          const products = productQueries[index].data as ProductDetailType[] | undefined
          return (
            <>
              <div key={shop.id} className="flex">
                <div className="p-4 w-1/4 flex-shrink-0">
                  <img src={shop.logo} className="w-full h-64 object-cover rounded-lg" alt={shop.name} />
                  <div className="mt-4 text-center">
                    <p className="text-yellow-500 text-2xl">★ {parseFloat(shop.avgRating.toFixed(1))}</p>
                    <p>
                      Đã bán: <span className="font-bold text-error text-lg">{shop.soldAmount} </span>
                      sản phẩm
                    </p>
                    <button
                      onClick={() => navigate(`/shop/${shop.id}`)}
                      className="mt-2 btn btn-outline hover:bg-white hover:text-primary capitalize text-primary w-full"
                    >
                      Xem Cửa hàng
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 w-3/4">
                  {products?.slice(0, 3).map((product: ProductDetailType) => (
                    <BuyerProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            </>
          )
        })}
      </Slider>
    </div>
  )
}

export default TopShopList
