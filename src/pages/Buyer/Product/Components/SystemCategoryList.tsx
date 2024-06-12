import { LoadingComponent } from '@/components'
import NextArrow from '@/components/ArrowButton/NextArrow'
import PrevArrow from '@/components/ArrowButton/PrevArrow'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { CategoryType } from '@/types/category.type'
import { useQuery } from '@tanstack/react-query'
import Slider from 'react-slick'

const SystemCategoryList = ({ setSelectedCategory }: { setSelectedCategory: (category: string) => void }) => {
  const settings = {
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'linear',
  }

  const { data, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.SYSTEM_CATEGORY],
    queryFn: async () => {
      const resp = await axiosClient.get('/category/system')
      return resp.data.data
    },
  })

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="my-4 bg-white p-4">
          <p className="my-2">Danh mục sản phẩm</p>
          <Slider {...settings}>
            {data?.map((category: CategoryType) => (
              <div key={category.id}>
                <div className="flex justify-center">
                  <img
                    onClick={() => setSelectedCategory(category.name)}
                    src={category.image}
                    alt="Hình ảnh thuộng hãng"
                    className="w-16 h-16 rounded-xl object-cover hover:cursor-pointer"
                  />
                </div>
                <p className="text-center">{category.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  )
}

export default SystemCategoryList
