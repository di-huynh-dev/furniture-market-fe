import error from '@/assets/images/404.svg'
const ShopError = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <img src={error} alt="Lỗi không tìm thấy trang" className="w-[500px]" />
        <p className="text-xl text-center font-bold">Địa chỉ không hợp lệ</p>
        <p className="text-xl text-center">Không thể tải Shop này. Vui lòng chạm và thử lại!</p>
      </div>
    </div>
  )
}

export default ShopError
