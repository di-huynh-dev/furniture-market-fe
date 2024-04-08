import { LoadingComponent } from '@/components'
import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProductDetailType } from '@/types/product.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const ProductsManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [selectedRow, setSelectedRow] = useState('')
  const client = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: [QueryKeys.SHOP_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/product')
      return resp
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.delete(`/seller/product/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries({
        queryKey: [QueryKeys.SHOP_PRODUCTS],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // const handleUpdate = () => {}

  const columns: TableColumn<ProductDetailType>[] = [
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
      name: 'Số lượng kho',
      selector: (row) => row.inStock,
      sortable: true,
    },
    {
      name: 'Giá bán',
      selector: (row) => row.salePrice,
      sortable: true,
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
      <div className="text-sm grid grid-cols-4 gap-2">
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
          <p className="font-bold">Thumbnail</p>
          <img src={data.thumbnail} alt="Thumbnail sản phẩm" className="w-18 h-18" />
        </div>
        <div>
          <p className="font-bold">Hình ảnh sản phẩm</p>
          <div className="flex">
            {data.images.map((image) => (
              <img key={image} src={image} alt="Hình ảnh sản phẩm" className="w-18 h-18" />
            ))}
          </div>
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
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Danh sách sản phẩm của shop</span>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={products?.data.data}
              pagination
              progressPending={isLoading}
              progressComponent={<LoadingComponent />}
              expandableRowsComponent={ExpandedComponent}
              expandableRows
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductsManagement
