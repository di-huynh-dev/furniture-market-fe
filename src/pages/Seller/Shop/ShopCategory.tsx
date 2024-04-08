import { LoadingComponent } from '@/components'
import { QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'

interface DataRow {
  id: string
  name: string
  action: React.ReactNode
}

const ShopCategory = () => {
  const axiosPrivate = useAxiosPrivate()
  const [isUpdate, setIsUpdate] = useState(false)
  const [selectedRow, setSelectedRow] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const client = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SHOP_CATEGORY],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/category')
      return resp
    },
  })
  const columns: TableColumn<DataRow>[] = [
    {
      name: 'Mã danh mục ',
      selector: (row) => row.id,
    },
    {
      name: 'Tên danh mục',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div className="flex gap-2 text-blue-500">
          <button onClick={() => handleUpdate(row.id)}>Chỉnh sửa</button>
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

  const handleUpdate = (id: string) => {
    setIsUpdate(true)
    setSelectedRow(id)
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
    dialog.showModal()
  }

  const updateCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.put(`/seller/category/${id}`, { name: categoryName })
      return resp
    },
    onSuccess: (resp) => {
      setCategoryName('')
      client.invalidateQueries({
        queryKey: [QueryKeys.SHOP_CATEGORY],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const addCategoryMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosPrivate.post('/seller/category', { name: categoryName })
      console.log(resp)

      return resp
    },
    onSuccess: (resp) => {
      setCategoryName('')
      client.invalidateQueries({
        queryKey: [QueryKeys.SHOP_CATEGORY],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error: Error) => {
      if (error.message === 'Request failed with status code 400') {
        toast.error('Bạn chưa cung cấp đủ thông tin cửa hàng')
      }
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.delete(`/seller/category/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      client.invalidateQueries({
        queryKey: [QueryKeys.SHOP_CATEGORY],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận</h3>
          <p className="py-4">Bạn có chắc chắn muốn xóa danh mục?</p>
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

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{isUpdate ? 'Cập nhật' : 'Thêm'} danh mục</h3>
          <input
            type="text"
            placeholder="Nhập tên danh mục"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="input input-bordered w-full max-w-xs my-2"
          />
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button
                  className="btn btn-primary text-white"
                  onClick={() => {
                    if (isUpdate) {
                      updateCategoryMutation.mutate(selectedRow)
                    } else {
                      addCategoryMutation.mutate()
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
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Danh mục hàng của shop</span>
            <button
              onClick={() => {
                setIsUpdate(false)
                const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn btn-outline btn-primary"
            >
              + Thêm danh mục
            </button>
          </div>

          <div>
            <DataTable
              columns={columns}
              data={data?.data.data}
              pagination
              progressPending={isLoading}
              progressComponent={<LoadingComponent />}
            />
            ;
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopCategory
