import banner from '@/assets/images/discount.jpg'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface DataRow {
  id: string
  name: string
  action: React.ReactNode
}

const DiscountManagement = () => {
  const data = [
    {
      id: '1',
      name: 'xxxxxx',
    },
    {
      id: '2',
      name: 'xxxxxx',
    },
  ]
  const columns: TableColumn<DataRow>[] = [
    {
      name: 'Mã Voucher',
      selector: (row) => row.id,
    },
    {
      name: 'Tên Voucher',
      selector: (row) => row.name,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 text-blue-500">
          <button onClick={() => handleUpdate(row.id)}>Chỉnh sửa</button>
          <button
          // onClick={() => {
          //   setSelectedRow(row.id)
          //   const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
          //   dialog.showModal()
          // }}
          >
            Xóa
          </button>
        </div>
      ),
    },
  ]

  const handleUpdate = (id: string) => {
    console.log(id)
  }

  const validationSchema = yup.object({
    name: yup.string().required('Không được để trống!'),
    voucher: yup.string().required('Không được để trống!'),
  })
  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tạo Voucher cho toàn shop</h3>
          <div className="">
            <div className="grid grid-cols-2 gap-2">
              <p>Loại mã</p>
              <p>Voucher cho toàn Shop</p>
            </div>
            <div className="grid grid-cols-2 gap-2 ">
              <p>Tên chương trình giảm giá</p>
              <p>Voucher cho toàn Shop</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p>Mã voucher</p>
              <p>Voucher cho toàn Shop</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p>Thời gian sử dụng</p>
              <p>Voucher cho toàn Shop</p>
            </div>
          </div>
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
                    <button className="btn btn-primary text-white">Tạo ngay</button>
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
            <DataTable columns={columns} data={data} pagination />;
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiscountManagement
