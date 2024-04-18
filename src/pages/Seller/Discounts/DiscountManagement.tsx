/* eslint-disable @typescript-eslint/no-explicit-any */
import banner from '@/assets/images/discount.jpg'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { VoucherType } from '@/types/voucher.type'
import { FormInput, LoadingComponent } from '@/components'
import { useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Seller_QueryKeys } from '@/constants/query-keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { ProductDetailType } from '@/types/product.type'
import { formatDate, formatPrice } from '@/utils/helpers'

export type FormData = VoucherType

type ProductItemType = {
  id: string
  name: string
  thumbnail: string
}
interface DataRow {
  id: string
  name: string
  type: string
  code: string
  startDate: string
  endDate: string
  maxDiscount: number
  minValue: number
  totalTimes: number
  buyerLimit: number
  hidden: boolean
  productList: [ProductItemType]
}

const DiscountManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [voucherType, setVoucherType] = useState('')
  const [selectedRow, setSelectedRow] = useState('')
  const [productIds, setProductIds] = useState<string[]>([])
  const [modalType, setModalType] = useState<'create' | 'update' | ''>('')

  const [loading, setLoading] = useState(false)
  const client = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.SHOP_PRODUCTS],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/seller/product')
        if (resp.status === 200) {
          return resp
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  const { data: vouchers, isLoading: isLoadingVouchers } = useQuery({
    queryKey: [Seller_QueryKeys.SHOP_VOUCHER],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/seller/voucher')
        if (resp.status === 200) {
          return resp
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  const deleteVoucherMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.delete(`/seller/voucher/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries({
        queryKey: [Seller_QueryKeys.SHOP_VOUCHER],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const columnsProduct: TableColumn<ProductDetailType>[] = [
    {
      name: 'Mã sản phẩm ',
      selector: (row) => row.id,
    },

    {
      name: 'Tên sản phẩm',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Giá bán',
      selector: (row) => row.salePrice,
      sortable: true,
    },
  ]

  const columns: TableColumn<DataRow>[] = [
    {
      name: 'Voucher ID',
      selector: (row) => row.id,
    },
    {
      name: 'Tên Chương trình',
      selector: (row) => row.name,
    },
    {
      name: 'Loại mã',
      selector: (row) => row.type,
    },
    {
      name: 'Code',
      selector: (row) => row.code,
    },
    {
      name: 'Bắt đầu',
      selector: (row) => formatDate(row.startDate),
    },
    {
      name: 'Kết thúc',
      selector: (row) => formatDate(row.endDate),
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 text-blue-500">
          <button
            onClick={() => {
              setSelectedRow(row.id)
              if (row.type === 'PRODUCT_VOUCHER') {
                setVoucherType('PRODUCT_VOUCHER')
              } else {
                setVoucherType('SHOP_VOUCHER')
              }
              setModalType('update')
              const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
              dialog.showModal()
            }}
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => {
              setSelectedRow(row.id)

              const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
              dialog.showModal()
            }}
          >
            Xóa
          </button>
        </div>
      ),
    },
  ]

  const ExpandedComponent = ({ data }: { data: DataRow }) => {
    return (
      <>
        <div className="text-sm grid grid-cols-4 gap-2">
          <div>
            <p className="font-bold">Mã Voucher</p>
            <p>{data.id}</p>
          </div>
          <div>
            <p className="font-bold">Tên Chương trình</p>
            <p>{data.name}</p>
          </div>
          <div>
            <p className="font-bold">Loại mã</p>
            <p>{data.type}</p>
          </div>
          <div>
            <p className="font-bold">Code</p>
            <p>{data.code}</p>
          </div>
          <div>
            <p className="font-bold">Bắt đầu</p>
            <p>{formatDate(data.startDate)}</p>
          </div>
          <div>
            <p className="font-bold">Kết thúc</p>
            <p>{formatDate(data.endDate)}</p>
          </div>
          <div>
            <p className="font-bold">Giảm tối đa</p>
            <p>{formatPrice(data.maxDiscount)}</p>
          </div>
          <div>
            <p className="font-bold">Giá trị tối thiểu đơn</p>
            <p>{formatPrice(data.minValue)}</p>
          </div>
          <div>
            <p className="font-bold">Số lần sử dụng</p>
            <p>{data.totalTimes}</p>
          </div>
          <div>
            <p className="font-bold">Số lần/tài khoản</p>
            <p>{data.buyerLimit}</p>
          </div>
          <div>
            <p className="font-bold">Trạng thái</p>
            <p>{data.hidden ? 'Ẩn' : 'Hiện'}</p>
          </div>
        </div>
        <div>
          <p className="font-bold">Sản phẩm áp dụng</p>
          {data.productList.map((product) => (
            <div className="grid grid-cols-4 items-center justify-center" key={product.id}>
              <p>{product.name}</p>
              <img src={product.thumbnail} alt="" className="w-14 h-14" />
            </div>
          ))}
        </div>
      </>
    )
  }

  const handleAddOrUpdateVoucher = async (data: FormData) => {
    setLoading(true)
    if (modalType === 'create') {
      try {
        const formData = {
          name: data.name,
          type: data.type,
          code: data.code,
          startDate: data.startDate,
          endDate: data.endDate,
          maxDiscount: data.maxDiscount,
          minValue: data.minValue,
          totalTimes: data.totalTimes,
          buyerLimit: data.buyerLimit,
          productIds: productIds,
        }
        const resp = await axiosPrivate.post('/seller/voucher', formData)
        if (resp.status === 200) {
          const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
          dialog.close()
          client.invalidateQueries({
            queryKey: [Seller_QueryKeys.SHOP_VOUCHER],
          })
          toast.success(resp.data.messages[0])
          setLoading(false)
          reset()
        }
      } catch (error: any) {
        setLoading(false)
        toast.error(error.response.data.messages[0])
      }
    } else {
      try {
        const formData: FormData = {
          productIds: [],
        }
        if (data.name) formData.name = data.name
        if (data.code) formData.code = data.code
        if (data.startDate) formData.startDate = data.startDate
        if (data.endDate) formData.endDate = data.endDate
        if (data.maxDiscount) formData.maxDiscount = data.maxDiscount
        if (data.minValue) formData.minValue = data.minValue
        if (data.totalTimes) formData.totalTimes = data.totalTimes
        if (data.buyerLimit) formData.buyerLimit = data.buyerLimit
        if (productIds.length > 0) formData.productIds = productIds

        const resp = await axiosPrivate.patch('/seller/voucher/' + selectedRow, formData)
        if (resp.status === 200) {
          const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
          dialog.close()
          client.invalidateQueries({
            queryKey: [Seller_QueryKeys.SHOP_VOUCHER],
          })
          toast.success(resp.data.messages[0])
          setLoading(false)
          reset()
        }
      } catch (error: any) {
        setLoading(false)
        toast.error(error.response.data.messages[0])
      }
    }
  }

  const validationSchema =
    modalType === 'create'
      ? yup.object({
          name: yup.string().required('Không được để trống!'),
          type: yup.string().required('Không được để trống!'),
          code: yup.string().required('Không được để trống!'),
          startDate: yup.string().required('Không được để trống!'),
          endDate: yup.string().required('Không được để trống!'),
          maxDiscount: yup.number().moreThan(0, 'Giá phải lớn hơn 0').required('Không được để trống!'),
          minValue: yup.number().moreThan(0, 'Giá phải lớn hơn 0').required('Không được để trống!'),
          buyerLimit: yup.number().moreThan(0, 'Giá phải lớn hơn 0').required('Không được để trống!'),
          totalTimes: yup.number().moreThan(0, 'Giá phải lớn hơn 0').required('Không được để trống!'),
        })
      : yup.object({
          name: yup.string(),
          type: yup.string(),
          code: yup.string(),
          startDate: yup.string(),
          endDate: yup.string(),
        })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })
  1
  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận</h3>
          <p className="py-4">Bạn có chắc chắn muốn xóa Voucher này?</p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={() => deleteVoucherMutation.mutate(selectedRow)}
                >
                  Xác nhận
                </button>
                <button className="btn">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_1" role="dialog" className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg">{modalType === 'create' ? 'Tạo Voucher' : 'Cập nhật Voucher'}</h3>
          {modalType === 'update' && <p className="text-red-500">Lưu ý: Chỉ điền thông tin ở ô cần cập nhật</p>}
          <form onSubmit={handleSubmit(handleAddOrUpdateVoucher)}>
            <div className="flex gap-2">
              <div>
                <p className="m-2">Chọn loại mã giảm</p>
                <select
                  className="select select-bordered w-full max-w-xs"
                  {...register('type')}
                  onChange={(e) => {
                    setVoucherType(e.target.value)
                    if (e.target.value === 'SHOP_VOUCHER') {
                      setProductIds([])
                    }
                  }}
                >
                  <option value="SHOP_VOUCHER">Áp dụng cho toàn Shop</option>
                  <option value="PRODUCT_VOUCHER"> Áp dụng cho sản phẩm</option>
                </select>
              </div>
              {errors?.type?.message && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              {voucherType === 'PRODUCT_VOUCHER' && (
                <>
                  {/* {modalType === 'update' && voucherType === 'PRODUCT_VOUCHER' && ( */}
                  <div className="flex items-end justify-end">
                    <label htmlFor="my_modal_6" className="btn btn-accent text-white">
                      Chọn sản phẩm
                    </label>

                    <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                    <div className="modal" role="dialog">
                      <div className="modal-box max-w-4xl">
                        <h3 className="font-bold text-lg">Danh sách sản phẩm</h3>
                        <div>
                          <DataTable
                            columns={columnsProduct}
                            data={products?.data.data}
                            selectableRows
                            onSelectedRowsChange={(selectedRows) => {
                              const selectedProductIds = selectedRows.selectedRows.map((row) => row.id)
                              setProductIds(selectedProductIds)
                            }}
                            pagination
                            progressPending={isLoading}
                            progressComponent={<LoadingComponent />}
                          />
                        </div>
                        <div className="modal-action">
                          <label htmlFor="my_modal_6" className="btn">
                            Hoàn tất
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormInput
                prop="name"
                type="text"
                label="Tên chương trình giảm giá(*)"
                register={register}
                placeholder="Bàn gỗ cao cấp Italia"
                errorMessage={errors?.name?.message}
              />
              <FormInput
                prop="code"
                type="text"
                label="Mã giảm giá(*)"
                register={register}
                placeholder="Bàn gỗ cao cấp Italia"
                errorMessage={errors?.code?.message}
              />
              <FormInput
                prop="startDate"
                type="date"
                label="Ngày bắt đầu(*)"
                register={register}
                errorMessage={errors.startDate?.message}
              />
              <FormInput
                prop="endDate"
                type="date"
                label="Ngày kết thúc(*)"
                register={register}
                errorMessage={errors.startDate?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                prop="maxDiscount"
                type="number"
                placeholder="Vd: 120000"
                label="Mức giảm - Theo số tiền(*)"
                register={register}
                errorMessage={errors.maxDiscount?.message}
              />
              <FormInput
                prop="minValue"
                type="number"
                placeholder="Vd: 200000"
                label="Giá trị tối thiểu đơn mua(*)"
                register={register}
                errorMessage={errors.minValue?.message}
              />
              <FormInput
                prop="totalTimes"
                type="number"
                placeholder="Vd: 120"
                label="Tổng lượt sử dụng tối đa(*)"
                register={register}
                errorMessage={errors.totalTimes?.message}
              />
              <FormInput
                prop="buyerLimit"
                type="number"
                placeholder="Vd: 2"
                label="Lượt sử dụng tối đa/Người(*)"
                register={register}
                errorMessage={errors.buyerLimit?.message}
              />
            </div>
            <div className="flex items-center justify-end gap-2 my-4">
              <button className="btn btn-primary text-white" type="submit">
                {loading ? 'Đang xử lý...' : 'Gửi'}
              </button>
              <div
                className="btn"
                onClick={() => {
                  const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                  dialog.close()
                }}
              >
                Hủy
              </div>
            </div>
          </form>
        </div>
      </dialog>

      <div className="card shadow-lg bg-white">
        <div className="grid grid-cols-3 gap-2 p-10 items-center">
          <div className="col-span-2">
            <p className="font-bold text-2xl">Tạo Voucher ngay để tăng đơn hàng cho Shop của bạn!</p>
            <p>Cơ hội tăng đến 43% đơn hàng và 28% doanh thu khi tạo Voucher ưu đãi cho Khách hàng</p>
            <div className="flex gap-2 justify-center items-center my-10">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Voucher cho toàn shop</h2>
                  <p>Voucher áp dụng cho tất cả các sản phẩm trong shop của bạn</p>
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-primary text-white"
                      onClick={() => {
                        setModalType('create')
                        const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                        dialog.showModal()
                      }}
                    >
                      Tạo ngay
                    </button>
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Voucher cho sản phẩm tùy chọn</h2>
                  <p>Voucher chỉ áp dụng cho các sản phẩm nhất định của Shop được chọn</p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => {
                        setModalType('create')
                        const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                        dialog.showModal()
                      }}
                      className="btn btn-primary text-white"
                    >
                      Tạo ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>

      <div className="card shadow-lg bg-white mt-2">
        <div className="card-body">
          <span className="font-bold text-xl">Danh sách voucher của shop</span>
          <div>
            <DataTable
              expandableRowsComponent={ExpandedComponent}
              expandableRows
              progressPending={isLoadingVouchers}
              columns={columns}
              data={vouchers?.data.data}
              pagination
            />
            ;
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiscountManagement
