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
                'https://marketplace.canva.com/EAE6uxzge6c/1/0/1600w/canva-yellow-and-white-minimalist-big-sale-banner-BjBIq-T_6j4.jpg'
              }
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div>
            <img
              src={
                'https://cdn.printnetwork.com/production/assets/5966561450122033bd4456f8/imageLocker/blog-description/blog/sales_banners.jpg'
              }
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div>
            <img
              src={
                'https://marketplace.canva.com/EAFED0hv9G0/1/0/1600w/canva-blue-pink-modern-special-offer-sale-banner-J5VkNReQ8WA.jpg'
              }
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </Slider>
      </div>
    </>
  )
}

export default TopShopList
