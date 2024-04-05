import { FormInput, LoadingComponent } from '@/components'
import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addShopInfo, selectSellerShop } from '@/redux/reducers/seller/sellerShopSlice'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import useImagePreview from '@/hooks/useImagePreview'

type FormData = {
  shopName: string
  ownerName: string
  address: string
  logo?: FileList | string | null
  description: string
}

const SettingShop = () => {
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch()
  const { previewImage, handleFileChange } = useImagePreview()
  const info = useSelector(selectSellerShop)

  const { isLoading } = useQuery({
    queryKey: [QueryKeys.SHOP_INFO],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/store')
      dispatch(addShopInfo(resp.data.data))
      return resp
    },
  })

  const updateShopInfo = async (data: FormData) => {
    const formData = new FormData()
    formData.append('shopName', data.shopName)
    formData.append('ownerName', data.ownerName)
    formData.append('address', data.address)
    if (data.logo instanceof FileList) {
      if (data.logo.length > 0) {
        formData.append('logo', data.logo[0])
      }
    } else {
      toast.error('Vui lòng chọn một hình ảnh cho logo.')
      return
    }
    formData.append('description', data.description)

    try {
      const resp = await axiosPrivate.put('/seller/store/info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        dispatch(addShopInfo(resp.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const validationSchema = yup.object({
    shopName: yup.string().required('Không được để trống!'),
    ownerName: yup.string().required('Không được để trống'),
    address: yup.string().required('Không được để trống'),
    description: yup.string().required('Không được để trống'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cập nhật thông tin shop</h3>
          <form onSubmit={handleSubmit(updateShopInfo)} encType="multipart/form-data">
            <FormInput
              prop="shopName"
              type="text"
              label="Tên shop(*)"
              register={register}
              placeholder="Gỗ xưa shop"
              errorMessage={errors.shopName?.message}
            />
            <FormInput
              prop="ownerName"
              type="text"
              label="Tên người đại diện(*)"
              register={register}
              placeholder="Nguyễn Văn A"
              errorMessage={errors.ownerName?.message}
            />
            <label className="label" htmlFor="logo">
              <span className="label-text capitalize text-sm">Hình ảnh</span>
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="input input-bordered text-sm"
              {...register('logo')}
              onChange={handleFileChange}
            />
            {errors.logo?.message && <p className="text-red-500 text-sm">{errors.logo.message}</p>}
            {previewImage && (
              <div className="mt-2">
                <img src={previewImage} alt="Preview" className="w-60 h-60" />
              </div>
            )}
            <FormInput
              prop="address"
              type="text"
              label="Địa chỉ(*)"
              register={register}
              placeholder="Địa chỉ"
              errorMessage={errors.address?.message}
            />
            <FormInput
              prop="description"
              type="text"
              label="Mô tả(*)"
              register={register}
              placeholder="Mô tả shop"
              errorMessage={errors.description?.message}
            />
            <div className="modal-action">
              <button type="submit" className="btn btn-primary text-white">
                Lưu
              </button>
              <a href="#" className="btn">
                Hủy
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body ">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin shop</span>
            <a href="#my_modal_8" className="btn btn-outline btn-primary">
              Cập nhật thông tin
            </a>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                <p>Tên shop</p>
                <p className="font-semibold italic">{info?.shopData.shopInfo.shopName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Tên người sở hữu</p>
                <p className="font-semibold italic">{info?.shopData.shopInfo.ownerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p>Địa chỉ lấy hàng</p>
                <p className="font-semibold italic">{info?.shopData.shopInfo.address}</p>
              </div>
              <div className="">
                <p>Mô tả shop</p>
                <p className="font-semibold italic">{info?.shopData.shopInfo.description}</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img src={info?.shopData.shopInfo.logo} alt="Logo shop" className="rounded-full w-40 h-40 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingShop
