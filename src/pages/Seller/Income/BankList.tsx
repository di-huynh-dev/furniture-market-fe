import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components'

type FormData = {
  email: string
  password: string
}
const BankList = () => {
  const [isUpdate, setIsUpdate] = useState(false)

  const onSubmit = () => {}
  const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    password: yup.string().required('Không được để trống'),
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
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <span className="font-bold">Tài khoản ngân hàng</span>
          <div>
            <button
              onClick={() => {
                setIsUpdate(false)
                const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn btn-primary text-white"
            >
              Thêm tài khoản
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{isUpdate ? 'Cập nhật' : 'Thêm'} tài khoản ngân hàng</h3>

                <div className="modal-action">
                  <form method="dialog">
                    <FormInput
                      prop="email"
                      type="text"
                      label="Email(*)"
                      register={register}
                      placeholder="abc123@gmail.com"
                      errorMessage={errors.email?.message}
                    />
                    <div className="flex gap-2">
                      <button
                        className="btn btn-primary text-white"
                        onClick={() => {
                          if (isUpdate) {
                            // updateCategoryMutation.mutate(selectedRow)
                          } else {
                            // addCategoryMutation.mutate()
                          }
                        }}
                      >
                        {isUpdate ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setIsUpdate(false)
                          const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                          dialog.close()
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
            <div className="grid grid-cols-3 mt-10">
              <div className="card w-96 shadow-xl bg-slate-200">
                <div className="card-body">
                  <h2 className="card-title">
                    1048720*******
                    <div className="badge badge-success text-white">Vietinbank</div>
                  </h2>
                  <p>HUYNH TIEN DI</p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline bg-success text-white">Mặc định</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BankList
