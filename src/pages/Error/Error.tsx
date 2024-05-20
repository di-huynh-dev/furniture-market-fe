import error from '@/assets/images/404-computer.svg'

const Error = () => {
  return (
    <section className="bg-white">
      <div className="px-4 mx-auto max-w-screen-xl lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <img src={error} alt="Lỗi 404" className="mx-auto" />
          <h1 className="mb-4 text-5xl tracking-tight font-extrabold lg:text-6xl text-primary-600">404</h1>
          <p className="mb-4 text-xl tracking-tight font-bold text-gray-900 md:text-3xl">Something's missing.</p>
          <p className="mb-4 text-lg font-light text-gray-500 ">
            Xin lỗi, chúng tôi không thể tìm thấy trang yêu cầu. Bạn sẽ tìm thấy rất nhiều điều để khám phá trên trang
            chủ.
          </p>
          <a href="/" className="inline-flex btn bg-primary-600 hover:bg-primary-800 ">
            Về trang chủ
          </a>
        </div>
      </div>
    </section>
  )
}

export default Error
