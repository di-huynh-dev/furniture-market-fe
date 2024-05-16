/* eslint-disable @typescript-eslint/no-explicit-any */
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import banner from '@/assets/images/marketing.jpg'
import { useState } from 'react'
import { Seller_QueryKeys } from '@/constants/query-keys'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import DataTable, { TableColumn } from 'react-data-table-component'
import { MarketingProductType, ProductDetailType } from '@/types/product.type'
import { LoadingComponent } from '@/components'
import { formatDate } from '@/utils/helpers'

const MarketingManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const [productIds, setProductIds] = useState<string[]>([])
  const [isShowProductList, setIsShowProductList] = useState(false)
  const [isShowKeywordList, setIsShowKeywordList] = useState(false)
  const [packet, setPacket] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')

  const { data: products, isLoading: isLoadingProducts } = useQuery({
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

  const { data: marketingProducts, isLoading: isLoadingMarketing } = useQuery({
    queryKey: [Seller_QueryKeys.SHOP_MARKETING_PRODUCT],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/seller/marketing-product')
        if (resp.status === 200) {
          return resp.data.data
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  const handleAddMarketing = async () => {
    try {
      if (!packet || !keywords || !productIds) {
        toast.error('Vui lòng nhập đầy đủ thông tin!')
        return
      }
      const resp = await axiosPrivate.post('/seller/marketing-product', {
        packet,
        keywords,
        productIds,
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        setIsShowProductList(false)
        setIsShowKeywordList(false)
        setProductIds([])
        setKeywords([])
        setPacket('')
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columnsProduct: TableColumn<ProductDetailType>[] = [
    {
      name: 'Hình ảnh',
      cell: (row) => <img src={row.thumbnail} alt={row.name} className="w-[100px]" />,
    },

    {
      name: 'Tên sản phẩm',
      selector: (row) => row.name,
      sortable: true,
    },
  ]

  const columnsMarkProduct: TableColumn<MarketingProductType>[] = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Gói quảng cáo',
      selector: (row) => row.packet,
      sortable: true,
    },
    {
      name: 'Danh sách sản phẩm',
      cell: (row) => (
        <div>
          {row.productIds.map((id) => (
            <p key={id}>{id}</p>
          ))}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Danh sách từ khóa',
      cell: (row) => (
        <div>
          {row.keywords.map((id) => (
            <p key={id}>{id}</p>
          ))}
        </div>
      ),
    },
    {
      name: 'Ngày bắt đầu',
      selector: (row) => formatDate(row.startDate),
    },
    {
      name: 'Ngày kết thúc',
      selector: (row) => formatDate(row.endDate),
    },
  ]

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg capitalize">Đăng ký marketing sản phẩm</h3>
          <p>Chọn loại quảng cáo (*)</p>
          <select onChange={(e) => setPacket(e.target.value)} className="select select-bordered w-full max-w-xs">
            <option disabled selected>
              Chọn loại hình quảng cáo
            </option>
            <option value={'BASIC'}>Basic (Gói cơ bản)</option>
            <option value={'MEDIUM'}>Medium (Gói trung bình)</option>
            <option value={'PREMIUM'}>Premium (Gói cao cấp)</option>
          </select>

          <div>
            <button onClick={() => setIsShowProductList(!isShowProductList)} className="btn btn-sm my-2 btn-ghost">
              Chọn sản phẩm quảng cáo
            </button>
            {isShowProductList && (
              <div className="">
                <h3 className="font-bold">Danh sách sản phẩm</h3>
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
                    progressPending={isLoadingProducts}
                    progressComponent={<LoadingComponent />}
                  />
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsShowKeywordList(!isShowKeywordList)} className="btn btn-sm my-2 btn-ghost">
            Thêm từ khoá
          </button>
          {isShowKeywordList && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <input
                  onChange={(e) => setNewKeyword(e.target.value)}
                  type="text"
                  className="input input-bordered"
                  placeholder="Nhập từ khóa"
                />
                <button
                  onClick={() => setKeywords([...keywords, newKeyword])}
                  className="btn btn-sm btn-primary text-white"
                >
                  Thêm
                </button>
              </div>
              <div className="space-x-2 space-y-2">
                <p>Danh sách từ khóa:</p>
                {keywords?.map((keyword) => (
                  <div className="badge badge-neutral">{keyword}</div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button onClick={handleAddMarketing} className="btn btn-primary text-white">
                  Lưu
                </button>
                <button className="btn">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <div className="card shadow-lg bg-white">
        <div className="grid grid-cols-3 gap-2 p-10 items-center">
          <div className="col-span-2">
            <p className="font-bold text-2xl text-primary">
              Tạo Chiến dịch quảng cáo ngay để mở rộng phạm vi tiếp cận đến những người mua tiềm năng !
            </p>
            <p>
              Quảng cáo sẽ hiển thị tại trang kết quả tìm kiếm khi người mua tìm kiếm với từ khóa mà bạn đã thiết lập
              cho sản phẩm đấu thầu của mình.
            </p>
            <p className="text-lg font-bold text-center my-2">Tại sao nên sử dụng Quảng cáo Tìm Kiếm Sản Phẩm?</p>
            <div className="flex gap-2 justify-center items-center my-10">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Tăng độ hiển thị</h2>
                  <p>Đẩy sản phẩm của bạn hiển thị ở các vị trí đầu Trang kết quả tìm kiếm.</p>
                </div>
              </div>
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Tăng doanh số</h2>
                  <p>
                    Mở rộng phạm vi tiếp cận đến những người mua tiềm năng thông qua việc sử dụng từ khoá có liên quan
                    đến các sản phẩm bạn đang quảng cáo.
                  </p>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary text-white"
              onClick={() => {
                const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                dialog.showModal()
              }}
            >
              + Tạo chiến dịch
            </button>
          </div>
          <div>
            <img src={banner} alt="banner" />
          </div>
        </div>
      </div>

      <div className="card shadow-lg bg-white my-2">
        <DataTable
          title="Danh sách Chiến dịch quảng cáo"
          columns={columnsMarkProduct}
          data={marketingProducts}
          progressPending={isLoadingMarketing}
          progressComponent={<LoadingComponent />}
          pagination
        />
      </div>
    </section>
  )
}

export default MarketingManagement
