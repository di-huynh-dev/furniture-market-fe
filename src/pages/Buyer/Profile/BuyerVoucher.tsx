const BuyerVoucher = () => {
  return (
    <div className="mx-4 my-2">
      <div className="pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Voucher của tôi</div>
            <div className="text-gray-500 text-sm">Tổng hợp mã giảm giá của shop dành cho bạn</div>
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-lifted">
        <a role="tab" className="tab tab-active [--tab-bg:primary] [--tab-border-color:primary] text-primary">
          Tất cả (129)
        </a>
        <a role="tab" className="tab  ">
          Đã lưu (12)
        </a>
        <a role="tab" className="tab">
          Đã sử dụng (2)
        </a>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 my-4">
        <div className="card card-side bg-base-100 shadow-lg">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="h-40 w-40"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-base">Giảm 10% Giảm tối đa ₫200k Đơn Tối Thiểu ₫350k</h2>
            <p className="text-sm text-gray-500">Có hiệu lực từ: 26.03.2024</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary text-white">Sử dụng</button>
            </div>
          </div>
        </div>
        <div className="card card-side bg-base-100 shadow-lg">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="h-40 w-40"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-base">Giảm 10% Giảm tối đa ₫200k Đơn Tối Thiểu ₫350k</h2>
            <p className="text-sm text-gray-500">Có hiệu lực từ: 26.03.2024</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary text-white">Sử dụng</button>
            </div>
          </div>
        </div>
        <div className="card card-side bg-base-100 shadow-lg">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="h-40 w-40"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-base">Giảm 10% Giảm tối đa ₫200k Đơn Tối Thiểu ₫350k</h2>
            <p className="text-sm text-gray-500">Có hiệu lực từ: 26.03.2024</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary text-white">Sử dụng</button>
            </div>
          </div>
        </div>
        <div className="card card-side bg-base-100 shadow-lg">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="h-40 w-40"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-base">Giảm 10% Giảm tối đa ₫200k Đơn Tối Thiểu ₫350k</h2>
            <p className="text-sm text-gray-500">Có hiệu lực từ: 26.03.2024</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary text-white">Sử dụng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerVoucher
