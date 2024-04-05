import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addShopInfo, selectSellerShop } from '@/redux/reducers/seller/sellerShopSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FormInput } from '@/components'
import { useDispatch } from 'react-redux'

type FormData = {
  taxType: string
  taxCode: string
}
const SettingVAT = () => {
  const axiosPrivate = useAxiosPrivate()
  const taxInfo = useSelector(selectSellerShop)
  const dispatch = useDispatch()

  const updateTaxInfo = async (data: FormData) => {
    try {
      const resp = await axiosPrivate.put('/seller/store/tax', data)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        dispatch(addShopInfo(resp.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }
  const validationSchema = yup.object({
    taxType: yup.string().required('Vui lòng chọn loại hình thuế!'),
    taxCode: yup
      .string()
      .matches(/^\d{10}$/, 'Mã số thuế phải đủ 10 chữ số')
      .required('Không được để trống'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })
  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cập nhật thông tin shop</h3>
          <form onSubmit={handleSubmit(updateTaxInfo)} encType="multipart/form-data">
            <p className="my-1">Loại thuế</p>
            <select {...register('taxType')} className="select select-bordered w-full max-w-xs">
              <option value="" disabled selected>
                Loại hình thuế?
              </option>
              <option value="Cá nhân">Cá nhân</option>
              <option value="Doanh nghiệp">Doanh nghiệp</option>
            </select>
            {errors.taxType && <p className="text-red-500 text-sm">{errors.taxType.message}</p>}
            <FormInput
              prop="taxCode"
              type="text"
              label="Mã số thuế (MST)(*)"
              register={register}
              placeholder="Mã số thuế được tra ở https://tracuunnt.gdt.gov.vn/tcnnt"
              errorMessage={errors.taxCode?.message}
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
      <div className="modal" role="dialog" id="my_modal_8"></div>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin thuế</span>
            <a href="#my_modal_8" className="btn btn-outline btn-primary">
              Cập nhật thông tin
            </a>
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
