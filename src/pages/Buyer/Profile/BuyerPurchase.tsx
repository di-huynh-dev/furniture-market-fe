import { IoBagRemoveOutline, IoChatboxEllipsesOutline } from 'react-icons/io5'
import { MdOutlineLocalShipping } from 'react-icons/md'
import { IoMdHelpCircleOutline } from 'react-icons/io'
const BuyerPurchase = () => {
  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Đơn hàng của tôi</div>
            <div className="text-gray-500 text-sm">Quản lý tất cả đơn hàng của tài khoản</div>
          </div>
        </div>
      </div>
      <div className="my-2">
        <div role="tablist" className="tabs tabs-lifted">
          <div className="flex">
            <div>
              <a role="tab" className="tab tab-active [--tab-bg:primary] [--tab-border-color:primary] text-primary">
                Tất cả (129)
              </a>
              <a role="tab" className="tab indicator">
                Chờ thanh toán <span className="indicator-item badge">18</span>
              </a>
              <a role="tab" className="tab indicator">
                Chờ vận chuyển <span className="indicator-item badge">8</span>
              </a>
            </div>
            <div>
              <a role="tab" className="tab indicator">
                Đang giao <span className="indicator-item badge">118</span>
              </a>
              <a role="tab" className="tab indicator">
                Đã nhận <span className="indicator-item badge">22</span>
              </a>
              <a role="tab" className="tab indicator">
                Hoàn thành <span className="indicator-item badge">18</span>
              </a>
              <a role="tab" className="tab indicator">
                Đã hủy <span className="indicator-item badge">8</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full my-4">
          {/* sp1 */}
          <div className="grid card mb-10 lg:text-base text-sm">
            <div className="grid grid-cols-2">
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm text-white">
                  Onna shop <IoBagRemoveOutline />
                </button>
                <button className="btn btn-sm btn-ghost">
                  Chat
                  <IoChatboxEllipsesOutline />
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <div className="flex gap-1 text-green-600 items-center">Hoàn thành</div>
                <div className="tooltip items-center flex" data-tip="Cập nhật mới nhất: 11:12:11 21.11.2022">
                  <IoMdHelpCircleOutline />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="card bg-base-100 shadow-xl">
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="flex gap-2 items-center">
                      <span>Thành tiền:</span>
                      <span className="text-primary text-2xl">2300000đ</span>
                    </div> */}
                {/* <div className="card-actions justify-end">
                      <button className="btn btn-outline">Xem chi tiết đơn</button>
                      <button className="btn btn-outline ">Xem đánh giá</button>
                      <button className="btn btn-primary text-white">Mua lại</button>
                    </div> */}
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end my-2 ">
                <button className="btn btn-outline">Xem chi tiết đơn</button>
                <button className="btn btn-outline ">Xem đánh giá</button>
                <button className="btn btn-primary text-white">Mua lại</button>
              </div>
            </div>
          </div>
          {/* SP 2 */}
          <div className="grid card mb-10 lg:text-base text-sm">
            <div className="grid grid-cols-2">
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm text-white">
                  Onna shop <IoBagRemoveOutline />
                </button>
                <button className="btn btn-sm btn-ghost">
                  Chat
                  <IoChatboxEllipsesOutline />
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <div className="flex gap-1 text-error items-center">Đã hủy</div>
                <div className="tooltip flex items-center" data-tip="Cập nhật mới nhất: 11:12:11 21.11.2022">
                  <IoMdHelpCircleOutline />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="card bg-base-100 shadow-xl">
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end my-2">
                <button className="btn btn-outline ">Xem chi tiết hủy</button>
                <button className="btn btn-primary text-white">Mua lại</button>
              </div>
            </div>
          </div>

          {/* SP 3 */}
          <div className="grid card mb-10 lg:text-base text-sm">
            <div className="grid grid-cols-2">
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm text-white">
                  Onna shop <IoBagRemoveOutline />
                </button>
                <button className="btn btn-sm btn-ghost">
                  Chat
                  <IoChatboxEllipsesOutline />
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  Đã giao
                  <MdOutlineLocalShipping />
                </div>
                <div className="tooltip flex items-center" data-tip="Cập nhật mới nhất: 11:12:11 21.11.2022">
                  <IoMdHelpCircleOutline />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="card bg-base-100 shadow-xl">
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex items-center justify-center">
                    <figure>
                      <img
                        src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        alt="Movie"
                        className="h-20 w-20"
                      />
                    </figure>
                  </div>
                  <div className="col-span-4">
                    <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                    <div className="text-sm text-gray-500">
                      <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                      <p>Size: D2000 - R1000 - C750 mm</p>
                      <div className="flex justify-between">
                        <p>Số lượng: 2</p>
                        <div className="flex gap-2">
                          <span className="text-primary">2300000</span>
                          <span className="line-through text-gray-400">2300000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions justify-end my-2">
                <button className="btn btn-outline ">Xem chi tiết đơn</button>
                <button className="btn btn-primary text-white">Mua lại</button>
              </div>
            </div>
          </div>
        </div>
        <div className="join">
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" checked />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" />
        </div>
      </div>
    </div>
  )
}

export default BuyerPurchase
