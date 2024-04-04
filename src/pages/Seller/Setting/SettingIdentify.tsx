import { selectSellerShop } from '@/redux/reducers/seller/sellerShopSlice'
import { useSelector } from 'react-redux'

const SettingIdentify = () => {
  const identifierInfo = useSelector(selectSellerShop)

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8"></div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin định danh</span>
            <button className="btn btn-outline btn-primary ">Cập nhật thông tin</button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <p>Hình thức định danh</p>
                <p className="font-semibold italic">Căn cước công dân</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Số căn cước công dân</p>
                <p className="font-semibold italic">{identifierInfo?.shopData.shopInfo.identifier[0]}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Họ và tên</p>
                <p className="font-semibold italic">{identifierInfo?.shopData.shopInfo.identifier[1]}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Hình ảnh CCCD mặt trước</p>
                <img src={identifierInfo?.shopData.shopInfo.identifier[2]} alt="" className="w-60 h-40 object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Hình ảnh CCCD mặt sau</p>
                <img src={identifierInfo?.shopData.shopInfo.identifier[3]} alt="" className="w-60 h-40 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingIdentify
