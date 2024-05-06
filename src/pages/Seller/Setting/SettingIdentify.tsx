/* eslint-disable @typescript-eslint/no-explicit-any */
import { addShopInfo, selectSellerShop } from '@/redux/reducers/seller/sellerShopSlice'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useImagePreview from '@/hooks/useImagePreview'
import { FormInput } from '@/components'
import toast from 'react-hot-toast'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'

interface FormData {
  identifierCode: string
  identifierFullName: string
  identifierFrontImg?: FileList | null
  identifierBackImg?: FileList | null
}

const SettingIdentify = () => {
  const axiosPrivate = useAxiosPrivate()
  const identifierInfo = useSelector(selectSellerShop)
  const { previewImages: frontImages, handleFileChange: handleFrontFileChange } = useImagePreview()
  const { previewImages: backImages, handleFileChange: handleBackFileChange } = useImagePreview()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const closeModal = () => {
    const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
    dialog.close()
  }

  const updateIdentifyInfo = async (data: FormData) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('identifierCode', data.identifierCode)
    formData.append('identifierFullName', data.identifierFullName)
    if (data.identifierFrontImg instanceof FileList) {
      if (data.identifierFrontImg.length > 0) {
        formData.append('identifierFrontImg', data.identifierFrontImg[0])
      } else {
        toast.error('Vui lòng chọn một hình ảnh cho logo.')
        return
      }
    }
    if (data.identifierBackImg instanceof FileList) {
      if (data.identifierBackImg.length > 0) {
        formData.append('identifierBackImg', data.identifierBackImg[0])
      }
    } else {
      toast.error('Vui lòng chọn một hình ảnh cho logo.')
      return
    }

    try {
      const resp = await axiosPrivate.put('/seller/store/identifier', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        dispatch(addShopInfo(resp.data.data))
        setIsLoading(false)
        closeModal()
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const validationScheme = yup.object({
    identifierCode: yup
      .string()
      .matches(/^\d{12}$/, 'Mã căn cước công dân phải là 12 số')
      .required('Mã căn cước công dân không được để trống'),
    identifierFullName: yup.string().required('Họ và tên không được để trống'),
    // identifierFrontImg: yup
    //   .mixed()
    //   .test(
    //     'required',
    //     'Hình ảnh căn cước công dân mặt trước không được để trống',
    //     (file) => file instanceof FileList && file.length > 0,
    //   ),
    // identifierBackImg: yup
    //   .mixed()
    //   .test(
    //     'required',
    //     'Hình ảnh căn cước công dân mặt sau không được để trống',
    //     (file) => file instanceof FileList && file.length > 0,
    //   ),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationScheme),
  })

  return (
    <section className="my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cập nhật thông tin shop</h3>
          <form onSubmit={handleSubmit(updateIdentifyInfo)} encType="multipart/form-data">
            <div>
              <FormInput
                prop="identifierCode"
                type="text"
                label="Mã số CCCD(*)"
                register={register}
                placeholder="Gồm 12 chữ số, vd:052201204231"
                errorMessage={errors.identifierCode?.message}
              />
              <FormInput
                prop="identifierFullName"
                type="text"
                label="Họ và tên(*)"
                register={register}
                placeholder="Nguyễn Văn A"
                errorMessage={errors.identifierFullName?.message}
              />
              <label className="label" htmlFor="frontImage">
                <span className="label-text capitalize text-sm">Hình ảnh CCCD mặt trước</span>
              </label>
              <input
                id="frontImage"
                type="file"
                accept="image/*"
                {...register('identifierFrontImg')}
                className="input input-bordered text-sm"
                onChange={handleFrontFileChange}
              />
              {errors.identifierFrontImg?.message && (
                <p className="text-red-500 text-sm">{errors.identifierFrontImg.message}</p>
              )}
              {frontImages &&
                frontImages.map((image, index) => (
                  <div key={`front-${index}`} className="mt-2">
                    <img src={image} alt={`Front Preview ${index}`} className="w-60 h-60" />
                  </div>
                ))}
            </div>
            <div>
              <label className="label" htmlFor="backImage">
                <span className="label-text capitalize text-sm">Hình ảnh CCCD mặt sau</span>
              </label>
              <input
                id="backImage"
                type="file"
                accept="image/*"
                {...register('identifierBackImg')}
                className="input input-bordered text-sm"
                onChange={handleBackFileChange}
              />
              {errors.identifierBackImg?.message && (
                <p className="text-red-500 text-sm">{errors.identifierBackImg.message}</p>
              )}

              {backImages &&
                backImages.map((image, index) => (
                  <div key={`back-${index}`} className="mt-2">
                    <img src={image} alt={`Back Preview ${index}`} className="w-60 h-60" />
                  </div>
                ))}
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary text-white">
                {isLoading ? 'Đang xử lý... ' : 'Lưu'}
              </button>
              <a href="#" className="btn">
                Hủy
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin định danh</span>
            <a href="#my_modal_8" className="btn btn-outline btn-primary">
              Cập nhật thông tin
            </a>
          </div>
          {identifierInfo.shopData.shopInfo.identifier[0] ? (
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
                  <img
                    src={identifierInfo?.shopData.shopInfo.identifier[2]}
                    alt=""
                    className="w-60 h-40 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p>Hình ảnh CCCD mặt sau</p>
                  <img
                    src={identifierInfo?.shopData.shopInfo.identifier[3]}
                    alt=""
                    className="w-60 h-40 object-cover"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-error">Thông tin định danh chưa đầy đủ. Vui lòng cập nhật!</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default SettingIdentify
