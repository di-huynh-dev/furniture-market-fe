/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInput, LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
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
import { useState } from 'react'
import useLocation from '@/hooks/useLocation'
import axiosClient from '@/libs/axios-client'

type FormData = {
  shopName: string
  ownerName: string
  address: string
  logo?: FileList | string | null
  topBanner?: FileList | string | null
  infoBanner?: FileList | string | null
  description: string
}

interface Location {
  id: string
  name: string
}

const SettingShop = () => {
  const axiosPrivate = useAxiosPrivate()
  const dispatch = useDispatch()
  const { previewImages: logoImage, handleFileChange: handleLogoFileChange } = useImagePreview()
  const { previewImages: topBannerImage, handleFileChange: handleTopBannerFileChange } = useImagePreview()
  const { previewImages: infoBanner, handleFileChange: handleInfoBanner } = useImagePreview()
  const info = useSelector(selectSellerShop)
  console.log(info)

  const [isPending, setIsPending] = useState(false)
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('')
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('')
  const [selectedCommuneName, setSelectedCommuneName] = useState<string>('')
  const { districtData, communeData } = useLocation(selectedProvinceId, selectedDistrictId)

  const handleProvinceChange = (provinceId: string, provinceName: string) => {
    setSelectedProvinceId(provinceId)
    setSelectedDistrictId('')
    setSelectedProvinceName(provinceName)
  }

  const handleDistrictChange = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId)
    setSelectedDistrictName(districtName)
  }

  const closeModal = () => {
    const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
    dialog.close()
  }

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const resp = await axiosClient.get('/address/province-city')
      return resp.data.data
    },
  })

  const { isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.SHOP_INFO],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/store')
      dispatch(addShopInfo(resp.data.data))
      return resp
    },
  })

  const updateShopInfo = async (data: FormData) => {
    setIsPending(true)

    const formData = new FormData()
    formData.append('shopName', data.shopName)
    formData.append('ownerName', data.ownerName)
    formData.append(
      'address',
      `${data.address}, ${selectedCommuneName}, ${selectedDistrictName}, ${selectedProvinceName}`,
    )

    if (data.logo instanceof FileList) {
      if (data.logo.length > 0) {
        formData.append('logo', data.logo[0])
      }
    } else {
      toast.error('Vui lòng chọn một hình ảnh cho logo')
      return
    }

    if (data.topBanner instanceof FileList) {
      if (data.topBanner.length > 0) {
        formData.append('topBanner', data.topBanner[0])
      }
    }

    if (data.infoBanner instanceof FileList) {
      if (data.infoBanner.length > 0) {
        formData.append('infoBanner', data.infoBanner[0])
      }
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
        setIsPending(false)
        closeModal()
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
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
      <dialog className="modal" id="my_modal_8">
        <div className="modal-box  max-w-3xl">
          <h3 className="font-bold text-lg">Cập nhật thông tin shop</h3>
          <form onSubmit={handleSubmit(updateShopInfo)} encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-2">
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
            </div>
            <label className="label" htmlFor="logo">
              <span className="label-text capitalize text-sm">Logo shop(*)</span>
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="input input-bordered text-sm"
              {...register('logo')}
              onChange={handleLogoFileChange}
            />
            {errors.logo?.message && <p className="text-red-500 text-sm">{errors.logo.message}</p>}
            {logoImage &&
              logoImage.map((image, index) => (
                <div key={`back-${index}`} className="mt-2">
                  <img src={image} alt={`Back Preview ${index}`} className="w-60 h-60" />
                </div>
              ))}

            <label className="label" htmlFor="topBanner">
              <span
                className="label-text capitalize text-sm tooltip tooltip-right"
                data-tip="Chiều ngang: 1200px; Chiều dọc: 200px"
              >
                Ảnh bìa shop(*)
              </span>
            </label>
            <input
              id="topBanner"
              type="file"
              accept="image/*"
              className="input input-bordered text-sm"
              {...register('topBanner')}
              onChange={handleTopBannerFileChange}
            />
            {errors.topBanner?.message && <p className="text-red-500 text-sm">{errors.topBanner.message}</p>}
            {topBannerImage &&
              topBannerImage.map((image, index) => (
                <div key={`back-${index}`} className="mt-2">
                  <img src={image} alt={`Back Preview ${index}`} />
                </div>
              ))}

            <label className="label" htmlFor="infoBanner">
              <span className="label-text capitalize text-sm ">Banner thông tin shop(*)</span>
            </label>
            <input
              id="infoBanner"
              type="file"
              accept="image/*"
              className="input input-bordered text-sm"
              {...register('infoBanner')}
              onChange={handleInfoBanner}
            />
            {errors.infoBanner?.message && <p className="text-red-500 text-sm">{errors.infoBanner.message}</p>}
            {infoBanner &&
              infoBanner.map((image, index) => (
                <div key={`back-${index}`} className="mt-2">
                  <img src={image} alt={`Back Preview ${index}`} />
                </div>
              ))}

            <div className="my-2 space-y-2">
              <p>Chọn địa chỉ</p>
              <div className="grid grid-cols-3 gap-2">
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={selectedProvinceId}
                  onChange={(e) => handleProvinceChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
                >
                  <option value="">Chọn tỉnh</option>
                  {provinces.map((province: Location) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
                >
                  <option disabled selected>
                    Chọn quận, huyện
                  </option>
                  {districtData &&
                    districtData.map((district: Location) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                </select>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={selectedCommuneName}
                  onChange={(e) => (
                    e.target.value, setSelectedCommuneName(e.target.options[e.target.selectedIndex].text)
                  )}
                >
                  <option disabled selected>
                    Chọn xã, phường
                  </option>
                  {communeData &&
                    communeData.map((commune: Location) => (
                      <option key={commune.id} value={commune.name}>
                        {commune.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <FormInput
              prop="address"
              type="text"
              label="Địa chỉ cụ thể(*)"
              register={register}
              placeholder="Số nhà 34/2, đường Nguyễn Thái Học"
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
                {isPending ? 'Đang xử lý' : 'Lưu'}
              </button>
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
                  dialog.close()
                }}
                className="btn"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body ">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin shop</span>
            <button
              onClick={() => {
                const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn btn-outline btn-primary"
            >
              Cập nhật thông tin
            </button>
          </div>
          {info.shopData.shopInfo.address &&
          info.shopData.shopInfo.ownerName &&
          info.shopData.shopInfo.shopName &&
          info.shopData.shopInfo.description ? (
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
                <img
                  src={info?.shopData.shopInfo.logo}
                  alt="Logo shop"
                  className="rounded-full w-40 h-40 object-cover"
                />
              </div>
            </div>
          ) : (
            <p className="text-error">Thông tin của shop chưa đầy đủ. Vui lòng cập nhật!</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default SettingShop
