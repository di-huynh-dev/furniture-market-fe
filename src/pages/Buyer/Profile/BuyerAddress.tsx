/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormInput } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import useLocation from '@/hooks/useLocation'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import axiosClient from '@/libs/axios-client'
import { toast } from 'react-toastify'

interface Location {
  id: string
  name: string
}

type FormData = {
  address: string
  phone: string
  receiver: string
}

type DeliveryAddress = {
  id: string
  deliveryAddress: string
  receiverPhone: string
  receiverName: string
}

const BuyerAddress = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('')
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('')
  const [selectedCommune, setSelectedCommune] = useState<string>('')
  const [selectedCommuneId, setSelectedCommuneId] = useState<string>('')
  const { districtData, communeData } = useLocation(selectedProvinceId, selectedDistrictId)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [addressId, setAddressId] = useState<string>('')
  const queryClient = useQueryClient()

  const handleProvinceChange = (provinceId: string, provinceName: string) => {
    setSelectedProvinceId(provinceId)
    setSelectedDistrictId('')
    setSelectedProvinceName(provinceName)
  }

  const handleDistrictChange = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId)
    setSelectedDistrictName(districtName)
  }

  const handleCommuneChange = (communeId: string, communeName: string) => {
    setSelectedCommuneId(communeId)
    setSelectedCommune(communeName)
  }

  const { data: provinces, isLoading: isLoadingProvince } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const resp = await axiosClient.get('/address/province-city')
      return resp.data.data
    },
  })

  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_ADDRESS],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/buyer/delivery-address')
      return resp.data.data
    },
  })

  const handleFormSubmit = async (data: FormData) => {
    if (selectedProvinceId === '' || selectedDistrictId === '' || selectedCommuneId === '') {
      toast.error('Vui lý chọn/nhập đầy đủ thông tin!')
    }

    try {
      const detailAddress = `${data.address}, ${selectedCommune}, ${selectedDistrictName}, ${selectedProvinceName}`
      if (!isUpdateMode) {
        const resp = await axiosPrivate.post('/buyer/delivery-address', {
          receiver: data.receiver,
          phone: data.phone,
          detailAddress: detailAddress,
          townId: selectedCommuneId,
        })
        if (resp.status === 200) {
          toast.success(resp.data.messages[0])
          queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_ADDRESS] })
          resetForm()
        } else {
          toast.error('Lỗi')
        }
      } else {
        const resp = await axiosPrivate.put(`/buyer/delivery-address/${addressId}`, {
          receiver: data.receiver,
          phone: data.phone,
          detailAddress: detailAddress,
          townId: selectedCommuneId,
        })
        if (resp.status === 200) {
          toast.success(resp.data.messages[0])
          queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_ADDRESS] })
          reset()
        } else {
          toast.error('Lỗi')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const resetForm = () => {
    reset()
    setSelectedCommuneId('')
    setSelectedCommune('')
    setSelectedDistrictId('')
    setSelectedDistrictName('')
    setSelectedProvinceId('')
    setSelectedProvinceName('')
    setIsUpdateMode(false)
  }
  const handleSetDefault = async (addressId: string) => {
    try {
      const resp = await axiosPrivate.patch(`/buyer/delivery-address/default`, {
        defaultAddressId: addressId,
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_ADDRESS] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const resp = await axiosPrivate.delete(`/buyer/delivery-address/${addressId}`)
      return resp
    },
    onSuccess: (resp) => {
      toast.success(resp.data.messages[0])
      queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_ADDRESS] })
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const validationSchema = yup.object({
    address: yup.string().required('Vui lòng nhập địa chỉ '),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    receiver: yup.string().required('Vui lòng nhập tên người nhận'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })

  if (isLoadingProvince || isLoadingAddress) return <>Loading</>

  return (
    <div className="mx-4 my-2">
      <dialog className="modal" id="my_modal_8">
        <div className="modal-box max-w-3xl">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {!isUpdateMode ? (
              <h3 className="font-bold text-lg">Thêm địa chỉ mới</h3>
            ) : (
              <h3 className="font-bold text-lg">Cập nhật địa chỉ</h3>
            )}
            <div className="grid grid-cols-3 my-2 gap-2">
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedProvinceId}
                onChange={(e) => handleProvinceChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((province: Location) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
              >
                <option disabled selected>
                  Chọn quận, huyện
                </option>
                {districtData &&
                  districtData.map((district: Location) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedCommuneId}
                onChange={(e) => (
                  e.target.value, handleCommuneChange(e.target.value, e.target.options[e.target.selectedIndex].text)
                )}
              >
                <option disabled selected>
                  Chọn xã, phường
                </option>
                {communeData &&
                  communeData.map((commune: Location) => (
                    <option key={commune.id} value={commune.id}>
                      {commune.name}
                    </option>
                  ))}
              </select>
            </div>
            <FormInput
              prop="address"
              type="text"
              label="Địa chỉ cụ thể(*)"
              register={register}
              placeholder="Số nhà 34/2, đường Nguyễn Thái Học"
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
            <FormInput
              prop="receiver"
              type="text"
              label="Tên người nhận(*)"
              register={register}
              placeholder="Số nhà 34/2, đường Nguyễn Thái Học"
            />
            {errors.receiver && <p className="text-red-500">{errors.receiver.message}</p>}
            <FormInput prop="phone" type="text" label="Số điện thoại(*)" register={register} placeholder="0376232522" />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            <div className="modal-action">
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
                  dialog.close()
                }}
                className="btn"
              >
                Đóng
              </button>
              <button type="submit" className="btn btn-primary text-white">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Địa chỉ của tôi</div>
            <div className="text-gray-500 text-sm">Thông tin về địa chỉ nhận hàng và trả hàng</div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
                dialog.showModal()
              }}
              className="btn text-white btn-primary  btn-sm lg:btn-md"
            >
              <BiPlus /> Thêm địa chỉ mới
            </button>
          </div>
        </div>
      </div>
      {addresses?.deliveryAddresses.length === 0 ? (
        <>
          <p className="text-center text-error">Vui lòng thêm địa chỉ nhận hàng!</p>
        </>
      ) : (
        <div className="flex flex-col w-full">
          {addresses?.deliveryAddresses.map((address: DeliveryAddress) => (
            <div className="grid h-30 card rounded-box space-y-2 lg:text-base text-sm">
              <div className="flex justify-between">
                <div>
                  <span>
                    {address.receiverName} | {address.receiverPhone}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setIsUpdateMode(true)
                      setAddressId(address.id)
                      const dialog = document.getElementById('my_modal_8') as HTMLDialogElement
                      dialog.showModal()
                    }}
                    className="link link-primary"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <span className="text-gray-500">{address.deliveryAddress}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
                      dialog.showModal()
                    }}
                    className="link link-primary"
                  >
                    Xóa
                  </button>
                  {/* delete */}
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Xác nhận</h3>
                      <p className="py-4">Bạn có chắc chắn muốn xóa địa chỉ này?</p>
                      <div className="modal-action">
                        <form method="dialog">
                          <div className="flex gap-2">
                            <button
                              className="btn btn-primary text-white"
                              onClick={() => deleteMutation.mutate(address.id)}
                            >
                              Xác nhận
                            </button>
                            <button className="btn">Đóng</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
              <div className="">
                {addresses.defaultAddressId === address.id ? (
                  <span>
                    <span className="text-accent font-semibold">Mặc định</span>
                  </span>
                ) : (
                  <>
                    <button className="text-primary" onClick={() => handleSetDefault(address.id)}>
                      Đặt làm mặc định
                    </button>
                  </>
                )}
              </div>
              <div className="divider"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuyerAddress
