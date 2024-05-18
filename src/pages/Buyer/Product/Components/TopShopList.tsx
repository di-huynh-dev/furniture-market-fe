import Slider from 'react-slick'
import { IoBagCheck } from 'react-icons/io5'
const TopShopList = () => {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
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
  return (
    <>
      <div className="my-4 bg-white p-4">
        <div className="flex gap-2">
          <IoBagCheck size={20} className="text-green-500" />
          <p>Shop nổi bật</p>
        </div>
        <Slider {...settings}>
          <div>
            <img
              src={
                'https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg'
              }
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>

          <div>
            <img
              src={
                'https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg'
              }
              className="w-full h-40 object-cover"
            />
          </div>
          <div>
            <img
              src={
                'https://vending-cdn.kootoro.com/torov-cms/upload/image/1669358914523-kh%C3%A1i%20ni%E1%BB%87m%20qu%E1%BA%A3ng%20c%C3%A1o%20banner%20tr%C3%AAn%20website.jpg'
              }
              className="w-full h-40 object-cover"
            />
          </div>
        </Slider>
      </div>
    </>
  )
}

export default TopShopList
