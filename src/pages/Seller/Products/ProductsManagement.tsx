/* eslint-disable @typescript-eslint/no-explicit-any */
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProductDetailType } from '@/types/product.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '@/utils/helpers'
import { CiEdit, CiTrash } from 'react-icons/ci'
import { LoadingComponent } from '@/components'
import { FaBan, FaCheck } from 'react-icons/fa6'

const ProductsManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [selectedRow, setSelectedRow] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const client = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest Seller - Tất cả sản phẩm'
  }, [])

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

  const handleTabClick = (category: string) => {
    setActiveTab(category)
  }

  const filteredProducts = products?.data.data
    .filter((product: ProductDetailType) => activeTab === 'ALL' || product.storeCategories.includes(activeTab))
    .filter((product: ProductDetailType) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const columns: TableColumn<ProductDetailType>[] = [
    {
      name: 'Mã sản phẩm ',
      selector: (row) => row.id,
      wrap: true,
    },
    {
      name: 'Hình ảnh',
      cell: (row) => (
        <div className="w-18">
          <img src={row.thumbnail} alt={row.name} className="max-h-14" />
        </div>
      ),
    },
    {
      name: 'Tên sản phẩm',
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Danh mục',
      selector: (row) => row.storeCategories.join(', '),
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
      name: 'Trạng thái',
      cell: (row) => (
        <>{!row.hidden ? <FaCheck className="text-green-500 w-5 h-5" /> : <FaBan className="text-red-500 w-5 h-5" />}</>
      ),
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="lg:flex gap-2 text-blue-500">
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
              <p className="font-bold">Danh mục sàn</p>
              <p>{data.categoryName}</p>
            </div>
            <div>
              <p className="font-bold">Giá nhập kho</p>
              <p>{formatPrice(data.price)}</p>
            </div>
            <div>
              <p className="font-bold">Giá bán</p>
              <p>{formatPrice(data.salePrice)}</p>
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
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingComponent />

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
        <div className="lg:card-body">
          <div role="tablist" className="tabs tabs-lifted">
            <div
              role="tab"
              onClick={() => handleTabClick('ALL')}
              className={`tab ${
                activeTab === 'ALL' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
            >
              Tất cả
            </div>
            {products?.data.data
              .reduce((categories: string[], product: ProductDetailType) => {
                product.storeCategories.forEach((category) => {
                  if (!categories.includes(category)) categories.push(category)
                })
                return categories
              }, [])
              .map((category: string) => (
                <div
                  key={category}
                  role="tab"
                  onClick={() => handleTabClick(category)}
                  className={`tab ${
                    activeTab === category ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
                  }`}
                >
                  {category}
                </div>
              ))}
          </div>
          <DataTable
            title={
              <div className="lg:flex justify-between items-center gap-2">
                <p className="lg:text-xl text-lg">DANH SÁCH TẤT CẢ SẢN PHẨM CỦA SHOP</p>
                <div className="flex gap-2 my-2 lg:my-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="input input-bordered"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        onClick={() => navigate('/seller/products/new')}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        + Thêm sản phẩm mới
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
            columns={columns}
            data={filteredProducts}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            highlightOnHover
            pointerOnHover
            pagination
          />
        </div>
      </div>
    </section>
  )
}

export default ProductsManagement
