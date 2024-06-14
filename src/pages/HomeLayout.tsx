import banner1 from '@/assets/sliders/banner-1.jpg'
import banner2 from '@/assets/sliders/banner-2.jpg'
import banner3 from '@/assets/sliders/banner-3.jpg'
import banner4 from '@/assets/sliders/banner-4.jpg'
import Slider from 'react-slick'
import banner from '@/assets/images/purpose.jpg'
import product1 from '@/assets/images/product/banner1.jpg'
import product2 from '@/assets/images/product/banner2.jpg'
import product3 from '@/assets/images/product/banner3.jpg'
import product4 from '@/assets/images/product/banner4.jpg'
import product5 from '@/assets/images/product/banner5.jpg'
import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import FormCollect from '@/components/FormData/FormCollect'
import RecommendedProductList from './Home/components/RecommendedProductList'
import MarketingProductList from './Home/components/MarketingProductList'
import BestSellerProductList from './Home/components/BestSellerProductList'
import WhishlistProductList from './Home/components/WhishlistProductList'

const HomeLayout = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const settings = {
    infinite: true,
    slidesToShow: 1,
    fade: true,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3500,
  }

  return (
    <main>
      <div className="slider-container mx-auto">
        <Slider {...settings}>
          <div className="relative">
            <img src={banner1} />
            <h1 className="text-white text-center uppercase lg:text-5xl md:text-3xl text-lg absolute lg:top-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Chào mừng bạn đến với Fnest! <br />
              <p className="lg:text-lg text-sm">
                Khám Phá Sự Sang Trọng, Tận Hưởng Sự Tiện Lợi - Fnest Chọn Lọc Cho Cuộc Sống Hiện Đại
              </p>
            </h1>
          </div>
          <div className="relative">
            <img src={banner4} />
            <h1 className="text-white uppercase font-mono text-center lg:text-5xl md:text-3xl text-lg  absolute  lg:top-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Tinh Tế Trong Mỗi Chi Tiết Fnest Chắp Cánh Cho Ngôi Nhà Của Bạn <br />
              <p className="lg:text-lg text-sm">Chọn Fnest, Chọn Sự Tiện Lợi Và Chất Lượng Đích Thực</p>
            </h1>
          </div>
          <div className="relative">
            <img src={banner2} />
            <h1 className="text-gray-500 uppercase font-mono text-center lg:text-5xl md:text-3xl text-lg  absolute  lg:top-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Tạo Nên Nét Độc Đáo, Tinh Tế Cho Ngôi Nhà - Fnest Hiểu Ý Tưởng Của Bạn
            </h1>
          </div>
          <div className="relative">
            <button className="btn md:btn-lg btn-outline  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Mua sắm ngay
            </button>
            <img src={banner3} />
          </div>
        </Slider>
      </div>

      <div className="align-element">
        {/* Purpose */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4 ">Mục tiêu</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <div className="container bg-white p-4 shadow-xl md:p-10  lg:max-w-screen-xl lg:rounded-3xl lg:p-14">
          <div className="flex flex-col-reverse justify-center md:flex-row">
            <div className="relative h-[372px] w-full md:w-1/2 lg:h-[504px]">
              <div className="overflow-hidden rounded-3xl w-full h-full transition-transform duration-300 transform hover:scale-105">
                <img src={banner} alt="hoa" className="object-fit w-full h-full" />
              </div>
            </div>
            <div className="flex w-full flex-col md:w-1/2 justify-center">
              <h2 className="py-2 bg-gradient-to-b from-pink-600 to-blue-500 bg-clip-text text-center text-2xl font-extrabold leading-normal text-transparent md:my-5 lg:my-7 lg:text-5xl">
                Nội thất đẹp, cuộc sống hoàn hảo
              </h2>
              <p className="mb-8 text-slate-700 md:mb-0 md:pl-5 text-justify lg:text-lg text-base">
                Hãy khám phá không gian sống mới, hãy tạo nên câu chuyện riêng của bạn với những chiếc nội thất tinh tế
                từ chúng tôi. Chúng tôi tin rằng, mỗi ngôi nhà đều là một tác phẩm nghệ thuật, và chúng tôi là đối tác
                lý tưởng để bạn bắt đầu hành trình sáng tạo của mình. Chào mừng bạn đến với thế giới đẳng cấp của nội
                thất, nơi mà phong cách gặp gỡ sự thoải mái.
              </p>
            </div>
          </div>
        </div>

        {/* Collections */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4">Bộ sưu tập</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <div className="container relative mx-auto flex flex-col rounded-3xl my-10 lg:max-w-screen-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-0 w-full overflow-hidden rounded-3xl pb-[100%] shadow-lg">
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity ease-linear hover:opacity-100">
                  <span className="text-center font-bold text-white xl:text-2xl">Mây</span>
                </div>
                <img src={product2} alt="Ảnh bộ sưu tập" className="object-cover object-top hover:-m-10" />
              </div>
              <div className="relative h-0 w-full overflow-hidden rounded-3xl pb-[100%] shadow-lg">
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity ease-linear hover:opacity-100">
                  <span className="text-center font-bold text-white xl:text-2xl">Coastal</span>
                </div>
                <img src={product3} alt="Ảnh bộ sưu tập" className="object-cover object-top" />
              </div>
              <div className="relative h-0 w-full overflow-hidden rounded-3xl pb-[100%] shadow-lg">
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity ease-linear hover:opacity-100">
                  <span className="text-center font-bold text-white xl:text-2xl">Osaka</span>
                </div>
                <img src={product4} alt="Ảnh bộ sưu tập" className="object-cover object-top" />
              </div>
              <div className="relative h-0 w-full overflow-hidden rounded-3xl pb-[100%] shadow-lg">
                <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity ease-linear hover:opacity-100">
                  <span className="text-center font-bold text-white xl:text-2xl">Elegance</span>
                </div>
                <img src={product5} alt="Ảnh bộ sưu tập" className="object-cover object-top" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-black/40 transition-opacity ease-linear hover:opacity-100">
                <h3 className="mb-4 text-center text-3xl font-extrabold text-white lg:text-5xl">
                  Sản phẩm <br /> đa dạng
                </h3>
                <NavLink to="products" className="font-bold text-white underline lg:text-2xl">
                  Xem tất cả
                </NavLink>
              </div>
              <img src={product1} alt="Ảnh bộ sưu tập" className="object-fill" />
            </div>
          </div>
        </div>

        {/* Products hot */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4 ">Sản phẩm nổi bật</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <MarketingProductList />

        {/* Products whistlist */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4 ">Sản phẩm yêu thích</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <WhishlistProductList />

        {/* Products whistlist */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4 ">Sản phẩm bán chạy</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <BestSellerProductList />

        {/* Products  recommended */}
        <h2 className="lg:text-2xl text-lg font-bold pt-6 pb-4 ">Gợi ý mua sắm</h2>
        <div className="w-[100px] h-[3px] bg-primary"></div>
        <RecommendedProductList />
      </div>

      {/* Form contact */}
      <FormCollect />
    </main>
  )
}

export default HomeLayout
