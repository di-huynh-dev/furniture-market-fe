/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useImagePreview from '@/hooks/useImagePreview'
import { ReportedType } from '@/types/reported.type'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import toast from 'react-hot-toast'

const BannedProduct = () => {
  const axiosPrivate = useAxiosPrivate()
  const [selectedRow, setSelectedRow] = useState('')
  const [images, setImages] = useState<File[]>([])
  const { previewImages, handleFileChange } = useImagePreview()
  const [description, setDescription] = useState('')

  const { data: bannedProducts, isLoading: isLoadingBannedProducts } = useQuery({
    queryKey: [Seller_QueryKeys.REPORTED_PRODUCTS],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/seller/report/product')
        if (resp.status === 200) {
          return resp.data.data
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  const handleExplainReport = async () => {
    try {
      if (!description || images.length === 0) {
        toast.error('Vui lý nhập đầy đủ thông tin!')
        return
      }

      const formData = new FormData()

      const info = {
        description: description,
        reportId: selectedRow,
      }
      const json = JSON.stringify(info)
      const blob = new Blob([json], {
        type: 'application/json',
      })
      formData.append('info', blob)
      for (const image of images) {
        formData.append('images', image)
      }

      const resp = await axiosPrivate.post('/seller/report/explanation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
        dialog.close()
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const columns: TableColumn<ReportedType>[] = [
    {
      name: 'Tên sản phẩm',
      selector: (row) => row.objectInfo.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Lý do',
      cell: (row) => row.reason,
      sortable: true,
    },
    {
      name: 'Mô tả thêm',
      cell: (row) => row.description,
    },
    {
      name: 'Giải trình',
      selector: (row) => (row.explanations.length > 0 ? 'Đã giải trình' : 'Chưa giải trình'),
    },
    {
      name: 'Trạng thái',
      cell: (row) => {
        switch (row.status) {
          case 'PENDING':
            return 'Chờ xử lý'
          case 'PROCESSING':
            return 'Đang xử lý'
          case 'ACCEPTED':
            return 'Đã chấp nhận'
          default:
            return ''
        }
      },
    },
    {
      name: 'Thao tác',
      cell: (row) => (
        <>
          {row.status === 'PENDING' ? (
            <button
              onClick={() => {
                setSelectedRow(row.id)
                const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                dialog.showModal()
              }}
              className="link text-blue-500"
            >
              Giải trình
            </button>
          ) : (
            <p className="italic">Hoàn tất xử lý</p>
          )}
        </>
      ),
    },
  ]

  const ExpandedComponent = ({ data }: { data: ReportedType }) => {
    return (
      <div className=" my-10">
        <p>Kết quả giải trình:</p>
        <p className="font-bold">{data.explanations?.map((explanation) => explanation.description)}</p>
        <p className="font-bold">{data.explanations?.length === 0 && 'Chưa có kết quả'}</p>
      </div>
    )
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Giải trình vi phạm</h3>
          <p>Hình ảnh minh chứng</p>
          <input
            id="logo"
            type="file"
            accept="image/*"
            className="input input-bordered text-sm"
            onChange={(e) => {
              handleFileChange(e)
              setImages(Array.from(e.target.files || []))
            }}
            multiple
          />
          <div className="grid grid-cols-4 gap-2">
            {previewImages &&
              previewImages.map((image, index) => (
                <div key={`back-${index}`} className="mt-2 flex">
                  <img src={image} alt={`Back Preview ${index}`} className="w-80 h-60 object-contain" />
                </div>
              ))}
          </div>
          <div>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Mô tả thêm"
            ></textarea>
          </div>
          <div className="modal-action">
            <div className="flex gap-2">
              <button onClick={handleExplainReport} className="btn btn-primary text-white">
                Gửi
              </button>
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                  dialog.close()
                }}
                className="btn"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <DataTable
            title="Danh sách sản phẩm vi phạm"
            columns={columns}
            data={bannedProducts}
            progressPending={isLoadingBannedProducts}
            progressComponent={<LoadingComponent />}
            pagination
            expandableRowsComponent={ExpandedComponent}
            expandableRows
          />
        </div>
      </div>
    </section>
  )
}

export default BannedProduct
