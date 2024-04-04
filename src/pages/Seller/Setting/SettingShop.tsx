import { LoadingComponent } from '@/components'
import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addShopInfo } from '@/redux/reducers/seller/sellerShopSlice'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

const SettingShop = () => {
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch()

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SHOP_INFO],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/store')
      dispatch(addShopInfo(resp.data.data))
      return resp
    },
  })

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8"></div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body ">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin shop</span>
            <button className="btn btn-outline btn-primary ">Cập nhật thông tin</button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <p>Tên shop</p>
                <p className="font-semibold italic">{data?.data.data.shopName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Tên người sở hữu</p>
                <p className="font-semibold italic">{data?.data.data.ownerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Địa chỉ lấy hàng</p>
                <p className="font-semibold italic">{data?.data.data.address}</p>
              </div>
              <div className="">
                <p>Mô tả shop</p>
                <p className="font-semibold italic">{data?.data.data.description}</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={data?.data.data.logo} alt="Logo shop" className="rounded-full w-40 h-40 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingShop
