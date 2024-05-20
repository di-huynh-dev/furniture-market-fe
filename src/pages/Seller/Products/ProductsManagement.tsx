/* eslint-disable @typescript-eslint/no-explicit-any */
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProductDetailType } from '@/types/product.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { BsToggleOn, BsToggleOff } from 'react-icons/bs'
import { formatPrice } from '@/utils/helpers'
import { CiEdit, CiTrash, CiLock } from 'react-icons/ci'

const ProductsManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [selectedRow, setSelectedRow] = useState('')
  const client = useQueryClient()
  const navigate = useNavigate()

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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.delete(`/seller/product/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries({
        queryKey: [Seller_QueryKeys.SHOP_PRODUCTS],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const columns: TableColumn<ProductDetailType>[] = [
    {
      name: 'Mã sản phẩm ',
      selector: (row) => row.id,
      wrap: true,
    },

    {
      name: 'Tên sản phẩm',
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Danh mục',
      selector: (row) => row.storeCategories[0],
      sortable: true,
    },
    {
      name: 'Số lượng kho',
      selector: (row) => row.inStock,
    },
    {
      name: 'Giá bán',
      selector: (row) => formatPrice(row.price),
      sortable: true,
    },
    {
      name: 'Trạng thái hiển thị',
      cell: (row) => <>{row.onDisplay ? <BsToggleOn className="text-green-500 w-12 h-12" /> : <BsToggleOff />}</>,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 text-blue-500">
          <Link to={`/seller/products/update/${row.id}`}>
            <button>Chỉnh sửa</button>
          </Link>
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

  const ExpandedComponent = ({ data }: { data: ProductDetailType }) => {
    return (
      <div>
        <div className="grid lg:grid-cols-2 grid-col-1 gap-10 align-element bg-white p-5 my-5">
          <div className="grid grid-cols-2 gap-2">
            {data.images.map((image) => (
              <img key={image} src={image} alt="Hình ảnh sản phẩm" className="w-18 h-18" />
            ))}
          </div>
          <div>
            <div>
              <p className="font-bold">Mã sản phẩm</p>
              <p>{data.id}</p>
            </div>
            <div>
              <p className="font-bold">Chất liệu</p>
              <p>{data.material}</p>
            </div>
            <div>
              <p className="font-bold">Đã bán</p>
              <p>{data.sold}</p>
            </div>
            <div>
              <p className="font-bold">Danh mục hàng</p>
              {data.storeCategories?.map((category) => (
                <p key={category}>{category}</p>
              ))}
            </div>
            <div>
              <p className="font-bold">Điểm đánh giá</p>
              <p> {data.totalReviewPoint}</p>
            </div>
            <div>
              <p className="font-bold">Sản phẩm nổi bật</p>
              <p> {data.featured ? 'Có' : 'Không'}</p>
            </div>
            <div>
              <p className="font-bold">Mô tả</p>
              <p> {data.description}</p>
            </div>
            <div>
              <p className="font-bold">Trạng thái sử dụng</p>
              <p> {data.used ? 'Đã sử dụng' : 'Mới'}</p>
            </div>
            <div>
              <p className="font-bold">Thông tin vận chuyển</p>
              <p>Chiều dài: {data.width} cm</p>
              <p>Chiều rộng: {data.length} cm</p>
              <p>Chiều cao: {data.height} cm</p>
              <p>Cân nặng: {data.weight} gram</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Link to={`/seller/products/update/${data.id}`} className="btn btn-success text-white">
            <CiEdit className="w-6 h-6" /> Cập nhật
          </Link>

          <button
            onClick={() => {
              setSelectedRow(data.id)
              const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
              dialog.showModal()
            }}
            className="btn btn-error text-white"
          >
            <CiTrash className="w-6 h-6" /> Xóa
          </button>
          <button className="btn btn-primary text-white">
            <CiLock className="w-6 h-6" /> Ngừng kinh doanh
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận</h3>
          <p className="py-4">Bạn có chắc chắn muốn xóa sản phẩm này?</p>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={() => deleteCategoryMutation.mutate(selectedRow)}
                >
                  Xác nhận
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div>
            <DataTable
              columns={columns}
              title={
                <div className="flex justify-between items-center gap-2">
                  <p>Danh sách sản phẩm của shop</p>
                  <div className="flex gap-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="input input-bordered flex items-center gap-2">
                          <input type="text" className="grow" placeholder="Tìm kiếm theo tên" />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-4 h-4 opacity-70"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/seller/products/new')}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    + Thêm sản phẩm mới
                  </button>
                </div>
              }
              data={products?.data.data}
              pagination
              progressPending={isLoading}
              expandableRowsComponent={ExpandedComponent}
              expandableRows
              pointerOnHover
              highlightOnHover
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductsManagement
