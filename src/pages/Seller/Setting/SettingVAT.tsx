import { selectSellerShop } from '@/redux/reducers/seller/sellerShopSlice'
import { useSelector } from 'react-redux'

const SettingVAT = () => {
  const taxInfo = useSelector(selectSellerShop)
  console.log(taxInfo)

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8"></div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin thuế</span>
            <button className="btn btn-outline btn-primary ">Cập nhật thông tin</button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <p>Loại hình thuế</p>
                <p className="font-semibold italic">{taxInfo?.shopData.shopInfo.tax[0]}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Mã số thuế</p>
                <p className="font-semibold italic">{taxInfo?.shopData.shopInfo.tax[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingVAT
