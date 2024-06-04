import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { CategoryType } from '@/types/category.type'
import { useQuery } from '@tanstack/react-query'
import Slider from 'react-slick'

const SystemCategoryList = ({ setSelectedCategory }: { setSelectedCategory: (category: string) => void }) => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'linear',
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
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
