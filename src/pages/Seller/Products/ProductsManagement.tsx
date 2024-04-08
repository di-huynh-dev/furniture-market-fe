import { LoadingComponent } from '@/components'
import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ProductDetailType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'
import DataTable, { TableColumn } from 'react-data-table-component'

const ProductsManagement = () => {
  const axiosPrivate = useAxiosPrivate()

  const { data: products, isLoading } = useQuery({
    queryKey: [QueryKeys.SHOP_PRODUCTS],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/product')
      console.log(resp)

      return resp
    },
  })

  const handleDelete = () => {}

  const handleUpdate = () => {}

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
          <button>Chỉnh sửa</button>
          <button>Xóa</button>
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
          <p className="font-bold">Mã danh mục</p>
          <p>{data.categoryId}</p>
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
